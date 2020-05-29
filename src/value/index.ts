import { ValueType } from '../valueType';
import { Field } from '../field';
import { Hash } from '../hash';

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

  /**
   * 如果类型为record的话，其按字段名稳定排序后的字段列表
   */
  public get FieldsSorted(): Field[] {
    const result: Field[] = this.fields.slice(0);
    result.sort((a, b) => a.SrcName.localeCompare(b.SrcName));
    return result;
  }

  private list: Value[] = [];
  /**
   * 如果类型为list的话，其初步类型化的值列表
   */
  public get List(): Value[] {
    return this.list;
  }

  /**
   * 是否为基础类型
   */
  public get IsBaseType(): boolean {
    return this.type !== ValueType.Record &&
            this.type !== ValueType.List;
  }

  // 五种基础类型的结构hash值
  private static NullHash: string = Hash(ValueType.Null);
  private static UndefinedHash: string = Hash(ValueType.Undefined);
  private static BooleanHash: string = Hash(ValueType.Boolean);
  private static NumberHash: string = Hash(ValueType.Number);
  private static StringHash: string = Hash(ValueType.String);
  private static DateHash: string = Hash(ValueType.Date);
  private static UnknowHash: string = Hash(ValueType.Unknow);

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
      case '[object Null]': {
        this.type = ValueType.Null;
        this.structHash = Value.NullHash;
      } break;
      case '[object Undefined]': {
        this.type = ValueType.Undefined;
        this.structHash = Value.UndefinedHash;
      } break;
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
        this.structHash = Hash(this.FieldsSorted.map((field) => `${field.SrcName}:${field.Value.StructHash}`).join(','));
      } break;
      case '[object Array]': {
        this.type = ValueType.List;
        this.list = (this.value as any[]).map((item) => new Value(item));
        // List值的类型hash是其中每一个元素的类型hash用','连接而产生的字符串的hash
        this.structHash = Hash(this.list.map((value) => value.StructHash).join(','));
      } break;
      default: {
        this.type = ValueType.Unknow;
        this.structHash = Value.UnknowHash;
      }
    }
  }
}
