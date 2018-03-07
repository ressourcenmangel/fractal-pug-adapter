const pug = require('pug');
const PugAdapter = require('./adapter');

module.exports = (config = {}) => ({
  register(source, app) {
    return new PugAdapter(pug, config.options || {}, source, app);
  },
});
