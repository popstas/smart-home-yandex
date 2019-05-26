const fs = require('fs');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const auth = require('./auth');
const providerAdapter = require('./providerAdapter');

class restApi {
  constructor() {
    this.app = express();
    this.app.use(logger('combined', {
      immediate: true,
      // stream: fs.createWriteStream('data/app.log', {'flags': 'w+'})
    }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.init();
  }

  init() {
    this.app.use('/auth', auth);
    this.app.use('/provider', providerAdapter);

    this.app.listen(5554, function () {
      console.log('Express server listening on port 5554');
    });
  }
}

module.exports = restApi;
