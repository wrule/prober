import { Type } from '../index';
import { TypeKind } from '../../typeKind';

export class TypeArray extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types[0].TypeDesc}[]`;
  }

  public constructor(
    types: Type[] = [],
  ) {
    super(TypeKind.Array, types);
  }
}
