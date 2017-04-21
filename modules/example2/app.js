'use strict';

const Datastore = require('@google-cloud/datastore');
const config = require('../../config.js');
const logging = require('../../lib/logging.js');

const ExampleModule2 = class ExampleModule2 {

  constructor(app) {
    this.defineRoutes(app);
    this.ds = Datastore({
      projectId: config.get('GCLOUD_PROJECT')
    });
  }

  defineRoutes(app) {
    // for testing the audio module, post
    app.get('/api/example2/entities/:key', (req, res) => {
      res.json({key: req.params.key, data: []});
    });
  }
}

module.exports = ExampleModule2
