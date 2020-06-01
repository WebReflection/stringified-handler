'use strict';
/*! (c) Andrea Giammarchi - ISC */

const {isArray} = Array;
const {stringify} = JSON;
const {defineProperty, getOwnPropertyDescriptor, keys} = Object;

const parseObject = (handler, keys) => (
  '{' + keys.map(key => {
    const {get, set, value} = getOwnPropertyDescriptor(handler, key);
    if (get && set)
      key = get + ',' + set;
    else if (get)
      key = '' + get;
    else if (set)
      key = '' + set;
    else
      key = stringify(key) + ':' + parseValue(value, key);
    return key;
  }).join(',') + '}'
);

const parseValue = (value, key) => {
  const type = typeof value;
  if (type === 'function')
    return value.toString().replace(
      new RegExp('^(\\*|async )?\\s*' + key + '[^(]*?\\('),
      (_, $1) => $1 === '*' ? 'function* (' : (($1 || '') + 'function (')
    );
  if (type === 'object' && value)
    return isArray(value) ?
            parseArray(value) :
            parseObject(value, keys(value));
  return stringify(value);
};

const parseArray = array => ('[' + array.map(parseValue).join(',') + ']');

let i = 0;

function StringifiedHandler(handler) {
  const allKeys = keys(handler);
  const name = '_$H' + i++;
  const object = {
    toString: () => (
      'var ' + name + '=' + parseObject(handler, allKeys) + ';'
    )
  };
  allKeys.forEach(key => {
    const desc = getOwnPropertyDescriptor(handler, key);
    if (typeof desc.value === 'function') {
      desc.value = desc.value.bind(handler);
      desc.value.toString = () => (name + '.' + key + '(event)');
    }
    defineProperty(object, key, desc);
  });
  return object;
}
module.exports = StringifiedHandler;
