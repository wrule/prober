import { ValueType } from '../valueType';
import { Field } from '../field';

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

  private list: Value[] = [];
  public get List(): Value[] {
    return this.list;
  }

  public get IsBaseType(): boolean {
    return this.type !== ValueType.Object &&
            this.type !== ValueType.Array;
  }

  private typeHash: string = '';
  public get TypeHash(): string {
    return this.typeHash;
  }

  public constructor(
    private value: any,
  ) {
    const protName = Object.prototype.toString.call(value);
    switch (protName) {
      case '[object Boolean]': this.type = ValueType.Boolean; break;
      case '[object Number]': this.type = ValueType.Number; break;
      case '[object String]': this.type = ValueType.String; break;
      case '[object Date]': this.type = ValueType.Date; break;
      case '[object Object]': {
        this.type = ValueType.Object;
        this.fields = Object.entries(this.value).map((ary) => new Field(ary[1], ary[0]));
      } break;
      case '[object Array]': {
        this.type = ValueType.Array;
        this.list = (this.value as any[]).map((item) => new Value(item));
      } break;
      default: this.type = ValueType.Unknow;
    }
  }
}
