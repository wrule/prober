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

  /**
   * 数组元素的类型
   */
  public get ArrayItemType(): Type {
    return this.types[0];
  }

  /**
   * 相似度比较
   * 如果比较对象同为数组类型的话，相似度取数组元素类型的相似度
   * 如果类型为其他的话，相似度为0
   * @param type 对比类型
   */
  protected DiffCompare(type: Type): number {
    if (type.Kind === TypeKind.Array) {
      const arrayType = type as TypeArray;
      return this.ArrayItemType.Compare(arrayType.ArrayItemType);
    } else {
      return 0;
    }
  }

  protected DiffMerge(type: Type): Type {
    if (type.IsBase) {
      return new TypeUnion([this, type]);
    } else {
      switch (type.Kind) {
        case TypeKind.Interface: return new TypeUnion([this, type]);
        case TypeKind.Union: return new TypeUnion([this, type]);
        case TypeKind.Array: {
          const dstType = type as TypeArray;
          return new TypeArray(this.ArrayItemType.Merge(dstType.ArrayItemType));
        }
        case TypeKind.Tuple: return new TypeUnion([this, type]);
        default: return new TypeUnion([this, type]);
      }
    }
  }

  public constructor(
    type: Type,
  ) {
    super(TypeKind.Array, [type]);
    this.hash = Hash(`${this.ArrayItemType.Hash}[]`);
  }
}
