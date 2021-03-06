# stringified handler

[![Build Status](https://travis-ci.com/WebReflection/stringified-handler.svg?branch=master)](https://travis-ci.com/WebReflection/stringified-handler) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/stringified-handler/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/stringified-handler?branch=master)

A super simple approach to SSR events handling through object literals.

```js
import StringifiedHandler from 'stringified-handler';

// define a handler
const handler = StringifiedHandler({
  clickCounts: 0,
  onClick(event) {
    event.preventDefault();
    console.log(++this.clickCounts);
  }
});

// create some content via SSR
console.log(`
<!doctype html>
<script>${handler}</script>
<body onclick=${handler.onClick}>
  <h1>Hello World</h1>
</body>
`);
```

The `handler.toString()` will produce the following:

```js
var _$H0={
  clickCounts:0,
  onClick:function(event) {
    event.preventDefault();
    console.log(++this.clickCounts);
  }
};
```

While the `handler.onClick`, as string, will return `_$H0.onClick(event)`, which is suitable for any DOM Level 0 event attached directly to its layout.

If used directly, `handler.onClick` would be a function bound to the `handler`, so that it can be reused with client-side libraries too right away.

The library, used via SSR, costs *zero extra bytes*, as the only payload depends on how big is the handler. Using JS minifiers after `.toString()` might also help reducing further more the payload size.



### Usage & Limitations

The object literal must be quite simple, and none of its methods, functions, utilities, can refer to any outer scope, *unless* whatever it's using is reachable because the dependency has been previously injected too.

In few words, *no outer scope allowed*, and following there's an explanation of what can be serialized:

```js
StringifiedHandler({
  // any JSON serializable value is fine, and
  // objects and arrays will be recursively parsed
  serializable: {} || [] || true || false || null ||
                number || string || undefined,
  // getters and setters are OK
  get prop() {},
  set prop(value) {},
  // shorthand methods are OK and normalized for legacy
  method(one, orMore, values) {},
  // regular functions are OK too
  methodFn: function (a, b, c) {},
  // arrows are also OK but not normalized for legacy
  methodArr: e => {},
  // spread arguments and defaults are also OK
  // but not normalized for legacy
  // generators, as well as async function,
  // are possible too
  async short() {},
  methodAsync: async function () {},
  *generator() {}
});
```

Such object could handle state changes, or delegate to a third parts library, as long as this is already available on the global context, before a user interacts.



### How to know which node triggered the event?

Every `event` object contains a `currentTarget` property, which refers to the node that actually had the event attached, while the `target` could be any inner node that triggered initially such event.

A click in the `H1` element, as example, would have `currentTarget` pointing at the `BODY`, and the `target` pointing at the `H1` element.

```html
<!doctype html>
<script>${handler}</script>
<body onclick=${handler.onClick}>
  <h1>Hello World</h1>
</body>
```
