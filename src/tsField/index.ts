import Lodash from 'lodash';
import { Field } from "../field";
import { ValueType } from "../valueType";

export class TsField {
  public get Name(): string {
    return `'${this.field.SrcName}'`;
  }

  public get Type(): string {
    if (this.field.Value.IsBaseType) {
      return this.field.Value.Type.toString();
    } else if (this.field.Value.Type === ValueType.Record) {
      return this.IntfName;
    } else if (this.field.Value.Type === ValueType.List) {
      return 'any[]';
    } else {
      return ValueType.Unknow.toString();
    }
  }

  private get IntfName(): string {
    return `I${Lodash.upperFirst(Lodash.camelCase(this.field.SrcName))}`;
  }

  public get DirName(): string {
    return Lodash.camelCase(this.field.SrcName);
  }

  public constructor(
    private field: Field,
  ) {}
}
