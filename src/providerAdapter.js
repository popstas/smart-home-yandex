const express = require('express');
const router = express.Router();

const getDeviceById = id => {
  return global.devices.find(dev => dev.data.id === id);
}

router.all('/', (req, res) => {
  // console.log('ping');
  res.send('OK');
});

router.get('/v1.0', (req, res) => {
  // console.log('ping');
  res.send('OK');
});

router.get('/v1.0/user/devices', (req, res) => {
  console.log('/v1.0/user/devices');
  global.updateDevices();
  var r = {
    request_id: req.headers['x-request-id'],
    payload: {
      user_id: "1",
      devices: []
    }
  };
  for (let device of global.devices) {
    r.payload.devices.push(device.getInfo());
  }
  res.send(r);
});

router.post('/v1.0/user/devices/query', (req, res) => {
  console.log('/v1.0/user/devices/query', req.body);
  const r = {
    request_id: req.headers['x-request-id'],
    payload: {
      devices: []
    }
  };
  for (let requestDevice of req.body.devices) {
    const device = getDeviceById(requestDevice.id);
    if(device) {
      r.payload.devices.push(device.getInfo());
    } else {
      requestDevice.error_code = 'DEVICE_NOT_FOUND';
      requestDevice.error_message = 'Устройство не найдено';
      r.payload.devices.push(requestDevice);
    }
    // console.log(global.devices[req.body.devices[i].id].getInfo());
  }
  // console.log(JSON.stringify(r));
  res.send(r);
});

router.post('/v1.0/user/devices/action', (req, res) => {
  console.log('/v1.0/user/devices/action:', req.body.payload.devices);
  // console.log('global.devices: ', global.devices);
  const r = {
    request_id: req.headers['x-request-id'],
    payload: {
      devices: []
    }
  };
  for (let requestDevice of req.body.payload.devices) {
    const device = getDeviceById(requestDevice.id);
    if(device) {
      const id = device.data.id;
      const capabilities = device.setState(requestDevice.capabilities[0].state.value);
      r.payload.devices.push({ id, capabilities });
    } else {
      requestDevice.error_code = 'DEVICE_NOT_FOUND';
      requestDevice.error_message = 'Устройство не найдено';
      r.payload.devices.push(requestDevice);
    }
  }
  res.send(r);
});

router.post('/v1.0/user/unlink', (req, res) => {
  console.log('/v1.0/user/unlink');
  res.json({ request_id: req.headers['x-request-id'] });
  res.status(200);
});

module.exports = router;
