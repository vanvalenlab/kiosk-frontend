// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

// const debug = require('debug')('deepcell_react:index');

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.info(`server started on port ${config.port} (${config.env})`);
  });
}

export default app;
