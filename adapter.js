const fractal = require('@frctl/fractal');
const pretty = require('pretty');
const _ = require('lodash');

module.exports = class PugAdapter extends fractal.Adapter {
  constructor(engine, engineOptions, source, app) {
    super(engine, source);

    this.app = app;
    this.engineOptions = engineOptions || {};
  }

  render(path, str, originContext, meta = {}) {
    // Copy context
    const context = _.cloneDeep(originContext);

    // Set fractal globals
    _.set(context, '_self', meta.self);
    _.set(context, '_target', meta.target);
    _.set(context, '_env', meta.env);
    _.set(context, '_config', this.app.config());

    // Get options
    const options = _.isFunction(this.engineOptions) ? this.engineOptions() : this.engineOptions;
    const filenameAndOptions = Object.assign({}, options, { filename: path });

    // Generate template
    const template = this.engine.compile(str, filenameAndOptions);

    // Call template with options and context
    return pretty(template(Object.assign({}, filenameAndOptions, context)));
  }
};
