import rspObj from '../test/3.json';
import { Value } from './value';
import { Field } from './field';
import Lodash from 'lodash';

const field = new Field(rspObj.object, 'rsp');
console.log(field.Type.IntfDefs[0].Name);

function Do(
  value: any,
  name: string = '',
  outpath?: string,
): string {
  const field = new Field(value, name);
  return '';
}
