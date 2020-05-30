import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';

export class TypeAny extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }

  private static hash: string = Hash(TypeKind.Any);
  public get Hash(): string {
    return TypeAny.hash;
  }

  public Merge(type: Type): Type {
    return this;
  }

  public constructor() {
    super(TypeKind.Any);
  }
}
