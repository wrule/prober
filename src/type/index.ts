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
   * 用于描述类型结构的hash
   */
  public abstract Hash: string;

  /**
   * 对比类型以获取两个类型之间的相似度
   * @param type 需比较的类型
   * @returns 相似度，范围为[0,1]
   */
  public abstract Compare(type: Type): number;

  /**
   * 将此类型与输入类型合并
   * @param type 输入类型
   */
  protected abstract DiffMerge(type: Type): Type;

  public Merge(type: Type): Type {
    if (this.Hash !== type.Hash) {
      return this.DiffMerge(type);
    } else {
      return this;
    }
  }

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
