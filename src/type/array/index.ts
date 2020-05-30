import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';

export class TypeArray extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types[0].TypeDesc}[]`;
  }

  private hash: string;
  public get Hash(): string {
    return this.hash;
  }

  public get ArrayItemType(): Type {
    return this.types[0];
  }

  public DiffMerge(type: Type): Type {
    if (type.IsBase) {
      return new TypeUnion([this, type]);
    } else {
      switch (type.Kind) {
        case TypeKind.Interface: {
          return new TypeUnion([this, type]);
        } break;
        case TypeKind.Union: {
          return new TypeUnion([this, type]);
        } break;
        case TypeKind.Array: {
          const dstType = type as TypeArray;
          return new TypeArray([this.ArrayItemType.Merge(dstType.ArrayItemType)]);
        } break;
        case TypeKind.Tuple: {

        } break;
      }
    }
    return this;
  }

  public constructor(
    types: Type[] = [],
  ) {
    super(TypeKind.Array, types);
    this.hash = Hash(`${this.types[0].Hash}[]`);
  }
}
