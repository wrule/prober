import { TypeKind } from '../typeKind';

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
   * 类型依赖的类型
   */
  public get Types(): Type[] {
    return this.types;
  }

  /**
   * 接口类型的接口名
   */
  public get IntfName(): string {
    return this.intfName;
  }

  /**
   * 接口类型的接口成员
   */
  public get IntfMbrs(): Map<string, Type> {
    return this.intfMbrs;
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
