const path = require('path');
const obj = require('./a.json');
const { Prober } = require('../dist');

const dstPath = path.join(__dirname, '..', 'src', 'output');
const prober = new Prober();
let newType = prober.Do(obj, 'rsp');
if (prober.Exists(dstPath)) {
  const oldType = prober.Load(dstPath);
  newType = oldType.Merge(newType);
}
prober.Dump(newType, dstPath);
console.log(newType.TypeDesc);
