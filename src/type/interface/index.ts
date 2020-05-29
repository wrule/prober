import { Type } from '../index';

export class TypeInterface extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return this.intfName;
  }
}
