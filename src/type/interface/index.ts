import Lodash from 'lodash';
import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';
import { TypeUndefined } from '../undefined';
import { IJsType } from '../../jsType';

export class TypeInterface extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get IsEmpty(): boolean {
    return false;
  }

  public get IntfFullName(): string {
    return `${this.IntfName}_${this.hash.slice(0, 8).toUpperCase()}`;
  }

  public get TypeDesc(): string {
    return `I${Lodash.upperFirst(this.IntfFullName)}`;
  }

  /**
   * 稳定排序后的接口成员列表
   */
  private get MembersSorted(): [string, Type][] {
    const result = [...this.Members];
    result.sort((a, b) => a[0].localeCompare(b[0]));
    return result;
  }

  private hash: string;
  public get Hash(): string {
    return this.hash;
  }

  public get DepIntfTypes(): TypeInterface[] {
    const intfTypes: TypeInterface[] = [];
    this.Members.forEach((mbr) => {
      if (mbr[1].Kind === TypeKind.Interface) {
        intfTypes.push(mbr[1] as TypeInterface);
      } else {
        intfTypes.push(...mbr[1].DepIntfTypes);
      }
    });
    return intfTypes;
  }

  public get Members(): [string, Type][] {
    return Array.from(this.intfMbrs.entries());
  }

  /**
   * 对两个接口类型进行比较，获取相似度
   * 这是一个递归求和算法，不算复杂，具体可以看代码
   * @param type 需要对比的接口类型
   * @param typeWeight 类型在计算中所占的权重
   * @returns 相似度，范围为[0,1]
   */
  private intfCompare(
    type: TypeInterface,
    typeWeight: number = 0.4,
  ): number {
    const thisKeys = Array.from(this.intfMbrs.keys());
    const otherKeys = Array.from(type.intfMbrs.keys());
    const allKeys = Array.from(new Set(thisKeys.concat(otherKeys)));
    const nameWeight = 1 - typeWeight;
    const weightList = allKeys.map((key) => {
      const type1 = this.intfMbrs.get(key);
      const type2 = type.intfMbrs.get(key);
      if (type1 && type2) {
        return nameWeight + (typeWeight * type1.Compare(type2));
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
   * 如果比较对象同为接口类型的话，则触发递归求和比较
   * 如果类型为其他的话，相似度为0
   * @param type 对比类型
   */
  protected DiffCompare(type: Type): number {
    if (type.Kind === TypeKind.Interface) {
      return 0.1 + this.intfCompare(type as TypeInterface) * 0.9;
    } else {
      return 0;
    }
  }

  private intfMerge(type: TypeInterface): TypeInterface {
    const intfName = this.intfName;
    const intfMbrs = new Map<string, Type>();
    const thisKeys = Array.from(this.intfMbrs.keys());
    const otherKeys = Array.from(type.intfMbrs.keys());
    const allKeys = Array.from(new Set(thisKeys.concat(otherKeys)));
    const undefinedType = new TypeUndefined();
    allKeys.forEach((key) => {
      const type1 = this.intfMbrs.get(key) || undefinedType;
      const type2 = type.intfMbrs.get(key) || undefinedType;
      intfMbrs.set(key, type1.Merge(type2));
    });
    return new TypeInterface(intfName, intfMbrs);
  }

  protected DiffMerge(type: Type): Type {
    if (type.Kind === TypeKind.Interface) {
      return this.intfMerge(type as TypeInterface);
    } else {
      return new TypeUnion(this, type);
    }
  }

  protected ToSpecJs(): IJsType {
    return {
      intfName: this.intfName,
      intfMbrs: Array.from(this.intfMbrs.entries()).map((mbr) => [mbr[0], mbr[1].ToJs()]),
    };
  }

  public constructor(
    intfName: string = '',
    intfMbrs: Map<string, Type> = new Map<string, Type>(),
  ) {
    super(TypeKind.Interface, [], intfName, intfMbrs);
    // 接口类型的hash为排序后的接口成员名以及成员类型hash通过;连接的字符串的hash
    this.hash = Hash(this.MembersSorted.map((mbr) => `${mbr[0]}:${mbr[1].Hash}`).join(';'));
  }
}
