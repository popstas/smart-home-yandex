const md5 = require('md5');

class device {
  constructor(options) {
    this.data = {
      id: '',
      name: options.name || 'Без названия',
      description: options.description || '',
      type: options.type || 'devices.types.light',
      room: options.room || '',
      custom_data: {
        mqtt: options.mqtt || {}
      },
      capabilities: options.capabilities || [
        {
          type: 'devices.capabilities.on_off',
          retrievable: true,
          state: {
            instance: 'on',
            value: false
          }
        }
      ]
    };

    this.data.id = md5(this.data.name + this.data.room);
    global.devices.push(this);
  }

  getCapabilityByType(type) {
    return this.data.capabilities.find(cap => cap.type === type);
  }

  getCapabilityByInstance(instance) {
    return this.data.capabilities.find(cap => cap.state && cap.state.instance === instance);
  }

  getInfo() {
    return this.data;
  }

  // принимает capability.state, возвращает capability
  setState(capability) {
    let int, topic;
    const deviceCapability = this.getCapabilityByType(capability.type);
    deviceCapability.state.value = capability.state.value;

    switch(capability.state.instance) {
      case 'on':
        int = capability.state.value ? '1' : '0';
        topic = this.data.custom_data.mqtt[capability.state.instance].set || false;
        break;

      default:
        int = JSON.stringify(capability.state.value);
        topic = this.data.custom_data.mqtt[capability.state.instance].set || false;
    }

    if (topic) {
      console.log(`mqtt: ${topic} ${int}`);
      global.client.publish(topic, int);
    }

    // возможно, надо возвращать на уровень выше - https://yandex.ru/dev/dialogs/alice/doc/smart-home/reference/post-action-docpage/
    deviceCapability.state.action_result = {
      status: 'DONE'
    };
    return deviceCapability;
  }
}
module.exports = device;
