import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';

export class TypeArray extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types[0].TypeDesc}[]`;
  }

  private hash: string;
  public get Hash(): string {
    return this.hash;
  }

  public Merge(type: Type): Type {
    return this;
  }

  public constructor(
    types: Type[] = [],
  ) {
    super(TypeKind.Array, types);
    this.hash = Hash(`${this.types[0].Hash}[]`);
  }
}
