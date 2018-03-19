const pug = require('pug');
const _ = require('lodash');
const PugAdapter = require('./adapter');
const helpers = require('./helpers');
const plugins = require('./plugins');

module.exports = (config = {}) => ({
  register(source, app) {
    // Add default helpers and plugins
    _.merge(config, {
      helpers: helpers(app),
      options: {
        plugins: plugins(app),
      },
    });

    // Create new adapter
    return new PugAdapter(pug, config.options || {}, config.helpers || {}, source, app);
  },
});
