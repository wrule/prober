import Lodash from 'lodash';
import { Value } from '../value';

export class Field {
  public get SrcName(): string {
    return this.name;
  }

  public get SrcValue(): any {
    return this.value;
  }

  private tsValue: Value;
  public get Value(): Value {
    return this.tsValue;
  }

  /**
   * 可以在TypeScript之中使用的字段名（这里用单引号括起来）
   */
  public get TsFieldName(): string {
    return `'${this.name}'`;
  }


  public get TsCodeDirName(): string {
    return Lodash.camelCase(this.name);
  }

  /**
   * 如果字段数据为对象的话，可以此访问目标接口名称
   */
  public get TsIntfName(): string {
    return `I${Lodash.upperFirst(Lodash.camelCase(this.name))}`
  }

  public constructor(
    private value: any,
    private name: string = '',
  ) {
    this.tsValue = new Value(value);
  }
}
