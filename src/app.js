const path = require('path');
const mqtt = require('mqtt');
const api = require('./restApi');
const device = require('./device');
const config = require('./config');

global.getDeviceById = id => {
  return global.devices.find(dev => dev.data.id === id);
}

// устройства хранятся в global.devices
global.updateDevices = () => {
  // clear cache
  const filename = path.resolve('./src/config.js');
  delete require.cache[filename];

  const config = require('./config');

  // сохраняем состояния
  const states = {};
  for(let d of devices) {
    const state = { capabilities: {}, properties: {}};
    for(let c of d.data.capabilities) {
      state.capabilities[c.state.instance] = c.state.value;
    }
    for(let p of d.data.properties) {
      state.properties[p.state.instance] = p.state.value;
    }
    states[d.data.id] = state;
  }

  global.devices = [];
  if(config.devices) {
    config.devices.forEach(opts => {
      new device(opts);
    });
  }

  // возвращаем состояния
  for(let d of global.devices) {
    const state = states[d.data.id];
    if (!state) continue;
    for (let instance in state.capabilities) {
      const cap = d.data.capabilities.find(item => item.state && item.state.instance === instance);
      cap.state.value = state.capabilities[instance];
    }
    for (let instance in state.properties) {
      const prop = d.data.properties.find(item => item.state && item.state.instance === instance);
      prop.state.value = state.properties[instance];
    }
  }

  // заменяем {set, stat} на {on: {set, stat}}
  global.devices.forEach(device => {
    const onInstance = { set: '', stat: '' };
    for (let topic in onInstance) {
      if (device.data.custom_data.mqtt[topic] !== undefined) {
        onInstance[topic] = device.data.custom_data.mqtt[topic];
        delete device.data.custom_data.mqtt[topic];
      }
    }

    if (device.getCapabilityByType('devices.capabilities.on_off')) {
      device.data.custom_data.mqtt.on = onInstance;
    }
  });

  // если есть device.data.custom_data.mqtt.stat, слушаем изменения состояния устройства
  // формат прошивки tasmota (должно приходить ON/1/true или OFF/0/false)
  global.statPairs = [];
  global.devices.forEach(device => {
    for (let instance in device.data.custom_data.mqtt) {
      const topics = device.data.custom_data.mqtt[instance];

      const statTopic = topics.stat || false;
      if (statTopic) {
        statPairs.push({ deviceId: device.data.id, topic: statTopic, instance: instance });
      }
    }
  });

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
global.client = client;

if (global.statPairs) {
  client.on('connect', () => {
    console.log('MQTT connected to ' + config.mqtt.host);
    client.subscribe(global.statPairs.map(pair => pair.topic));
    client.on('message', (topic, message) => {
      const matchedPairs = global.statPairs.filter(pair => topic.toLowerCase() === pair.topic.toLowerCase());
      if (!matchedPairs) return;

      for(let matchedPair of matchedPairs) {
        const device = global.devices.find(device => device.data.id == matchedPair.deviceId);
        const instance = matchedPair.instance;
        const capability = device.getCapabilityByInstance(instance);
        const property = device.getPropertyByInstance(instance);

        let val;
        switch(instance) {
          case 'on':
            val = ['on', '1', 'true'].includes(message.toString().toLowerCase());
            break;

          case 'temperature':
          case 'volume':
          case 'humidity':
          case 'amperage':
          case 'battery_level':
          case 'co2_level':
          case 'power':
          case 'voltage':
          case 'water_level':
            val = parseFloat(message.toString());
            break;

          default:
            val = message.toString().toLowerCase();
        }

        if (capability) {
          capability.state.value = val;
          // console.log(`update device ${device.data.name} (${device.data.room}) capability: `, capability.state);
        }
        if (property) {
          property.state.value = val;
          // console.log(`update device ${device.data.name} (${device.data.room}) property: `, property.state);
        }
      }
    });
  });

  client.on('offline', () => {
    console.log('MQTT offline');
  });
}
