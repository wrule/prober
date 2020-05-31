import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';

export class TypeNull extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }

  private static hash: string = Hash(TypeKind.Null);
  public get Hash(): string {
    return TypeNull.hash;
  }

  public DiffCompare(type: Type): number {
    return 0;
  }

  public DiffMerge(type: Type): Type {
    return new TypeUnion([this, type]);
  }

  public constructor() {
    super(TypeKind.Null);
  }
}
