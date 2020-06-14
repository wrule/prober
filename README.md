<h1 align="center">
	<br>
	<br>
	<br>
	<img width="380" src="media/logo.svg" alt="hasha">
	<br>
	<br>
	<br>
	<br>
	<br>
</h1>
> Get TypeScript type from JavaScript value and generate TypeScript code

## Install
```
$ npm install @wrule/prober
```

## Usage
### Code
```js
const path = require('path');
const { Prober } = require('@wrule/prober');

const obj = {
  a: [{name: 'kim'}, {name: 'jim'}]
};
const dstPath = path.join(__dirname, 'output');

const prober = new Prober();
const type = prober.Update(obj, 'test', dstPath);
console.log(type.TypeDesc);
```
### Output
#### Console
```
ITest_08890C26
```
#### Generated code
```js
import { IA_ArrayItem_31B51A0F } from './a_ArrayItem_31B51A0F';

export interface ITest_08890C26 {
  'a': IA_ArrayItem_31B51A0F[];
}
```
```js
export interface IA_ArrayItem_31B51A0F {
  'name': string;
}
```