const fractal = require('@frctl/fractal');
const pretty = require('pretty');
const _ = require('lodash');

function setEnv(key, value, context) {
  if (_.isUndefined(context[key]) && ! _.isUndefined(value)) {
    context[key] = value;
  }
}

module.exports = class PugAdapter extends fractal.Adapter {
  constructor(engine, engineOptions, helpers, source, app) {
    super(engine, source);

    this.app = app;
    this.engineOptions = engineOptions || {};
    this.engineHelpers = helpers || {};
  }

  render(path, str, context, meta = {}) {
    // Options
    const options = Object.assign({}, this.engineOptions, {
      filename: path,
      pretty: false,
    });

    // Set fractal globals
    setEnv('_self', meta.self, context);
    setEnv('_target', meta.target, context);
    setEnv('_env', meta.env, context);
    setEnv('_config', this.app.config(), context);

    // Save meta
    this.app.set('meta', meta);

    // Add helpers
    _.forEach(this.engineHelpers, (fn, helperName) => {
      setEnv(helperName, fn, context);
    });

    // Generate template
    const template = this.engine.compile(str, options);
    const renderedTemplate = template(context);

    // Prettify?
    return this.engineOptions.pretty ? pretty(renderedTemplate) : renderedTemplate;
  }
};
