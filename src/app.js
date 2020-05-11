const path = require('path');
const mqtt = require('mqtt');
const api = require('./restApi');
const device = require('./device');
const config = require('./config');

// устройства хранятся в global.devices
global.updateDevices = () => {
  // clear cache
  const filename = path.resolve('./src/config.js');
  delete require.cache[filename];

  const config = require('./config');
  global.devices = [];
  if(config.devices) {
    config.devices.forEach(opts => {
      new device(opts);
    });
  }
};

global.devices = [];
global.updateDevices();

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
      const matchedPair = statPairs.find(pair => topic.toLowerCase() === pair.topic.toLowerCase());
      if (!matchedPair) return;

      const device = global.devices.find(device => device.data.id == matchedPair.deviceId);
      const val = ['on', '1', 'true'].includes(message.toString().toLowerCase());

      device.data.capabilities[0].state.value = val;
      console.log(`update device ${device.data.name} (${device.data.room}) state: `, device.data.capabilities[0].state);
    });
  });

  client.on('offline', () => {
    console.log('MQTT offline');
  });
}
