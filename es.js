self.stringHandler=function(t){"use strict";
/*! (c) Andrea Giammarchi - ISC */const{stringify:n}=JSON,{defineProperty:e,keys:r}=Object,o=(t,n)=>t[n].toString().replace(new RegExp(`^${n}\\s*\\(`),"function(");let i=0;return t.default=function(t){const c=r(t),f="_$H"+i++,u={toString:()=>`var ${f}={${((t,e)=>e.map(e=>`${e}:${"function"==typeof t[e]?o(t,e):n(t[e])}`).join(","))(t,c)}};`};return c.forEach(n=>{e(u,n,{get:()=>"function"==typeof t[n]?`${f}.${n}(event)`:t[n]})}),u},t}({}).default;
