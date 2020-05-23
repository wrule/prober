import { ValueType } from '../valueType';
import { Field } from '../field';
import { Hash } from '../hash';

/**
 * 类型化的值类型
 */
export class Value {
  public get SrcValue(): any {
    return this.value;
  }

  private type: ValueType;
  public get Type(): ValueType {
    return this.type;
  }

  private fields: Field[] = [];
  public get Fields(): Field[] {
    return this.fields;
  }

  public get FieldsSorted(): Field[] {
    const result: Field[] = this.fields.slice(0);
    result.sort((a, b) => a.SrcName.localeCompare(b.SrcName));
    return result;
  }

  private list: Value[] = [];
  public get List(): Value[] {
    return this.list;
  }

  public get IsBaseType(): boolean {
    return this.type !== ValueType.Record &&
            this.type !== ValueType.List;
  }

  private static UnknowHash: string = Hash(ValueType.Unknow);
  private static BooleanHash: string = Hash(ValueType.Boolean);
  private static NumberHash: string = Hash(ValueType.Number);
  private static StringHash: string = Hash(ValueType.String);
  private static DateHash: string = Hash(ValueType.Date);

  private structHash: string = '';
  /**
   * 用于描述此值结构的hash字符串
   */
  public get StructHash(): string {
    return this.structHash;
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
      case '[object Boolean]': {
        this.type = ValueType.Boolean;
        this.structHash = Value.BooleanHash;
      } break;
      case '[object Number]': {
        this.type = ValueType.Number;
        this.structHash = Value.NumberHash;
      } break;
      case '[object String]': {
        this.type = ValueType.String;
        this.structHash = Value.StringHash;
      } break;
      case '[object Date]': {
        this.type = ValueType.Date;
        this.structHash = Value.DateHash;
      } break;
      case '[object Object]': {
        this.type = ValueType.Record;
        this.fields = Object.entries(this.value).map((ary) => new Field(ary[1], ary[0]));
        // Record值的hash是所有排序后的字段名称，字段类型hash通过','连接而产生的字符串的hash
        this.structHash = Hash(this.FieldsSorted.map((item) => `${item.SrcName}:${item.Value.StructHash}`).join(','));
      } break;
      case '[object Array]': {
        this.type = ValueType.List;
        this.list = (this.value as any[]).map((item) => new Value(item));
        // List值的类型hash是其中每一个元素的类型hash用','连接而产生的字符串的hash
        this.structHash = Hash(this.list.map((item) => item.StructHash).join(','));
      } break;
      default: {
        this.type = ValueType.Unknow;
        this.structHash = Value.UnknowHash;
      }
    }
  }
}
