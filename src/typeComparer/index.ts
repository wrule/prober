import { Type } from '../type';

/**
 * 类型比较器
 */
export class TypeComparer {
  /**
   * 比较两个类型的相似度
   * @param type1 类型1
   * @param type2 类型2
   * @returns 两个类型的相似度，为一个范围为[0, 1]的数值
   */
  public Compare(type1: Type, type2: Type): number {
    return 0;
  }
}
