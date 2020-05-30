import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';

export class TypeUndefined extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }

  private static hash: string = Hash(TypeKind.Undefined);
  public get Hash(): string {
    return TypeUndefined.hash;
  }

  public Merge(type: Type): Type {
    return this;
  }

  public constructor() {
    super(TypeKind.Undefined);
  }
}
