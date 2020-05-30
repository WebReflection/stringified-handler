const StringifiedHandler = require('../cjs');

const test = StringifiedHandler({
  onClick(event) {},
  test: event => {},
  value: 123
});

console.assert(test.onClick === '_$H0.onClick(event)', 'onClick is OK');
console.assert(test.test === '_$H0.test(event)', 'test is OK');
console.assert(test.value === 123, 'value is OK');
console.assert(test.toString() === 'var _$H0={onClick:function(event) {},test:event => {},value:123};', 'toString is OK');
