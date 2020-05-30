import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';

export class TypeUnion extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types.map((type) => type.TypeDesc).join(' | ')}`;
  }

  private hash: string;
  public get Hash(): string {
    return this.hash;
  }

  public DiffMerge(type: Type): Type {
    return this;
  }

  public constructor(
    types: Type[] = [],
  ) {
    super(TypeKind.Union, types);
    this.hash = Hash(this.types.map((type) => type.Hash).join('|'));
  }
}
