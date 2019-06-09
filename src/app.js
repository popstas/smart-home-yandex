const mqtt = require('mqtt');
const loki = require('lokijs');
const api = require('./restApi');
const device = require('./device');
const config = require('./config');

global.devices = [];

global.db = new loki(config.db.path, {
  autoload: true,
  autosave: true,
  autosaveInterval: 5000,
  autoloadCallback() {
    global.auth = global.db.getCollection('auth');
    if (global.auth === null) {
      global.auth = global.db.addCollection('auth');
    }

    global.users = global.db.getCollection('users');
    if (global.users === null) {
      global.users = global.db.addCollection('users');
    }
    console.log('global.users.data: ', global.users.data.length);
  }
});


if(config.devices) {
  config.devices.forEach(opts => {
    new device(opts);
  });
}

new api();

console.log('Connecting to MQTT...');
const client = mqtt.connect(`mqtt://${config.mqtt.host}`, {
  port: config.mqtt.port,
  username: config.mqtt.user,
  password: config.mqtt.password
});

// чтобы не добавлять в конфиг инстанс mqtt client, это делается здесь:
// если есть device.data.custom_data.mqtt.stat, слушаем изменения состояния устройства
// формат прошивки tasmota (должно приходить ON/1/true или OFF/0/false)
const statPairs = [];
global.devices.forEach(device => {
  device.client = client; // передаём клиент в каждый инстанс

  const statTopic = device.data.custom_data.mqtt.stat || false;
  if (statTopic) {
    statPairs.push({ deviceId: device.data.id, topic: statTopic });
  }
});

if (statPairs) {
  client.on('connect', () => {
    console.log('MQTT connected to ' + config.mqtt.host);
    client.subscribe(statPairs.map(pair => pair.topic));
    client.on('message', (topic, message) => {
      const matchedDeviceId = statPairs.findIndex(pair => topic.toLowerCase() === pair.topic.toLowerCase());
      if (matchedDeviceId == -1) return;

      const device = global.devices.find(device => device.data.id == matchedDeviceId);
      const val = ['on', '1', 'true'].includes(message.toString().toLowerCase());

      device.data.capabilities[0].state.value = val;
      console.log(`update device ${device.data.name} (${device.data.room}) state: `, device.data.capabilities[0].state);
    });
  });

  client.on('offline', () => {
    console.log('MQTT offline');
  });
}
