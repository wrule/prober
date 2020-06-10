## prober
Get TypeScript type from JavaScript value and generate TypeScript code

## Install

```
$ npm install @wrule/prober
```

## Usage

```js
const path = require('path');
const { Prober } = require('@wrule/prober');

const obj = {
  a: [
    {name: 'kim'},
    {name: 'jim'},
  ]
};
const prober = new Prober();
const dstPath = path.join(__dirname, 'output');
const type = prober.Update(obj, 'test', dstPath);
console.log(type.TypeDesc);
```
