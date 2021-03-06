self.stringHandler = (function (exports) {
  'use strict';

  

  /*! (c) Andrea Giammarchi - ISC */
  var isArray = Array.isArray;
  var stringify = JSON.stringify;
  var defineProperty = Object.defineProperty,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      keys = Object.keys;

  var parseObject = function parseObject(handler, keys) {
    return '{' + keys.map(function (key) {
      var _getOwnPropertyDescri = getOwnPropertyDescriptor(handler, key),
          get = _getOwnPropertyDescri.get,
          set = _getOwnPropertyDescri.set,
          value = _getOwnPropertyDescri.value;

      if (get && set) key = get + ',' + set;else if (get) key = '' + get;else if (set) key = '' + set;else key = stringify(key) + ':' + parseValue(value, key);
      return key;
    }).join(',') + '}';
  };

  var parseValue = function parseValue(value, key) {
    var type = typeof(value);

    if (type === 'function') return value.toString().replace(new RegExp('^(\\*|async )?\\s*' + key + '[^(]*?\\('), function (_, $1) {
      return $1 === '*' ? 'function* (' : ($1 || '') + 'function (';
    });
    if (type === 'object' && value) return isArray(value) ? parseArray(value) : parseObject(value, keys(value));
    return stringify(value);
  };

  var parseArray = function parseArray(array) {
    return '[' + array.map(parseValue).join(',') + ']';
  };

  var i = 0;
  function StringifiedHandler(handler) {
    var allKeys = keys(handler);
    var name = '_$H' + i++;
    var object = {
      toString: function toString() {
        return 'var ' + name + '=' + parseObject(handler, allKeys) + ';';
      }
    };
    allKeys.forEach(function (key) {
      var desc = getOwnPropertyDescriptor(handler, key);

      if (typeof desc.value === 'function') {
        desc.value = desc.value.bind(handler);

        desc.value.toString = function () {
          return name + '.' + key + '(event)';
        };
      }

      defineProperty(object, key, desc);
    });
    return object;
  }

  exports.default = StringifiedHandler;

  return exports;

}({}).default);
