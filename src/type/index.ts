import Lodash from 'lodash';
import { Value } from '../value';
import { ValueType } from '../valueType';
import { TypeKind } from '../typeKind';

export class Type {
  // 数据是只有一种类型的列表
  // 元组是有多种类型的列表

  // 类型可以是单个基本类型
  // 类型可以是接口类型
  // 类型可以是多个类型并列
  // 类型可以是某一个类型构成的数组类型
  // 类型可以是多个类型构成的元组类型


  private kind: TypeKind;
  /**
   * 类型种类
   */
  public get Kind(): TypeKind {
    return this.kind;
  }

  private types: Type[] = [];
  /**
   * 类型依赖的类型
   */
  public get Types(): Type[] {
    return this.types;
  }

  private typeExps: string = '';
  /**
   * 类型表达式（可直接用于TypeScript代码）
   */
  public get TypeExps(): string {
    return `(${this.typeExps})`;
  }

  public get IsBase(): boolean {
    return this.kind !== TypeKind.Interface &&
      this.kind !== TypeKind.Array &&
      this.kind !== TypeKind.Tuple;
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

  /**
   * 构造函数
   * @param value 待分析的值
   * @param name 对于值的类型的主要描述（会经过规范化处理）
   * @param suffixs 对于值的类型的后缀描述（不会经过规范化处理）
   */
  public constructor(
    private value: Value,
    private desc: string = '',
    private suffixs: string[] = [],
  ) {
    switch (this.value.Type) {
      case ValueType.Boolean: {
        this.kind = TypeKind.Boolean;
        this.typeExps = TypeKind.Boolean;
      } break;
      case ValueType.Number: {
        this.kind = TypeKind.Number;
        this.typeExps = TypeKind.Number;
      } break;
      case ValueType.String: {
        this.kind = TypeKind.String;
        this.typeExps = TypeKind.String;
      } break;
      case ValueType.Date: {
        this.kind = TypeKind.Date;
        this.typeExps = TypeKind.Date;
      } break;
      case ValueType.Record: {
        this.kind = TypeKind.Interface;
        this.typeExps = this.getInterfaceName(this.desc, this.suffixs);
      } break;
      case ValueType.List: {
        this.kind = TypeKind.Array;
        if (this.value.List.length > 0) {

        } else {
          this.types = [new Type(new Value(null))];
        }
      } break;
      default: {
        this.kind = TypeKind.Any;
      }
    }
  }
}
