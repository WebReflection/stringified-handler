/*! (c) Andrea Giammarchi - ISC */

const {stringify} = JSON;
const {defineProperty, getOwnPropertyDescriptor, keys} = Object;

const parse = (handler, keys) => keys.map(key => {
  const {get, set, value} = getOwnPropertyDescriptor(handler, key);
  if (get && set)
    key = get + ',' + set;
  else if (get)
    key = '' + get;
  else if (set)
    key = '' + set;
  else if (typeof value === 'function')
    key += ':' + transform(handler, key);
  else
    key += ':' + stringify(value);
  return key;
}).join(',');

const transform = (handler, key) => handler[key].toString().replace(
  new RegExp('^' + key + '[^(]*?\\('), 'function('
);

let i = 0;

export default function StringifiedHandler(handler) {
  const allKeys = keys(handler);
  const name = '_$H' + i++;
  const object = {
    toString: () => (
      'var ' + name + '={' + parse(handler, allKeys) + '};'
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
};
