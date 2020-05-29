import { TypeKind } from '../typeKind';
import { IJsType } from '../jsType';

export abstract class Type {
  /**
   * 类型是否为基础类型
   */
  public abstract IsBase: boolean;

  /**
   * 类型描述（可在TypeScript代码中使用的类型）
   */
  public abstract TypeDesc: string;

  /**
   * 类型的种类
   */
  public get Kind(): TypeKind {
    return this.kind;
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
    return JSON.stringify(this.ToJs(), null, 2);
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

  /**
   * 构造函数
   * @param kind 类型的种类
   * @param types 类型依赖的类型
   * @param intfName 接口类型的接口名
   * @param intfMbrs 接口类型的接口成员
   */
  public constructor(
    protected kind: TypeKind = TypeKind.Any,
    protected types: Type[] = [],
    protected intfName: string = '',
    protected intfMbrs: Map<string, Type> = new Map<string, Type>(),
  ) {}
}