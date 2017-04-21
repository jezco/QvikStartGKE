'use strict';

const Datastore = require('@google-cloud/datastore');
const config = require('../../config.js');
const logging = require('../../lib/logging.js');

class ExampleModule2 {

  constructor(app) {
    this.defineRoutes(app);
    this.ds = Datastore({
      projectId: config.get('GCLOUD_PROJECT')
    });
  }

  defineRoutes(app) {
    // for testing the examplemodule2
    app.get('/api/example2/entities/:key', (req, res) => {
      res.json({key: req.params.key, data: []});
    });
  }
}

exports.setup = (app) => {
  exports.example2 = new ExampleModule2(app);
}
