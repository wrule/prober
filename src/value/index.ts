import { ValueType } from '../valueType';
import { Field } from '../field';
import { Hash } from '../hash';

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

  private get FieldsSorted(): Field[] {
    const result: Field[] = this.fields.slice(0);
    result.sort((a, b) => a.SrcName.localeCompare(b.SrcName));
    return result;
  }

  private list: Value[] = [];
  public get List(): Value[] {
    return this.list;
  }

  public get IsBaseType(): boolean {
    return this.type !== ValueType.Object &&
            this.type !== ValueType.Array;
  }

  private static UnknowHash: string = Hash('unknow');
  private static BooleanHash: string = Hash('boolean');
  private static NumberHash: string = Hash('number');
  private static StringHash: string = Hash('string');
  private static DateHash: string = Hash('date');

  private typeHash: string = '';
  public get TypeHash(): string {
    return this.typeHash;
  }

  public constructor(
    private value: any,
  ) {
    const protName = Object.prototype.toString.call(value);
    switch (protName) {
      case '[object Boolean]': {
        this.type = ValueType.Boolean;
        this.typeHash = Value.BooleanHash;
      } break;
      case '[object Number]': {
        this.type = ValueType.Number;
        this.typeHash = Value.NumberHash;
      } break;
      case '[object String]': {
        this.type = ValueType.String;
        this.typeHash = Value.StringHash;
      } break;
      case '[object Date]': {
        this.type = ValueType.Date;
        this.typeHash = Value.DateHash;
      } break;
      case '[object Object]': {
        this.type = ValueType.Object;
        this.fields = Object.entries(this.value).map((ary) => new Field(ary[1], ary[0]));
        this.typeHash = Hash(this.FieldsSorted.map((item) => `${item.SrcName}:${item.Value.TypeHash}`).join());
      } break;
      case '[object Array]': {
        this.type = ValueType.Array;
        this.list = (this.value as any[]).map((item) => new Value(item));
        this.typeHash = Hash(this.list.map((item) => item.TypeHash).join());
      } break;
      default: {
        this.type = ValueType.Unknow;
        this.typeHash = Value.UnknowHash;
      }
    }
  }
}
