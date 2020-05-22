import rspObj from '../test/1.json';
import { Value } from './value';
import { Field } from './field';
import Lodash from 'lodash';

console.log(`I${Lodash.upperFirst(Lodash.camelCase(' ss ss dd'))}`);

const value = new Value(rspObj.object);
console.log(value.FieldsSorted.map((item) => [item.TsFieldName, item.TsIntfName]));

function Do(
  value: any,
  name: string = '',
  outpath?: string,
): string {
  const field = new Field(value, name);
  return '';
}
