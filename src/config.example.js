module.exports = {
  oauth: {
    id: '123',
    secret: '123',
    auth_url: 'https://oauth.yandex.ru/authorize',
    token_url: 'https://oauth.yandex.ru/token',
    callback_url: 'https://myhome.ru/auth/callback',
    redirect_url: 'https://social.yandex.net/broker/redirect' // сюда надо отправить алисе код
  },

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
    }
  ]
}
