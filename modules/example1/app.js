'use strict';

const ejs = require('ejs');
const config = require('../../config.js');
const logging = require('../../lib/logging.js');
const path = require('path');

const ExampleModule1 = class ExampleModule1 {

  constructor(app) {
    this.defineRoutes(app);
  }

  defineRoutes(app) {
    // for testing the audio module, post
    app.get('/ui', (req, res) => {
      ejs.renderFile(path.join(__dirname, 'views', 'index.html'), {}, (err, str) => {
        res.send(str);
      });
    });
  }
}

module.exports = ExampleModule1
