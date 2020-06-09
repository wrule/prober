const path = require('path');
const obj = require('./1.json');
const { Prober } = require('../dist');

const dstPath = path.join(__dirname, '..', 'src', 'output');
const prober = new Prober();
const newType = prober.Update(obj.object, 'rsp', dstPath);
console.log(newType.TypeDesc);

