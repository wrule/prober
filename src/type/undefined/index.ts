import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';

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

  protected DiffCompare(type: Type): number {
    return 0;
  }

  protected DiffMerge(type: Type): Type {
    return new TypeUnion(this, type);
  }

  public constructor() {
    super(TypeKind.Undefined);
  }
}
