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
import { TypeKind } from '../typeKind';

/**
 * 类型推导器
 */
export class TypeDeducer {
  /**
   * 根据值和描述信息推导类型
   * @param value 值
   * @param desc 前置描述信息
   * @param suffixs 后置描述信息
   * @returns 推导出的类型
   */
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
        if (this.isArray(list)) {
          const types = list.map((value) => this.Deduce(value, desc, suffixs.concat('ArrayItem')));
          const mergedType = this.wholeMerge(types);
          return new TypeArray(mergedType);
        } else {
          const types = list.map((value) => this.Deduce(value, desc, suffixs.concat('TupleItem')));
          return new TypeTuple(types);
        }
      }
      default: return new TypeAny();
    }
  }

  /**
   * 整体合并多个类型
   * @param types 类型列表
   * @returns 合并出的类型
   */
  private wholeMerge(types: Type[]): Type {
    if (types.length < 1) {
      return new TypeAny();
    } else {
      let mergedType = types[0];
      for (let i = 1; i < types.length; ++i) {
        mergedType = mergedType.Merge(types[i]);
      }
      return mergedType;
    }
  }

  /**
   * 判断值列表是否可构成数组类型
   * @param values 值列表
   * @returns 是否可构成数组类型
   */
  private isArray(values: Value[]): boolean {
    const types = values.map((value) => this.Deduce(value));
    const mergedType = this.wholeMerge(types);
    if (mergedType.Kind === TypeKind.Union) {
      const notEmptyTypesNum = mergedType.Types.filter((type) => !type.IsEmpty).length;
      return notEmptyTypesNum < 2;
    } else {
      return true;
    }
  }

  /**
   * 根据描述信息生成接口名
   * @param desc 前置描述信息
   * @param suffixs 后置描述信息
   * @returns 生成的接口名字符串
   */
  private getIntfName(
    desc: string = '',
    suffixs: string[] = [],
  ): string {
    const name = Lodash.camelCase(desc);
    let suffixsText = suffixs.join('_');
    suffixsText = suffixsText ? `_${suffixsText}` : '';
    return `${name}${suffixsText}`;
  }
}
