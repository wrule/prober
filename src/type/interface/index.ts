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

  public Compare(type: Type): number {
    if (this.Hash !== type.Hash) {
      if (type.Kind === TypeKind.Interface) {
        // 以下算法对于接口树进行了递归对比并且计算相似度总和
        const intfType = type as TypeInterface;
        const thisKeys = Array.from(this.intfMbrs.keys());
        const otherKeys = Array.from(intfType.intfMbrs.keys());
        const allKeys = Array.from(new Set(thisKeys.concat(otherKeys)));
        const sameKeys = thisKeys.filter((key) => otherKeys.some((okey) => okey === key));
        const typeWeight = 0.4;
        const nameWeight = 1 - 0.4;
        const weightList = sameKeys.map((key) => {
          const type1 = this.intfMbrs.get(key) as Type;
          const type2 = intfType.intfMbrs.get(key) as Type;
          return nameWeight + (typeWeight * type1.Compare(type2));
        });
        let sumWeight = 0;
        weightList.forEach((weight) => sumWeight += weight);
        return sumWeight / allKeys.length;
      } else {
        return 0;
      }
    } else {
      return 1;
    }
    return this.Hash === type.Hash ? 1 : 0;
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
