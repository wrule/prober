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
    Interface = '_interface',
    Array = '_array',
    Tuple = '_tuple',
  }
  