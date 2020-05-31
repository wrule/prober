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

  public Compare(type: Type): number {
    return this.Hash === type.Hash ? 1 : 0;
  }

  public DiffMerge(type: Type): Type {
    if (type.IsBase) {
      return new TypeUnion([this, type]);
    } else {
      switch (type.Kind) {
        case TypeKind.Interface: return new TypeUnion([this, type]);
        case TypeKind.Union: return new TypeUnion([this, type]);
        case TypeKind.Array: return new TypeUnion([this, type]);
        case TypeKind.Tuple: return new TypeUnion([this, type]);
        default: return new TypeUnion([this, type]);
      }
    }
  }

  public constructor(
    types: Type[] = [],
  ) {
    super(TypeKind.Union, types);
    // 排序后计算hash，这一步对于union类型来说是必须的
    const hashsSorted = this.types
      .map((type) => type.Hash)
      .sort((a, b) => a.localeCompare(b))
      .join('|');
    this.hash = Hash(hashsSorted);
  }
}
