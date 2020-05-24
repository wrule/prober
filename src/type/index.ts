import Lodash from 'lodash';
import { Value } from '../value';
import { ValueType } from '../valueType';
import { IntfDef } from '../intfDef';
import { TypeKind } from '../typeKind';

export class Type {
  private kind: TypeKind = TypeKind.Any;
  public get Kind(): TypeKind {
    return this.kind;
  }

  private typeDesc: string = '';
  public get TypeDesc(): string {
    return this.typeDesc;
  }

  private intfDefs: IntfDef[] = [];
  public get IntfDefs(): IntfDef[] {
    return this.intfDefs;
  }

  private interfaceName(name: string): string {
    return `I${Lodash.upperFirst(Lodash.camelCase(name))}`;
  }

  private hashIsConsistent(values: Value[]): boolean {
    return new Set(values.map((value) => value.StructHash)).values.length < 2;
  }

  /**
   * 构造函数
   * @param value 待分析的值
   * @param name 对于值的类型的描述
   */
  public constructor(
    private value: Value,
    private name: string = '',
  ) {
    switch (this.value.Type) {
      case ValueType.Boolean: {
        this.kind = TypeKind.Boolean;
        this.typeDesc = TypeKind.Boolean.toString();
      } break;
      case ValueType.Number: {
        this.kind = TypeKind.Number;
        this.typeDesc = TypeKind.Number.toString();
      } break;
      case ValueType.String: {
        this.kind = TypeKind.String;
        this.typeDesc = TypeKind.String.toString();
      } break;
      case ValueType.Date: {
        this.kind = TypeKind.Date;
        this.typeDesc = TypeKind.Date.toString();
      } break;
      case ValueType.Record: {
        this.kind = TypeKind.Interface;
        this.typeDesc = this.interfaceName(this.name);
        this.intfDefs.push(new IntfDef(this.value, this.typeDesc));
      } break;
      case ValueType.List: {

        const list = this.value.List;
        if (list.length > 0) {
          if (this.hashIsConsistent(list)) {
            const first = list[0];
            const itemName = `${this.name}ArrayItem`;
            const itemType = new Type(first, itemName);
            this.typeDesc = `${itemType.TypeDesc}[]`;
            this.intfDefs.push(...itemType.IntfDefs);
          } else {

          }
        } else {
          this.kind = TypeKind.Array;
          this.typeDesc = `${TypeKind.Any.toString()}[]`;
        }

      } break;
      default: {
        this.kind = TypeKind.Any;
        this.typeDesc = TypeKind.Any.toString();
      }
    }
  }
}
