import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';
import { TypeUndefined } from '../undefined';
import { TypeInterface } from '../interface';
import { IJsType } from '../../jsType';

export class TypeTuple extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get IsEmpty(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `[${this.types.map((type) => type.TypeDesc).join(', ')}]`;
  }

  private hash: string;
  public get Hash(): string {
    return this.hash;
  }

  public get DepIntfTypes(): TypeInterface[] {
    const intfTypes: TypeInterface[] = [];
    this.types.forEach((type) => {
      if (type.Kind === TypeKind.Interface) {
        intfTypes.push(type as TypeInterface);
      } else {
        intfTypes.push(...type.DepIntfTypes);
      }
    });
    return intfTypes;
  }

  private typesOrder(type: TypeTuple): [Type[], Type[]] {
    let longerTypes: Type[] = [];
    let otherTypes: Type[] = [];
    if (this.types.length > type.types.length) {
      longerTypes = this.types;
      otherTypes = type.types;
    } else {
      longerTypes = type.types;
      otherTypes = this.types;
    }
    return [longerTypes, otherTypes];
  }

  /**
   * 对两个元组类型进行比较，获取相似度
   * 这是一个按位递归对比算法
   * @param type 需要对比的元组类型
   * @returns 相似度，范围为[0,1]
   */
  private tupleCompare(type: TypeTuple): number {
    const [longerTypes, otherTypes] = this.typesOrder(type);
    const weightList = longerTypes.map((ltype, index) => {
      if (index < otherTypes.length) {
        const otype = otherTypes[index];
        return ltype.Compare(otype);
      } else {
        return 0;
      }
    });
    let sumWeight = 0;
    weightList.forEach((weight) => sumWeight += weight);
    return sumWeight / weightList.length;
  }

  /**
   * 相似度比较
   * 如果比较对象同为元组类型的话，则按位递归求和比较
   * 如果类型为其他的话，相似度为0
   * @param type 对比类型
   */
  protected DiffCompare(type: Type): number {
    if (type.Kind === TypeKind.Tuple) {
      return 0.1 + this.tupleCompare(type as TypeTuple) * 0.9;
    } else {
      return 0;
    }
  }

  private tupleMerge(type: TypeTuple): TypeTuple {
    const [longerTypes, otherTypes] = this.typesOrder(type);
    const undefinedType = new TypeUndefined();
    const types = longerTypes.map((ltype, index) => {
      return ltype.Merge(otherTypes[index] || undefinedType);
    });
    return new TypeTuple(types);
  }

  protected DiffMerge(type: Type): Type {
    if (type.Kind === TypeKind.Tuple) {
      return this.tupleMerge(type as TypeTuple);
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
    types: Type[] = [],
  ) {
    super(TypeKind.Tuple, types);
    // 元组类型的hash为其中每个项目类型的hash通过,连接产生的字符串的hash
    this.hash = Hash(this.types.map((type) => type.Hash).join(','));
  }
}
