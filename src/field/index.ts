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

  public constructor(
    private value: any,
    private name: string = '',
  ) {
    this.tsValue = new Value(value);
  }
}
