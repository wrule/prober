import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';

export class TypeString extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }

  private static hash: string = Hash(TypeKind.String);
  public get Hash(): string {
    return TypeString.hash;
  }

  public DiffCompare(type: Type): number {
    return 0;
  }

  public DiffMerge(type: Type): Type {
    return new TypeUnion([this, type]);
  }

  public constructor() {
    super(TypeKind.String);
  }
}
