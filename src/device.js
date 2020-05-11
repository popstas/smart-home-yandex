const md5 = require('md5');

class device {
  constructor(options) {
    // this.client = client;
    this.data = {
      id: '',
      name: options.name || 'Без названия',
      description: options.description || '',
      type: options.type || 'devices.types.light',
      room: options.room || '',
      custom_data: {
        mqtt: options.mqtt || {}
      },
      capabilities: [
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
  getInfo() {
    return this.data;
  }
  setState(val) {
    const s = val ? 'on' : 'off';
    const int = val ? '1' : '0';
    // this.data.capabilities[0].state.instance = s;
    this.data.capabilities[0].state.value = val;
    const topic = this.data.custom_data.mqtt.set || false;
    if (topic) {
      console.log(`mqtt: ${topic} ${s}`);
      this.client.publish(topic, int);
    }

    const capabilities = this.data.capabilities;
    capabilities[0].state.action_result = {
      status: 'DONE'
    };
    return capabilities;
  }
}
module.exports = device;
