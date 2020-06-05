import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';
import { TypeUndefined } from '../undefined';

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

  /**
   * 对两个元组类型进行比较，获取相似度
   * 这是一个按位递归对比算法
   * @param type 需要对比的元组类型
   * @returns 相似度，范围为[0,1]
   */
  private tupleCompare(type: TypeTuple): number {
    let longerTypes: Type[] = [];
    let otherTypes: Type[] = [];
    if (this.types.length > type.types.length) {
      longerTypes = this.types;
      otherTypes = type.types;
    } else {
      longerTypes = type.types;
      otherTypes = this.types;
    }
    const weightList = longerTypes.map((ltype, index) => {
      if (index < otherTypes.length) {
        const otype = otherTypes[index];
        return ltype.Compare(otype);
      } else {
        return ltype.Compare(new TypeUndefined());
      }
    });
    let sumWeight = 0;
    weightList.forEach((weight) => sumWeight += weight);
    return sumWeight / longerTypes.length;
  }

  /**
   * 相似度比较
   * 如果比较对象同为元组类型的话，则触按位比较
   * 如果类型为其他的话，相似度为0
   * @param type 对比类型
   */
  public DiffCompare(type: Type): number {
    if (type.Kind === TypeKind.Tuple) {
      return this.tupleCompare(type as TypeTuple);
    } else {
      return 0;
    }
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
    // 元组类型的hash为其中每个项目类型的hash通过,连接产生的字符串的hash
    this.hash = Hash(this.types.map((type) => type.Hash).join(','));
  }
}
