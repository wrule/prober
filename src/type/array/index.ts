import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';
import { TypeInterface } from '../interface';
import { IJsType } from '../../jsType';

export class TypeArray extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get IsEmpty(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.ArrayItemType.TypeDesc}[]`;
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

  public get DepIntfTypes(): TypeInterface[] {
    if (this.ArrayItemType.Kind === TypeKind.Interface) {
      return [this.ArrayItemType as TypeInterface];
    } else {
      return this.ArrayItemType.DepIntfTypes;
    }
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
      return 0.1 + this.ArrayItemType.Compare(arrayType.ArrayItemType) * 0.9;
    } else {
      return 0;
    }
  }

  protected DiffMerge(type: Type): Type {
    const simil = this.DiffCompare(type);
    if (type.Kind === TypeKind.Array) {
      const arrayType = type as TypeArray;
      return new TypeArray(this.ArrayItemType.Merge(arrayType.ArrayItemType));
    } else {
      return new TypeUnion(this, type);
    }
  }

  protected ToSpecJs(): IJsType {
    return {
      types: this.types.map((type) => type.ToJs()),
    };
  }

  public constructor(
    type: Type,
  ) {
    super(TypeKind.Array, [type]);
    this.hash = Hash(`${this.ArrayItemType.Hash}[]`);
  }
}
