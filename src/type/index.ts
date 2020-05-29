import { TypeKind } from "../typeKind";
import { Value } from "../value";
import { ValueType } from "../valueType";
import Lodash from 'lodash';

export class Type {
  private static getIntfName(
    desc: string = '',
    suffixs: string[] = [],
  ): string {
    const name = Lodash.upperFirst(Lodash.camelCase(desc));
    let suffixsText = suffixs.join('_');
    suffixsText = suffixsText ? `_${suffixsText}` : '';
    return `${name}${suffixsText}`;
  }

  /**
   * 根据值以及其上下文推导值的类型
   * @param value 值
   * @param desc 前置上下文
   * @param suffixs 后置上下文
   * @returns 推导出的类型对象
   */
  public static Infer(
    value: Value,
    desc: string = '',
    suffixs: string[] = [],
  ): Type {
    let kind: TypeKind = TypeKind.Any;
    let types: Type[] = [];
    let intfName: string = '';
    const inftMbrs = new Map<string, Type>();
    switch (value.Type) {
      case ValueType.Null: kind = TypeKind.Null; break;
      case ValueType.Undefined: kind = TypeKind.Undefined; break;
      case ValueType.Boolean: kind = TypeKind.Boolean; break;
      case ValueType.Number: kind = TypeKind.Number; break;
      case ValueType.String: kind = TypeKind.String; break;
      case ValueType.Date: kind = TypeKind.Date; break;
      case ValueType.Record: {
        kind = TypeKind.Interface;
        intfName = this.getIntfName(desc, suffixs);
        value.Fields.forEach((field) => {
          inftMbrs.set(field.SrcName, Type.Infer(field.Value, field.SrcName));
        });
      } break;
      case ValueType.List: {
        kind = TypeKind.Array;
        const list = value.List;
        if (list.length > 0) {
          // 这里先一刀切判断吧
          types = [Type.Infer(list[0], desc, suffixs.concat('ArrayItem'))];
        } else {
          types = [Type.Infer(new Value(null))];
        }
      } break;
      default: kind = TypeKind.Any;
    }
    return new Type(kind, types, intfName, inftMbrs);
  }

  public static Merge(type1: Type, type2: Type): Type | void {

  }

  /**
   * 反序列化Type
   * @param json Json文本
   */
  public static Parse(json: string): Type | void {

  }

  /**
   * 序列化Type
   */
  public ToJson(): string {
    return '';
  }

  public get Kind(): TypeKind {
    return this.kind;
  }

  public get IsBase(): boolean {
    return (
      this.kind !== TypeKind.Interface &&
      this.kind !== TypeKind.Union &&
      this.kind !== TypeKind.Array &&
      this.kind !== TypeKind.Tuple
    );
  }

  /**
   * 获取类型描述（可在TypeScript代码中使用的类型）
   */
  public get TypeDesc(): string {
    let desc = TypeKind.Any.toString();
    if (this.IsBase) {
      desc = this.kind.toString();
    } else {
      switch (this.kind) {
        case TypeKind.Interface: desc = this.intfName; break;
        case TypeKind.Union: desc = `${this.types.map((type) => type.TypeDesc).join(' | ')}`; break;
        case TypeKind.Array: desc = `${this.types[0].TypeDesc}[]`; break;
        case TypeKind.Tuple: desc = `[${this.types.map((type) => type.TypeDesc).join(', ')}]`; break;
      }
    }
    return `(${desc})`;
  }



  private hashIsConsistent(values: Value[]): boolean {
    return Array.from(new Set(values.map((value) => value.StructHash))).length < 2;
  }

  /**
   * 构造函数
   * @param kind 类型的种类
   * @param types 类型依赖的类型
   * @param intfName 接口类型的接口名
   * @param inffMbrs 接口类型的接口成员
   */
  public constructor(
    private kind: TypeKind = TypeKind.Any,
    private types: Type[] = [],
    private intfName: string = '',
    private inffMbrs: Map<string, Type> = new Map<string, Type>(),
  ) {}

  // public constructor(
  //   value: Value,
  //   desc: string = '',
  //   suffixs: string[] = [],
  // ) {
  //   switch (value.Type) {
  //     case ValueType.Null: this.kind = TypeKind.Null; break;
  //     case ValueType.Undefined: this.kind = TypeKind.Undefined; break;
  //     case ValueType.Boolean: this.kind = TypeKind.Boolean; break;
  //     case ValueType.Number: this.kind = TypeKind.Number; break;
  //     case ValueType.String: this.kind = TypeKind.String; break;
  //     case ValueType.Date: this.kind = TypeKind.Date; break;
  //     case ValueType.Record: {
  //       this.kind = TypeKind.Interface;
  //       this.intfName = this.getIntfName(desc, suffixs);
  //     } break;
  //     case ValueType.List: {
  //       this.kind = TypeKind.Array;
  //       const list = value.List;
  //       if (list.length > 0) {

  //       } else {
  //         this.types = [new Type(new Value(null))];
  //       }
  //     } break;
  //     default: this.kind = TypeKind.Any;
  //   }
  // }
}
