import { TypeKind } from '../typeKind';
import { TypeInterface } from './interface';

/**
 * Type抽象类
 */
export abstract class Type {
  /**
   * 类型是否为基础类型
   */
  public abstract IsBase: boolean;

  /**
   * 类型是否代表着空数据
   */
  public abstract IsEmpty: boolean;

  /**
   * 类型描述（可在TypeScript代码中直接使用的类型）
   */
  public abstract TypeDesc: string;

  /**
   * 用于描述类型结构的hash
   */
  public abstract Hash: string;

  /**
   * 类型依赖的接口类型
   */
  public abstract DepIntfTypes: TypeInterface[];

  protected abstract DiffCompare(type: Type): number;

  protected abstract DiffMerge(type: Type): Type;

  /**
   * 比较类型以获取两个类型之间的相似度
   * @param type 需比较的类型
   * @returns 相似度，范围为[0,1]
   */
  public Compare(type: Type): number {
    if (this.Hash !== type.Hash) {
      return this.DiffCompare(type);
    } else {
      return 1;
    }
  }

  /**
   * 尝试将此类型与传入类型合并
   * @param type 传入类型
   * @returns 合并后的类型
   */
  public Merge(type: Type): Type {
    if (this.Hash !== type.Hash) {
      if (type.Kind === TypeKind.Union) {
        return type.DiffMerge(this);
      } else {
        return this.DiffMerge(type);
      }
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
