const rewriteIncludeMixin = require('./rewrite-include-mixin');
const loader = require('./loader');

module.exports = function(fractal) {
  return [
    rewriteIncludeMixin(fractal),
    loader(fractal),
  ];
};
