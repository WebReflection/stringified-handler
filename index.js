self.stringHandler = (function (exports) {
  'use strict';

  /*! (c) Andrea Giammarchi - ISC */
  var stringify = JSON.stringify;
  var defineProperty = Object.defineProperty,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      keys = Object.keys;

  var parse = function parse(handler, keys) {
    return keys.map(function (key) {
      var _getOwnPropertyDescri = getOwnPropertyDescriptor(handler, key),
          get = _getOwnPropertyDescri.get,
          set = _getOwnPropertyDescri.set,
          value = _getOwnPropertyDescri.value;

      if (get && set) key = get + ',' + set;else if (get) key = '' + get;else if (set) key = '' + set;else if (typeof value === 'function') key += ':' + transform(handler, key);else key += ':' + stringify(value);
      return key;
    }).join(',');
  };

  var transform = function transform(handler, key) {
    return handler[key].toString().replace(new RegExp('^' + key + '[^(]*?\\('), 'function(');
  };

  var i = 0;
  function StringifiedHandler(handler) {
    var allKeys = keys(handler);
    var name = '_$H' + i++;
    var object = {
      toString: function toString() {
        return 'var ' + name + '={' + parse(handler, allKeys) + '};';
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
