import { Type } from '../index';

export class TypeUnion extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types.map((type) => type.TypeDesc).join(' | ')}`;
  }
}
