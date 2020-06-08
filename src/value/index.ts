import { ValueType } from '../valueType';
import { Field } from '../field';

/**
 * 初步类型化的JavaScript值
 */
export class Value {
  /**
   * 原始传入的JavaScript值
   */
  public get SrcValue(): any {
    return this.value;
  }

  private type: ValueType;
  /**
   * 初步推导出的中间类型
   */
  public get Type(): ValueType {
    return this.type;
  }

  private fields: Field[] = [];
  /**
   * 如果类型为record的话，其字段列表
   */
  public get Fields(): Field[] {
    return this.fields;
  }

  private list: Value[] = [];
  /**
   * 如果类型为list的话，其初步类型化的值列表
   */
  public get List(): Value[] {
    return this.list;
  }

  /**
   * 构造函数
   * @param value 原始的JavaScript值
   */
  public constructor(
    private value: any,
  ) {
    const protName = Object.prototype.toString.call(value);
    switch (protName) {
      case '[object Null]': this.type = ValueType.Null; break;
      case '[object Undefined]': this.type = ValueType.Undefined; break;
      case '[object Boolean]': this.type = ValueType.Boolean; break;
      case '[object Number]': this.type = ValueType.Number; break;
      case '[object String]': this.type = ValueType.String; break;
      case '[object Date]': this.type = ValueType.Date; break;
      case '[object Object]': {
        this.type = ValueType.Record;
        this.fields = Object.entries(this.value).map((ary) => new Field(ary[1], ary[0]));
      } break;
      case '[object Array]': {
        this.type = ValueType.List;
        this.list = (this.value as any[]).map((item) => new Value(item));
      } break;
      default: this.type = ValueType.Unknow;
    }
  }
}
