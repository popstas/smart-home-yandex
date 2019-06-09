const express = require('express');
const router = express.Router();

// validate token
router.use((req, res, next) => {
  if(req.path === '/'){
    next();
    return;
  }

  if(!req.headers.authorization){
    res.status(401);
    res.send('No authorization headers');
    return;
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  // console.log('token: ', token);
  // console.log('global.users.data: ', global.users.data);

  const user = global.users.find('access_token', token);
  if(user.length == 0){
    res.status(401);
    res.send('Unauthorized access');
  } else if(user[0].expires_at > new Date().getTime() / 1000) {
    res.status(401);
    res.send('Token expired');
  } else {
    next();
  }
});

router.all('/', (req, res) => {
  // console.log('ping');
  res.send('OK');
});

router.get('/v1.0/user/devices', (req, res) => {
  console.log('/v1.0/user/devices');
  var r = {
    request_id: "1",
    payload: {
      user_id: "1",
      devices: []
    }
  };
  for (var i in global.devices) {
    r.payload.devices.push(global.devices[i].getInfo());
  }
  res.send(r);
});

router.post('/v1.0/user/devices/query', (req, res) => {
  console.log('/v1.0/user/devices/query', req.body);
  const r = {
    request_id: '1',
    payload: {
      devices: []
    }
  };
  for (let i in req.body.devices) {
    r.payload.devices.push(global.devices[req.body.devices[i].id].getInfo());
    // console.log(global.devices[req.body.devices[i].id].getInfo());
  }
  // console.log(JSON.stringify(r));
  res.send(r);
});

router.post('/v1.0/user/devices/action', (req, res) => {
  console.log('/v1.0/user/devices/action:', req.body.payload.devices);
  // console.log('global.devices: ', global.devices);
  var r = {
    request_id: "1",
    payload: {
      devices: []
    }
  };
  for (var i in req.body.payload.devices) {
    var id = req.body.payload.devices[i].id;
    var capabilities = global.devices[id].setState(req.body.payload.devices[i].capabilities[0].state.value);
    r.payload.devices.push({ id: id, capabilities: capabilities });
  }
  res.send(r);
});

router.post('/v1.0/user/unlink', (req, res) => {
  console.log('/v1.0/user/unlink');
  const token = req.headers.authorization.replace('Bearer ', '');
  const found = global.users.find('access_token', token);
  console.log('found: ', found);
  if(found) global.users.remove(found);
  res.status(200);
});

module.exports = router;
