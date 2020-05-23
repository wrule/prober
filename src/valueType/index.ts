/**
 * 此枚举描述了一个用于过渡的中间类型系统，和JavaScript数据一对一映射
 */
export enum ValueType {
  // 一下五个类型为基础类型，其值可以直接用作TypeScript类型名称
  // Unknow代表了undefined，null以及其他所有不能识别出类型的数据的类型
  Unknow = 'any',
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Date = 'Date',
  // Record代表一个键值对映射（对象）
  Record = '_record',
  // List后期会演化成为数组或元组
  List = '_list',
}
