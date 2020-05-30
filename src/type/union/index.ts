import { Type } from '../index';
import { TypeKind } from '../../typeKind';

export class TypeUnion extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return `${this.types.map((type) => type.TypeDesc).join(' | ')}`;
  }

  public constructor(
    types: Type[] = [],
  ) {
    super(TypeKind.Union, types);
  }
}
