self.stringHandler=function(n){"use strict";
/*! (c) Andrea Giammarchi - ISC */var e=JSON.stringify,o=Object.defineProperty,i=Object.keys,u=function(n,t){return n[t].toString().replace(new RegExp("^".concat(t,"\\s*\\(")),"function(")},f=0;return n.default=function(c){var n=i(c),r="_$H"+f++,t={toString:function(){return"var ".concat(r,"={").concat((t=c,n.map(function(n){return"".concat(n,":").concat("function"==typeof t[n]?u(t,n):e(t[n]))}).join(",")),"};");var t}};return n.forEach(function(n){o(t,n,{get:function(){return"function"==typeof c[n]?"".concat(r,".").concat(n,"(event)"):c[n]}})}),t},n}({}).default;