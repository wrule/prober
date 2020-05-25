/**
 * 此枚举描述了根据JavaScript的值初步推导出来的中间类型
 */
export enum ValueType {
  // 以下五个类型为基础类型，其值可以直接用作TypeScript类型描述
  // Unknow代表了undefined，null以及其他所有不能识别出类型的数据的类型
  Unknow = 'any',
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Date = 'Date',
  // Record代表一个键值对映射（对象）
  Record = '_record',
  // List为数据列表，后期会演化成为数组或元组
  List = '_list',
}
