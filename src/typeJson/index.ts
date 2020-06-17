import { Type } from '../type';
import { TypeKind } from '../typeKind';
import { IJsType } from '../jsType';
import { TypeNull } from '../type/null';
import { TypeUndefined } from '../type/undefined';
import { TypeBoolean } from '../type/boolean';
import { TypeNumber } from '../type/number';
import { TypeString } from '../type/string';
import { TypeDate } from '../type/date';
import { TypeInterface } from '../type/interface';
import { TypeUnion } from '../type/union';
import { TypeArray } from '../type/array';
import { TypeTuple } from '../type/tuple';
import { TypeAny } from '../type/any';

/**
 * 负责处理Type对象与Json文本之间的转换
 */
export class TypeJSON {
  /**
   * 反序列化Type对象
   * @param json Json文本
   * @returns Type对象
   */
  public static Parse(json: string): Type {
    return this.FromJs(JSON.parse(json) as IJsType);
  }

  /**
   * JavaScript对象转化为Type对象
   * @param jsObj JavaScript对象
   * @returns Type对象
   */
  private static FromJs(jsObj: IJsType): Type {
    switch (jsObj.kind) {
      case TypeKind.Null: return new TypeNull();
      case TypeKind.Undefined: return new TypeUndefined();
      case TypeKind.Boolean: return new TypeBoolean();
      case TypeKind.Number: return new TypeNumber();
      case TypeKind.String: return new TypeString();
      case TypeKind.Date: return new TypeDate();
      case TypeKind.Interface: return new TypeInterface(
        jsObj.intfName,
        new Map<string, Type>(jsObj.intfMbrs?.map((mbr) => [mbr[0], this.FromJs(mbr[1])])),
      );
      case TypeKind.Union: return new TypeUnion(...(jsObj.types as IJsType[]).map((type) => this.FromJs(type)));
      case TypeKind.Array: return new TypeArray(this.FromJs((jsObj.types as IJsType[])[0]));
      case TypeKind.Tuple: return new TypeTuple((jsObj.types as IJsType[]).map((type) => this.FromJs(type)));
      default: return new TypeAny();
    }
  }
}
