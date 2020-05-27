/**
 * 此枚举描述了最终可供输出的TypeScript类型的种类
 */
export enum TypeKind {
    // 以下五个类型为基础类型，其值可以直接用作TypeScript类型名称
    Any = 'any',
    Boolean = 'boolean',
    Number = 'number',
    String = 'string',
    Date = 'Date',
    // 接口类型
    Interface = '_interface',
    // 联合类型
    Union = '_union',
    // 数组类型
    Array = '_array',
    // 元组类型
    Tuple = '_tuple',
  }
  