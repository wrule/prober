const path = require('path');
const obj = require('./a.json');
const { Prober } = require('../dist');

const dstPath = path.join(__dirname, '..', 'src', 'output');
const prober = new Prober();
const oldType = prober.Load(dstPath);
const newType = prober.Do(obj, 'rsp');
const mergedType = oldType.Merge(newType);
prober.Dump(mergedType, dstPath);
console.log(oldType.TypeDesc, newType.TypeDesc, mergedType.TypeDesc);
