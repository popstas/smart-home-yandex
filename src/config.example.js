const device = require('./device');

module.exports = {
  mqtt: {
    host: 'host',
    port: 1883,
    user: 'user',
    password: 'password'
  },

  // type - https://tech.yandex.ru/dialogs/alice/doc/smart-home/concepts/main-objects-docpage/
  devices: [
    new device({
      name: 'Свет',
      room: 'Комната',
      type: 'devices.types.light',
      mqtt: {
        set: 'cmnd/room/light/power'
      }
    }),

    new device({
      name: 'Свет',
      room: 'Кухня',
      type: 'devices.types.light',
      mqtt: {
        set: 'cmnd/kitchen/light/power', // MQTT топик, куда будут отправляться команды
        stat: 'stat/kitchen/light/POWER' // MQTT топик, откуда будет обновляться состояние
      }
    }),

    new device({
      name: 'Вытяжка',
      room: 'Кухня',
      type: 'devices.types.socket',
      mqtt: {
        set: 'cmnd/kitchen/fan/power',
        stat: 'stat/kitchen/fan/power'
      }
    })
  ]
}
