const path = require('path');
const { Field } = require('../dist/field');
const { Type } = require('../dist/type');
const rspData = require('./1.json');

const field = new Field(rspData.object, 'rsp');

console.log(field.Value.Type);

const type = Type.Infer(field.Value, field.SrcName);

console.log(type.ToJson());