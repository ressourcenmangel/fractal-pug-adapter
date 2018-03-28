const _ = require('lodash');
const fs = require('fs');

function resolveContextSync(context, fractal) {
  return _[_.isArray(context) ? 'map' : 'mapValues'](context, (item) => {
    if (!item) {
      return null;
    }

    if (_.isString(item) && _.startsWith(item, '\\@')) {
      return item.replace(/^\\@/, '@');
    }

    if (_.isString(item) && _.startsWith(item, '@')) {
      const parts = item.split('.');
      const handle = parts.shift();
      const handleName = _.isObject(handle) ? `@${handle.name}` : handle;
      const entity = fractal.components.find(handleName);
      const entityContext = entity.isComponent ? entity.variants().default().context : entity.context;

      return resolveContextSync(_.cloneDeep(entityContext), fractal);
    }

    if (_.isArray(item) || _.isObject(item)) {
      return resolveContextSync(item, fractal);
    }

    return item;
  });
}

module.exports = function(fractal) {
  return function include(handle, context = false, mergeWithDefaultContext = true) {
    const handleName = _.isObject(handle) ? `@${handle.name}` : handle;
    const entity = fractal.components.find(handleName);

    if (!entity) {
      throw new Error(`Could not render component '${handleName}' - component not found.`);
    }

    let defaultContext = entity.isComponent ? entity.variants().default().context : entity.context;
    defaultContext = resolveContextSync(defaultContext, fractal);

    if (!context) {
      context = defaultContext;
    } else if (mergeWithDefaultContext) {
      context = resolveContextSync(context, fractal);
      context = _.defaultsDeep(context, defaultContext);
    }

    const template = fs.readFileSync(entity.viewPath);
    const meta = fractal.get('meta');

    return fractal.components.engine().render(entity.viewPath, template, context, meta);
  };
}
