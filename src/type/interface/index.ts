import { Type } from '../index';
import { TypeKind } from '../../typeKind';

export class TypeInterface extends Type {
  public get IsBase(): boolean {
    return false;
  }

  public get TypeDesc(): string {
    return this.intfName;
  }

  public constructor(
    intfName: string = '',
    intfMbrs: Map<string, Type> = new Map<string, Type>(),
  ) {
    super(TypeKind.Interface, [], intfName, intfMbrs);
  }
}
