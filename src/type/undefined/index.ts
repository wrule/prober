import { Type } from '../index';
import { TypeKind } from '../../typeKind';
import { Hash } from '../../hash';
import { TypeUnion } from '../union';
import { TypeInterface } from '../interface';
import { IJsType } from '../../jsType';

export class TypeUndefined extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get IsEmpty(): boolean {
    return true;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }

  private static hash: string = Hash(TypeKind.Undefined);
  public get Hash(): string {
    return TypeUndefined.hash;
  }

  public get DepIntfTypes(): TypeInterface[] {
    return [];
  }

  protected DiffCompare(type: Type): number {
    return 0;
  }

  protected DiffMerge(type: Type): Type {
    return new TypeUnion(this, type);
  }

  protected ToSpecJs(): IJsType {
    return {};
  }

  public constructor() {
    super(TypeKind.Undefined);
  }
}
