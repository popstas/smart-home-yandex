const express = require('express');
const router = express.Router();

router.get('/auth', (req, res) => {
  console.log('/auth/auth', req.query);
  res.send(
    '<meta name="viewport" content="width=device-width, height=device-height initial-scale=1 user-scalable=no">' +
    '<body style="background:#310d80;">' +
    '<footer style="position:fixed; bottom:0; left:0; right:0; padding:24px 16px;">' +
    '<a style="display:block; text-align:center; background:#7b3dcc; color:#fff; cursor:pointer; font-family:Arial,sans-serif; font-size:20px; padding:13px 16px; border-radius:6px; text-decoration:none;" href="' + req.query.redirect_uri + '?code=test123&state=' + req.query.state + '">Подключить умный дом</a>');
});

router.post('/token', (req, res) => {
  console.log('/auth/token', req.body);
  res.send({ "access_token": "acceess123456789", "token_type": "bearer", "expires_in": 2592000, "refresh_token": "refresh123456789" });
});

module.exports = router;
