import { Type } from '../index';
import { TypeKind } from '../../typeKind';

export class TypeNumber extends Type {
  public get IsBase(): boolean {
    return true;
  }

  public get TypeDesc(): string {
    return this.kind.toString();
  }

  public constructor() {
    super(TypeKind.Number);
  }
}
