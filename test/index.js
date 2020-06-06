const { Field } = require('../dist/field');
const { TypeDeducer } = require('../dist/typeDeducer');
const aObj = require('./a.json');
const bObj = require('./b.json');
const cObj = require('./c.json');

console.log(aObj, bObj);
const aField = new Field(aObj, 'test');
const bField = new Field(bObj, 'test');
const cField = new Field(cObj, 'test');
const deducer = new TypeDeducer();
const aType = deducer.Deduce(aField.Value, aField.SrcName);
const bType = deducer.Deduce(bField.Value, bField.SrcName);
const cType = deducer.Deduce(cField.Value, bField.SrcName);
// console.log(aType.Hash, bType.Hash);
// const cType = aType.Merge(bType);
// console.log(cType.Hash);
// console.log(cType);
console.log(cType);