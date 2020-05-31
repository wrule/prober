import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';

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

  public Compare(type: Type): number {
    return this.Hash === type.Hash ? 1 : 0;
  }

  protected DiffMerge(type: Type): Type {
    return new TypeUnion([this, type]);
  }

  public constructor() {
    super(TypeKind.Any);
  }
}
