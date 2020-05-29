import { TypeKind } from "../typeKind";
import { Value } from "../value";
import { ValueType } from '../valueType';
import { IJsType } from '../jsType';
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
    const intfMbrs = new Map<string, Type>();
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
          intfMbrs.set(field.SrcName, Type.Infer(field.Value, field.SrcName));
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
    return new Type(kind, types, intfName, intfMbrs);
  }

  public static Merge(type1: Type, type2: Type): Type | void {
    if (type1.IsBase) {
      if (type1.TypeDesc === type1.TypeDesc) {
        return type2;
      } else {
        if (type2.Kind === TypeKind.Union) {

        } else {
          return new Type(TypeKind.Union, [type1, type2]);
        }
      }
    } else {
      switch (type1.Kind) {
        case TypeKind.Interface:; break;
        case TypeKind.Union:; break;
        case TypeKind.Array:; break;
        case TypeKind.Tuple:; break;
      }
    }
  }

  /**
   * 判断两个类型是否可以合并
   * @param type1 类型1
   * @param type2 类型2
   */
  public static CanMerge(type1: Type, type2: Type): boolean {
    return false;
  }

  /**
   * 计算两个类型之间的相似度
   * @param type1 类型1
   * @param type2 类型2
   * @returns 相似度 0 ~ 1
   */
  public static Similarity(type1: Type, type2: Type): number {
    return 0;
  }

  /**
   * 反序列化Type
   * @param json Json文本
   */
  public static Parse(json: string): Type {
    return this.FromJs(JSON.parse(json));
  }

  /**
   * 序列化Type
   */
  public ToJson(): string {
    return JSON.stringify(this.ToJs());
  }

  /**
   * TypeScript对象转化为JavaScript对象
   */
  public ToJs(): IJsType {
    return {
      kind: this.kind.toString(),
      types: this.types.map((type) => type.ToJs()),
      intfName: this.intfName,
      intfMbrs: Array.from(this.intfMbrs.entries()).map((mbr) => [mbr[0], mbr[1].ToJs()]),
    };
  }

  /**
   * 从JavaScript对象构建TypeScript对象
   * @param jsObj JavaScript对象
   */
  public static FromJs(jsObj: IJsType): Type {
    return new Type(
      jsObj.kind as TypeKind,
      jsObj.types.map((type) => Type.FromJs(type)),
      jsObj.intfName,
      new Map<string, Type>(jsObj.intfMbrs.map((mbr) => [mbr[0], Type.FromJs(mbr[1])])),
    );
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
   * @param intfMbrs 接口类型的接口成员
   */
  public constructor(
    private kind: TypeKind = TypeKind.Any,
    private types: Type[] = [],
    private intfName: string = '',
    private intfMbrs: Map<string, Type> = new Map<string, Type>(),
  ) {}
}
