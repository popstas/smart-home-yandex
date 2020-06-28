module.exports = {
  mqtt: {
    host: 'host',
    port: 1883,
    user: 'user',
    password: 'password'
  },

  // type - https://tech.yandex.ru/dialogs/alice/doc/smart-home/concepts/main-objects-docpage/
  devices: [
    {
      name: 'Свет',
      room: 'Комната',
      type: 'devices.types.light',
      mqtt: {
        set: 'cmnd/room/light/power'
      }
    },

    {
      name: 'Свет',
      room: 'Кухня',
      type: 'devices.types.light',
      mqtt: {
        set: 'cmnd/kitchen/light/power', // MQTT топик, куда будут отправляться команды
        stat: 'stat/kitchen/light/POWER' // MQTT топик, откуда будет обновляться состояние
      }
    },

    {
      name: 'Вытяжка',
      room: 'Кухня',
      type: 'devices.types.socket',
      mqtt: {
        set: 'cmnd/kitchen/fan/power',
        stat: 'stat/kitchen/fan/power'
      }
    },

    {
      name: 'Телевизор',
      room: 'Кухня',
      type: 'devices.types.media_device',
      mqtt: {
        set: 'cmnd/kitchen/tv/power',
        stat: 'stat/kitchen/tv/power',
        volume: {
          set: 'cmnd/kitchen/tv/volume',
          stat: '',
        }
      },
      capabilities: [
        {
          type: 'devices.capabilities.on_off',
          retrievable: true,
          state: {
            instance: 'on',
            value: false
          }
        },
        {
          type: 'devices.capabilities.range',
          retrievable: true,
          parameters: {
            instance: 'volume',
            min: 0,
            max: 100
          },
          state: {
            instance: 'volume',
            value: 25
          }
        },
      ]
    }
  ]
}
