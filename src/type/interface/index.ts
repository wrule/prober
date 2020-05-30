import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeAny } from '../any';
import { TypeUnion } from '../union';

export class TypeInterface extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return this.intfName;
  }

  /**
   * 稳定排序后的接口成员列表
   */
  public get MembersSorted(): [string, Type][] {
    const result = Array.from(this.intfMbrs.entries());
    result.sort((a, b) => a[0].localeCompare(b[0]));
    return result;
  }

  private hash: string;
  public get Hash(): string {
    return this.hash;
  }

  public DiffMerge(type: Type): Type {
    if (type.IsBase) {
      return new TypeUnion([this, type]);
    } else {
      switch (type.Kind) {
        case TypeKind.Interface: return new TypeUnion([this, type]);
        case TypeKind.Union: return new TypeUnion([this, type]);
        case TypeKind.Array: return new TypeUnion([this, type])
        case TypeKind.Tuple: return new TypeUnion([this, type]);
        default: return new TypeUnion([this, type]);
      }
    }
  }

  public constructor(
    intfName: string = '',
    intfMbrs: Map<string, Type> = new Map<string, Type>(),
  ) {
    super(TypeKind.Interface, [], intfName, intfMbrs);
    this.hash = Hash(this.MembersSorted.map((mbr) => `${mbr[0]}:${mbr[1].Hash}`).join(';'));
  }
}
