const _ = require('lodash');
const fs = require('fs');

module.exports = function(fractal) {
  return function render(string, inline = false, context = {}) {
    const meta = fractal.get('meta');
    const template = inline ? `.\n\t${string}` : string;

    return fractal.components.engine().render(null, template, context, meta);
  };
}
