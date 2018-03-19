const _ = require('lodash');
const utils = require('@frctl/fractal').utils;

module.exports = function(fractal) {
  return function path(pathToResolve) {
    const meta = fractal.get('meta');

    if (!meta || !meta.env || meta.env.server) {
      return pathToResolve;
    }

    return utils.relUrlPath(pathToResolve, _.get(meta.env.request, 'path', '/'), fractal.web.get('builder.urls'));
  };
}
