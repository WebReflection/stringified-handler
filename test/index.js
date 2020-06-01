const StringifiedHandler = require('../cjs');

const test = StringifiedHandler({
  onClick(event) {},
  test: event => {},
  value: 123
});

console.assert(test.onClick.toString() === '_$H0.onClick(event)', 'onClick is OK');
console.assert(test.test.toString() === '_$H0.test(event)', 'test is OK');
console.assert(test.value === 123, 'value is OK');
console.assert(test.toString() === 'var _$H0={onClick:function(event) {},test:event => {},value:123};', 'toString is OK');

const getter = StringifiedHandler({
  get map() {}
});

console.assert(getter.toString() === 'var _$H1={get map() {}};', 'getter is OK');

const setter = StringifiedHandler({
  set map(value) {}
});

console.assert(setter.toString() === 'var _$H2={set map(value) {}};', 'setter is OK');

const accessor = StringifiedHandler({
  _value: null,
  get value() {return this._value},
  set value(_value) {this._value = _value}
});

console.assert(accessor.toString() === 'var _$H3={_value:null,get value() {return this._value},set value(_value) {this._value = _value}};', 'accessor is OK');

const generators = StringifiedHandler({
  * method() {},
  test: function* (){}
});

console.assert(generators.toString() === 'var _$H4={method:function*() {},test:function* (){}};', 'generators OK');

const recursive = StringifiedHandler({
  values: [1, {
    method() {}
  }, 2]
});

console.assert(recursive.toString() === 'var _$H5={values:[1,{method:function() {}},2]};', 'recursive OK');
