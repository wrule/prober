const path = require('path');
const obj = require('./a.json');
const { Prober } = require('../dist');

const dstPath = path.join(__dirname, '..', 'src', 'output');
const prober = new Prober();
const newType = prober.Update(obj, 'rsp', dstPath);
console.log(newType.TypeDesc);

