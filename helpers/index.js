const include = require('./include');
const render = require('./render');
const path = require('./path');

module.exports = function(fractal) {
  return {
    include: include(fractal),
    render: render(fractal),
    path: path(fractal),
  };
};
