const walk = require('pug-walk');

module.exports = function(fractal) {
  return {
    preCodeGen(ast, options) {
      ast = walk(ast, (node, replace) => {
        if (node.type === 'Mixin' && node.name === 'include') {
          replace({
            type: 'Code',
            val: `include(${node.args})`,
            buffer: true,
            mustEscape: false,
            isInline: false,
            line: node.line,
            column: node.column,
            filename: node.filename,
          });
        }
      });

      return ast;
    }
  };
}
