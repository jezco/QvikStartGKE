'use strict';

const ejs = require('ejs');
const config = require('../../config.js');
const logging = require('../../lib/logging.js');
const path = require('path');

class ExampleModule1 {

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

exports.setup = (app) => {
  exports.example1 = new ExampleModule1(app);
}
