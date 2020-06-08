import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';

/**
 * 联合类型，一种数据可能为多种类型的类型
 */
export class TypeUnion extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get IsEmpty(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `(${this.types.map((type) => type.TypeDesc).join(' | ')})`;
  }

  private hash: string;
  public get Hash(): string {
    return this.hash;
  }

  /**
   * 相似度比较
   * 联合类型除了和自身hash一致的类型之外，与其他类型的对比相似度都为0
   * @param type 对比类型
   */
  protected DiffCompare(type: Type): number {
    return 0;
  }

  /**
   * 将某一个类型合并到此联合类型
   * @param type 类型
   * @returns 合并后的联合类型
   */
  private unionMerge(type: Type): TypeUnion {
    // 获取当前联合类型的构成类型列表
    const types = [...this.types];
    if (type.Kind === TypeKind.Union) {
      let dstType = new TypeUnion(...types);
      type.Types.forEach((item) => {
        dstType = dstType.unionMerge(item);
      });
      return dstType;
    } else {
      const simils = types.map((mtype) => mtype.Compare(type));
      const maxSimil = Math.max(...simils);
      if (maxSimil >= 0.3) {
        const maxIndex = simils.findIndex((simil) => simil === maxSimil);
        const srcType = types[maxIndex];
        types.splice(maxIndex, 1, srcType.Merge(type));
      } else {
        types.push(type);
      }
      return new TypeUnion(...types);
    }
  }

  protected DiffMerge(type: Type): Type {
    const simil = this.DiffCompare(type);
    if (simil >= 1) {
      return this;
    } else {
      return this.unionMerge(type);
    }
  }

  /**
   * 构造函数
   * @param types 类型列表，此类型列表必须为处理过的最优化类型列表
   */
  public constructor(
    ...types: Type[]
  ) {
    super(TypeKind.Union, types);
    // 排序后计算hash，hash排序对于union类型来说是必须的
    // union类型的hash为每一个可能的类型的hash通过|连接而生成的字符串的hash
    const hashsSorted = this.types
      .map((type) => type.Hash)
      .sort((a, b) => a.localeCompare(b))
      .join('|');
    this.hash = Hash(hashsSorted);
  }

  /**
   * 采集构造时传入的类型列表，主要是为了去重
   * @param types 类型列表
   * @returns 去重后的类型列表
   */
  private collectTypes(types: Type[]): Type[] {
    let result = this.expandTypes(types);
    result = this.distinctTypes(result);
    result = this.tryMergeTypes(result);
    return result;
  }

  /**
   * 展开类型数组
   * 此方法会递归展开类型数组中的union类型
   * @param types 类型数组
   * @returns 展开后的类型数组
   */
  private expandTypes(types: Type[]): Type[] {
    const allTypes: Type[] = [];
    types.forEach((type) => {
      if (type.Kind === TypeKind.Union) {
        allTypes.push(...this.expandTypes(type.Types));
      } else {
        allTypes.push(type);
      }
    });
    return allTypes;
  }

  /**
   * 类型数组根据hash去重
   * @param types 类型数组
   * @returns hash去重之后的类型数组
   */
  private distinctTypes(types: Type[]): Type[] {
    const hashTypesMap = new Map<string, Type>();
    types.forEach((type) => {
      hashTypesMap.set(type.Hash, type);
    });
    return Array.from(hashTypesMap.values());
  }

  /**
   * 尝试在数组范围内内部优化合并类型数组
   * @param types 类型数组
   * @returns 优化合并之后的类型数组
   */
  private tryMergeTypes(types: Type[]): Type[] {
    return [];
  }
}
