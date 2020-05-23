import rspObj from '../test/1.json';
import { Value } from './value';
import { Field } from './field';
import Lodash from 'lodash';
import { TsField } from './tsField';

const value = new Value(rspObj.object);
console.log(value.FieldsSorted.map((item) => new TsField(item)).map((item) => [item.Name, item.Type]));

function Do(
  value: any,
  name: string = '',
  outpath?: string,
): string {
  const field = new Field(value, name);
  return '';
}
