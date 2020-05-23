import { Value } from '../value';
import { Type } from '../type';

/**
 * 类型化的字段类型
 */
export class Field {
  /**
   * 字段原始的名称
   */
  public get SrcName(): string {
    return this.name;
  }

  /**
   * 字段原始的值
   */
  public get SrcValue(): any {
    return this.value;
  }

  private tsValue: Value;
  /**
   * 字段原始值经过类型化转化之后的值
   */
  public get Value(): Value {
    return this.tsValue;
  }

  private tsType: Type;
  public get Type(): Type {
    return this.tsType;
  }

  /**
   * 构造函数
   * @param value 字段名称
   * @param name 字段值
   */
  public constructor(
    private value: any,
    private name: string = '',
  ) {
    this.tsValue = new Value(value);
    this.tsType = new Type(this.tsValue, name);
  }
}
