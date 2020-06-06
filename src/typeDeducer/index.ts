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
        const types = value.List.map((item) => this.Deduce(item));
        let mergedType = types[0];
        for (let i = 1; i < types.length; ++i) {
          mergedType = mergedType.Merge(types[i]);
        }
        const notEmptyTypesNum = mergedType.Types.filter((type) => !type.IsEmpty).length;
        if (notEmptyTypesNum > 1) {
          // 构建元组应该也是需要智能合并类型的吧
          return new TypeTuple(types);
        } else {
          return new TypeArray(mergedType);
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
