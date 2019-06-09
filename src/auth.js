const axios = require('axios');
const express = require('express');
const querystring = require('querystring');
const router = express.Router();
const config = require('./config');

const html_header = `
<meta name="viewport" content="width=device-width, height=device-height initial-scale=1 user-scalable=no">
<style>
body { background:#310d80; color: #fff; font-family:Arial,sans-serif; font-size:20px; }
footer { position:fixed; bottom:0; left:0; right:0; padding:24px 16px; }
.yandex-button {
  display:block; text-align:center; background:#7b3dcc; color:#fff;
  cursor:pointer;
  margin-top:16px; padding:13px 16px; border-radius:6px; text-decoration:none;
}
</style>
<body>
<footer>
`;

const userStore = (token) => {
  let user = global.users.find('access_token', token.access_token);
  if(user.length > 0) {
    user = user[0];
    user.access_token = token.access_token;
    user.refresh_token = token.refresh_token;
    user.expires_in = token.expires_in;
    user.expires_at = (new Date().getTime() / 1000) + token.expires_in;
    user.token_type = token.token_type;
    global.users.update(user);
  } else {
    global.users.insert(token);
  }
}

router.get('/auth', (req, res) => {
  console.log('/auth/auth', req.query);

  const q = {
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri,
    scope: req.query.scope,
    state: req.query.state,
  };

  let auth = global.auth.find('state', q.state);
  if(auth.length == 0) {
    auth = q;
    global.auth.insert(q);
  }

  const yandex_url = config.oauth.auth_url + '?' + querystring.encode({
    response_type: 'code',
    client_id: q.client_id,
    // redirect_uri: config.oauth.callback_url
  });

  res.send(
    html_header +
    '<a class="yandex-button" href="' + yandex_url + '">Подключить через Яндекс</a>'
  );
});

router.get('/callback', (req, res) => {
  console.log('/auth/callback', req.query);

  let auth = global.auth.find('state', req.query.state);
  if(auth.length > 0) {
    auth = auth[0];
    auth.code = req.query.code;
    global.auth.update(auth);

    const url = auth.redirect_uri + '?' + querystring.encode({
      code: auth.code,
      state: auth.state
    });

    res.send(
      html_header +
      '<a class="yandex-button" href="' + url + '">Продолжить</a>' +
      '<script>setTimeout(() => { window.location = "' + url +'"; }, 1000);</script>'
    );
  }
  else {
    res.send(
      html_header +
      '<a class="yandex-button" href="">Юзер не найден, подключитесь заново</a>'
    );
  }

});

router.post('/token', async (req, res) => {
  console.log('/auth/token', req.body);
  try {
    const r = await axios.post(config.oauth.token_url,
      // url: 'https://yandex-smarthome.home.popstas.ru/auth/refresh',
      querystring.encode({
        grant_type: req.body.grant_type,
        code: req.body.code,
        client_id: req.body.client_id,
        redirect_uri: req.body.redirect_uri,
        client_secret: config.oauth.secret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: config.oauth.id,
          password: config.oauth.secret
        },
      }
    );

    const token = r.data;
    userStore(token);
    console.log('global.users.data: ', global.users.data);
    res.send(token);
  } catch (err){
    console.log('err.response.data: ', err.response.data);
  };
});

module.exports = router;
