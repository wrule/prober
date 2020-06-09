import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';
import { TypeInterface } from '../interface';

export class TypeAny extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get IsEmpty(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }

  private static hash: string = Hash(TypeKind.Any);
  public get Hash(): string {
    return TypeAny.hash;
  }

  public get DepIntfTypes(): TypeInterface[] {
    return [];
  }

  protected DiffCompare(type: Type): number {
    return 0;
  }

  protected DiffMerge(type: Type): Type {
    return type;
  }

  public constructor() {
    super(TypeKind.Any);
  }
}
