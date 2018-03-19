const walk = require('pug-walk');
const path = require('path');
const relative = require('relative');

module.exports = function(fractal) {
  return {
    preLoad(ast) {
      ast = walk(ast, (node, replace) => {
        if (node.type === 'Include' && node.file.path.indexOf('@') === 0) {
          const identifier = path.basename(node.file.path, '.pug');
          const entity = fractal.components.find(identifier);

          if (!entity) {
            throw new Error(`Could not render component '${handleName}' - component not found.`);
          }

          node.file.path = relative(node.file.filename, entity.viewPath);
        }
      });

      return ast;
    },
  };
};
