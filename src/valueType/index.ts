/**
 * 此枚举描述了根据JavaScript的值初步推导出来的中间类型
 */
export enum ValueType {
  // 以下七个类型为基础类型，其值可以直接用作TypeScript类型描述
  // Unknow代表了不能识别出类型的数据的类型
  /**
   * 未知类型，any
   */
  Unknow = 'any',
  /**
   * null类型
   */
  Null = 'null',
  /**
   * undefined类型
   */
  Undefined = 'undefined',
  /**
   * boolean类型
   */
  Boolean = 'boolean',
  /**
   * number类型
   */
  Number = 'number',
  /**
   * string类型
   */
  String = 'string',
  /**
   * date类型
   */
  Date = 'Date',
  /**
   * Record代表一个键值对映射（对象）
   */
  Record = '_record',
  /**
   * List为数据列表，后期会演化成为数组或元组
   */
  List = '_list',
}
