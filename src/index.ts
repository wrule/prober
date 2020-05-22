import rspObj from '../test/1.json';
import { Value } from './value';

console.log(rspObj.success);

const val = new Value(rspObj.object);
console.log(val);
console.log(12345678);