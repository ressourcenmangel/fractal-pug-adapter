const _ = require('lodash');
const fs = require('fs');
const utils = require('@frctl/fractal').utils;

function resolveContextSync(context, fractal) {
  const meta = fractal.get('meta');
  const tenant = _.get(meta, 'env.request.params.tenant', false);

  if (_.isString(context) && _.startsWith(context, '@')) {
    const entity = fractal.components.find(context);
    const entityContext = entity.isComponent ? entity.variants().default().context : entity.context;

    let entityTenantContext = {};
    if (tenant && _.isObject(entity.tenantContext) && _.isObject(entity.tenantContext[tenant])) {
      entityTenantContext = entity.tenantContext[tenant];
    }

    return resolveContextSync(utils.mergeProp(entityTenantContext, _.cloneDeep(entityContext)), fractal);
  }

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

      let entityTenantContext = {};
      if (tenant && _.isObject(entity.tenantContext) && _.isObject(entity.tenantContext[tenant])) {
        entityTenantContext = entity.tenantContext[tenant];
      }

      return resolveContextSync(utils.mergeProp(entityTenantContext, _.cloneDeep(entityContext)), fractal);
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
    const meta = fractal.get('meta');
    const tenant = _.get(meta, 'env.request.params.tenant', false);

    if (!entity) {
      throw new Error(`Could not render component '${handleName}' - component not found.`);
    }

    let defaultContext = entity.isComponent ? entity.variants().default().context : entity.context;
    let defaultTenantContext = {};
    if (tenant && _.isObject(entity.tenantContext) && _.isObject(entity.tenantContext[tenant])) {
      defaultTenantContext = entity.tenantContext[tenant];
    }

    defaultContext = resolveContextSync(utils.mergeProp(defaultTenantContext, defaultContext), fractal);

    if (!context) {
      context = defaultContext;
    } else if (mergeWithDefaultContext) {
      context = resolveContextSync(context, fractal);
      context = utils.mergeProp(context, defaultContext);
    } else {
      context = resolveContextSync(context, fractal);
    }

    const template = fs.readFileSync(entity.viewPath);

    return fractal.components.engine().render(entity.viewPath, template, context, meta);
  };
}
