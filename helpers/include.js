const _ = require('lodash');
const fs = require('fs');

module.exports = function(fractal) {
  return function include(handle, context = false, mergeWithDefaultContext = true) {
    const handleName = _.isObject(handle) ? `@${handle.name}` : handle;
    const entity = fractal.components.find(handleName);

    if (!entity) {
      throw new Error(`Could not render component '${handleName}' - component not found.`);
    }

    const defaultContext = entity.isComponent ? entity.variants().default().context : entity.context;

    if (!context) {
      context = defaultContext;
    } else if (mergeWithDefaultContext) {
      context = _.defaultsDeep(context, defaultContext);
    }

    const template = fs.readFileSync(entity.viewPath);
    const meta = fractal.get('meta');

    return fractal.components.engine().render(entity.viewPath, template, context, meta);
  };
}
