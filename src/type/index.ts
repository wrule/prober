import Lodash from 'lodash';
import { Value } from '../value';
import { ValueType } from '../valueType';
import { IntfDef } from '../intfDef';

export class Type {
  private typeName: string;
  // TypeScript类型名称
  public get Name(): string {
    return this.typeName;
  }

  private intfs: IntfDef[];
  public get Intfs(): IntfDef[] {
    return this.intfs;
  }

  public get DirName(): string {
    return Lodash.camelCase(this.name);
  }

  public get ClassName(): string {
    return Lodash.upperFirst(Lodash.camelCase(this.name));
  }

  public get IntfName(): string {
    return `I${this.ClassName}`;
  }

  public constructor(
    private value: Value,
    private name: string = '',
  ) {
    this.intfs = [];
    switch (value.Type) {
      case ValueType.Record: {
        this.typeName = this.IntfName;
        this.intfs.push(new IntfDef(value, name));
      } break;
      case ValueType.List: {
        this.typeName = 'any[]';
      } break;
      default: {
        this.typeName = value.Type.toString();
      }
    }
  }
}
