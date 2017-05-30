'use strict';

if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start();
  // Debug not needed atm, and it's experimental
  // require('@google-cloud/debug-agent').start();
}

const join = require('path').join;
const fs = require('fs');

const express = require('express');
const config = require('./config');
const logging = require('./lib/logging.js');

const app = express();

app.use(logging.requestLogger);

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

const modules = {};

// Read routes based on the environment variable
const moduleName = process.env.MODULE;
if(moduleName) {
  logging.info(`Loading routes from ${moduleName}`);
  const router = require(`./modules/${process.env.MODULE}/app.js`);
  modules[moduleName] = new router(app);
} else {
  logging.info('No MODULE variable found. Loading all modules');
  const modulesDir = "./modules";
  fs.readdirSync(modulesDir).forEach((moduleFileName) => {
    const modulePath = join(modulesDir, moduleFileName, 'app.js');
    // ensure app.js exists
    if (!fs.existsSync(modulePath)) return;
    logging.info(`Loading routes from ${moduleFileName}`);
    const router = require(`./${modulePath}`);
    modules[moduleFileName] = new router(app);
  });
}

logging.info('Enabled routes:');
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    logging.info('Route', r.route.path);
  }
});

logging.info('Loading error logger');
app.use(logging.errorLogger);

logging.info('Registering 404 handler');
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
// This is commented because the headers or body might already be sent.
/*
app.use((err, req, res, next) => {
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});
*/

if (module === require.main) {
  const server = app.listen(config.get('PORT'), () => {
    const port = server.address().port;
    logging.info(`App listening on http://localhost:${port}/`);
  });
}
