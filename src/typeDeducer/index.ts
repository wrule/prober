import Lodash from 'lodash';
import { Value } from '../value';
import { ValueType } from '../valueType';
import { TypeNull } from '../type/null';
import { TypeUndefined } from '../type/undefined';
import { TypeBoolean } from '../type/boolean';
import { TypeNumber } from '../type/number';
import { TypeString } from '../type/string';
import { TypeDate } from '../type/date';
import { TypeAny } from '../type/any';
import { TypeInterface } from '../type/interface';
import { Type } from '../type';
import { TypeTuple } from '../type/tuple';
import { TypeArray } from '../type/array';

/**
 * 类型推导器
 */
export class TypeDeducer {
  public Deduce(
    value: Value,
    desc: string = '',
    suffixs: string[] = [],
  ): Type {
    switch (value.Type) {
      case ValueType.Null: return new TypeNull();
      case ValueType.Undefined: return new TypeUndefined();
      case ValueType.Boolean: return new TypeBoolean();
      case ValueType.Number: return new TypeNumber();
      case ValueType.String: return new TypeString();
      case ValueType.Date: return new TypeDate();
      case ValueType.Record: {
        return new TypeInterface(
          this.getIntfName(desc, suffixs),
          new Map<string, Type>(value.Fields.map((field) => [field.SrcName, this.Deduce(field.Value, field.SrcName)])),
        );
      }
      case ValueType.List: {
        const list = value.List;
        if (list.length > 0) {
          // 这里先一刀切判断吧
          return new TypeArray([this.Deduce(list[0], desc, suffixs.concat('ArrayItem'))]);
        } else {
          return new TypeArray([new TypeAny()]);
        }
      }
      default: return new TypeAny();
    }
  }

  private getIntfName(
    desc: string = '',
    suffixs: string[] = [],
  ): string {
    const name = Lodash.upperFirst(Lodash.camelCase(desc));
    let suffixsText = suffixs.join('_');
    suffixsText = suffixsText ? `_${suffixsText}` : '';
    return `${name}${suffixsText}`;
  }
}
