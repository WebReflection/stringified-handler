'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {stringify} = JSON;
const {defineProperty, keys} = Object;

const parse = (handler, keys) => keys.map(key => `${key}:${
  typeof handler[key] === 'function' ?
    transform(handler, key) :
    stringify(handler[key])
}`).join(',');

const transform = (handler, key) => handler[key].toString().replace(
  new RegExp(`^${key}\\s*\\(`), 'function('
);

let i = 0;

function StringifiedHandler(handler) {
  const allKeys = keys(handler);
  const name = '_$H' + i++;
  const object = {
    toString: () => `var ${name}={${parse(handler, allKeys)}};`
  };
  allKeys.forEach(key => {
    defineProperty(object, key, {
      get: typeof handler[key] === 'function' ?
        () => `${name}.${key}(event)` :
        () => handler[key]
    });
  });
  return object;
}
module.exports = StringifiedHandler;
