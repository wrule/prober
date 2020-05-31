import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';

export class TypeTuple extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `[${this.types.map((type) => type.TypeDesc).join(', ')}]`;
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
    super(TypeKind.Tuple, types);
    this.hash = Hash(this.types.map((type) => type.Hash).join(','));
  }
}
