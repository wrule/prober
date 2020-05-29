import { Type } from '../index';

export class TypeBoolean extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }
}
