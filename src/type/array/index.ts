import { Type } from '../index';

export class TypeArray extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types[0].TypeDesc}[]`;
  }
}
