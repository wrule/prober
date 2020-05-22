import rspObj from '../test/2.json';
import { Value } from './value';
import { Hash } from './hash';

const value = new Value(rspObj.object);
console.log(value.TypeHash);