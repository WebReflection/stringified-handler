'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {stringify} = JSON;
const {keys} = Object;

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
    let value = handler[key];
    if (typeof value === 'function') {
      value = value.bind(handler);
      value.toString = () => `${name}.${key}(event)`;
    }
    object[key] = value;
  });
  return object;
}
module.exports = StringifiedHandler;
