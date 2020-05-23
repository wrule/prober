import Lodash from 'lodash';
import { Value } from "../value";
import { ValueType } from "../valueType";

export class Type {
  // TypeScript类型名称
  public get Name(): string {
    if (this.value.IsBaseType) {
      return this.value.Type.toString();
    } else if (this.value.Type === ValueType.Record) {
      return this.IntfName;
    } else if (this.value.Type === ValueType.List) {
      return 'any[]';
    } else {
      return ValueType.Unknow.toString();
    }
  }

  /**
   * 此类型使用到的类型列表
   */
  public get UseTypes(): Type[] {
    return [];
  }

  /**
   * 此类型直接依赖的类型列表
   */
  public get DepTypes(): Type[] {
    const result: Type[] = [];
    switch (this.value.Type) {
      case ValueType.Record: {
        // this.value.Fields.forEach((field) => {
        //   field.Type.
        // });
      } break;
      case ValueType.List: {

      } break;
      default:;
    }
    return result;
  }

  public get DirName(): string {
    return Lodash.camelCase(this.name);
  }

  public get IntfName(): string {
    return `I${Lodash.upperFirst(Lodash.camelCase(this.name))}`;
  }

  public constructor(
    private value: Value,
    private name: string = '',
  ) {}
}
