/**
 * 此枚举描述了最终可供输出的TypeScript类型的种类
 */
export enum TypeKind {
    // 以下七个类型为基础类型，其值可以直接用作TypeScript类型名称
    /**
     * 未知的类型
     */
    Any = 'any',
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
     * Date类型
     */
    Date = 'Date',
    /**
     * 接口类型
     */
    Interface = '_interface',
    /**
     * 联合类型
     */
    Union = '_union',
    /**
     * 数组类型
     */
    Array = '_array',
    /**
     * 元组类型
     */
    Tuple = '_tuple',
  }
  