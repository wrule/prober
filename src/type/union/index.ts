import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';

export class TypeUnion extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types.map((type) => type.TypeDesc).join(' | ')}`;
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

  protected DiffMerge(type: Type): Type {
    const simil = this.DiffCompare(type);
    if (simil >= 1) {
      return this;
    } else {
      return new TypeUnion(this, type);
    }
  }

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
}
