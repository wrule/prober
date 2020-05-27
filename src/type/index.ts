import Lodash from 'lodash';
import { Value } from '../value';
import { ValueType } from '../valueType';
import { TypeKind } from '../typeKind';
import { Hash } from '../hash';

export class Type {
  private kind: TypeKind;
  /**
   * 类型的种类
   */
  public get Kind(): TypeKind {
    return this.kind;
  }

  /**
   * 此类型是否为基础类型
   */
  public get IsBase(): boolean {
    return (
      this.kind !== TypeKind.Interface &&
      this.kind !== TypeKind.Union &&
      this.kind !== TypeKind.Array &&
      this.kind !== TypeKind.Tuple
    );
  }

  private getInterfaceName(
    desc: string = '',
    suffixs: string[] = [],
  ): string {
    let suffixsText = suffixs.join('_');
    suffixsText = suffixsText ? `_${suffixsText}` : '';
    const name = Lodash.upperFirst(Lodash.camelCase(desc));
    return `I${name}${suffixsText}`;
  }

  private getUnionName(types: Type[]): string {
    return types.map((type) => type.TypeExps).join(' | ');
  }

  private getArrayName(types: Type[]): string {
    return `${this.types[0].TypeExps}[]`;
  }

  private getTupleName(types: Type[]): string {
    return `[${types.map((type) => type.TypeExps).join(', ')}]`;
  }

  /**
   * 获取数组的类型
   * @param values 值列表
   * @param desc 描述
   * @param suffixs 后缀描述
   */
  private getArrayTypes(
    values: Value[],
    desc: string = '',
    suffixs: string[] = [],
  ): Type[] {
    return [new Type(values[0], desc, suffixs.concat(['ArrayItem']))];
  }

  /**
   * 获取元组的所有类型
   * @param values 值列表
   * @param desc 描述
   * @param suffixs 后缀描述
   */
  private getTupleTypes(
    values: Value[],
    desc: string = '',
    suffixs: string[] = [],
  ): Type[] {
    return values.map((value, index) => 
      new Type(value, desc, suffixs
        .concat([`TupleItem${index + 1}x${value.StructHash.slice(0, 4).toUpperCase()}`]))
    );
  }

  /**
   * 判断多个值的结构hash是否一致
   * @param values 值列表
   */
  private hashIsConsistent(values: Value[]): boolean {
    return Array.from(new Set(values.map((value) => value.StructHash))).length < 2;
  }

  private types: Type[] = [];

  public get TypeExps(): string {
    let result = '';
    if (this.IsBase) {
      result = this.kind;
    } else {
      switch (this.kind) {
        case TypeKind.Interface: {
          result = this.getInterfaceName(this.desc, this.suffixs);
        } break;
        case TypeKind.Union: {
          result = this.getUnionName(this.types);
        } break;
        case TypeKind.Array: {
          result = this.getArrayName(this.types);
        } break;
        case TypeKind.Tuple: {
          result = this.getTupleName(this.types);
        } break;
        default:;
      }
    }
    return `(${result})`;
  }


  public get TypeHash(): string {
    if (this.kind === TypeKind.Union) {
      return Hash(this.types.map((type) => type.TypeHash).join('|'));
    } else {
      return this.value.StructHash;
    }
  }


  /**
   * 为此类型联合一个新的类型
   * @param newType 
   */
  public UniteType(newType: Type): void {
    if (this.kind === TypeKind.Union) {

    } else {
      const bkType = {...this};
      this.types = [bkType, newType];
    }
    this.kind = TypeKind.Union;
  }


  public constructor(
    private value: Value | Value[],
    private desc: string = '',
    private suffixs: string[] = [],
  ) {
    const protName = Object.prototype.toString.call(this.value);
    switch (protName) {
      case '[object Array]': {

      } break;
      case '[object Object]': {

      } break;
      default: {

      }
    }
    switch (this.value.Type) {
      case ValueType.Boolean: {
        this.kind = TypeKind.Boolean;
      } break;
      case ValueType.Number: {
        this.kind = TypeKind.Number;
      } break;
      case ValueType.String: {
        this.kind = TypeKind.String;
      } break;
      case ValueType.Date: {
        this.kind = TypeKind.Date;
      } break;
      case ValueType.Record: {
        this.kind = TypeKind.Interface;
      } break;
      case ValueType.List: {
        const list = this.value.List;
        if (list.length > 0) {
          if (this.hashIsConsistent(this.value.List)) {
            this.kind = TypeKind.Array;
            this.types = this.getArrayTypes(list, this.desc, this.suffixs);
          } else {
            this.kind = TypeKind.Tuple;
            this.types = this.getTupleTypes(list, this.desc, this.suffixs);
          }
        } else {
          this.kind = TypeKind.Array;
          this.types = [new Type(new Value(null))];
        }
      } break;
      default: {
        this.kind = TypeKind.Any;
      }
    }
  }
}
