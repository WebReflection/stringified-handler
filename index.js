self.stringHandler = (function (exports) {
  'use strict';

  /*! (c) Andrea Giammarchi - ISC */
  var stringify = JSON.stringify;
  var keys = Object.keys;

  var parse = function parse(handler, keys) {
    return keys.map(function (key) {
      return "".concat(key, ":").concat(typeof handler[key] === 'function' ? transform(handler, key) : stringify(handler[key]));
    }).join(',');
  };

  var transform = function transform(handler, key) {
    return handler[key].toString().replace(new RegExp("^".concat(key, "\\s*\\(")), 'function(');
  };

  var i = 0;
  function StringifiedHandler(handler) {
    var allKeys = keys(handler);
    var name = '_$H' + i++;
    var object = {
      toString: function toString() {
        return "var ".concat(name, "={").concat(parse(handler, allKeys), "};");
      }
    };
    allKeys.forEach(function (key) {
      var value = handler[key];

      if (typeof value === 'function') {
        value = value.bind(handler);

        value.toString = function () {
          return "".concat(name, ".").concat(key, "(event)");
        };
      }

      object[key] = value;
    });
    return object;
  }

  exports.default = StringifiedHandler;

  return exports;

}({}).default);
