const express = require('express');
const router = express.Router();

router.all('/', (req, res) => {
  // console.log('ping');
  res.send('OK');
});

router.all('/v1.0', (req, res) => {
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

module.exports = router;
