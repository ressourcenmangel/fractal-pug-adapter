# Fractal Pug Adapter

> Use [Pug](https://pugjs.org/) templates inside [Fractal](https://fractal.build/)

## Install

```bash
$ yarn add @rsm/fractal-pug-adapter
```

## Usage

Inside your Fractal configuration (`fractal.config.js` or something like that):

```js
fractal.components.engine('@rsm/fractal-pug-adapter');
```

If you want to extend [the Pug complier options](https://pugjs.org/api/reference.html#options) or add globals to the Pug templates:

```js
const pugAdapter = require('@rsm/fractal-pug-adapter');

fractal.components.engine(pugAdapter({
  options: {
    doctype: 'xml', // A pug options
    foo: 'bar', // A custom global
  },
}));
```

## Changelog

### 0.5.0

* Add support for tenant context (only with `@rsm/kuchenblech`)

### 0.4.0

* Support high level context reference

### 0.3.1

* Resolve context everytime

### 0.3.0

* Resolve context on includes

### 0.2.0

* Refactor apdater

### 0.1.0

* First release

## License

MIT © [ressourcenmangel GmbH](https://ressourcenmangel.de)
