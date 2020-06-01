const { Field } = require('../dist/field');
const { TypeDeducer } = require('../dist/typeDeducer');
const aObj = require('./a.json');
const bObj = require('./b.json');

console.log(aObj, bObj);
const aField = new Field(aObj, 'test');
const bField = new Field(bObj, 'test');
const deducer = new TypeDeducer();
const aType = deducer.Deduce(aField.Value, aField.SrcName);
const bType = deducer.Deduce(bField.Value, bField.SrcName);
console.log(aField.Value.Type);
console.log(aType.TypeDesc);
const num = aType.Compare(bType);
console.log(num);