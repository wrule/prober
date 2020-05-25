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

  private isContainingUnknow(values: Value[]): boolean {
    return values.some((value) => value.Type === ValueType.Unknow);
  }

  private filterOutUnknow(values: Value[]): Value[] {
    return values.filter((value) => value.Type !== ValueType.Unknow);
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
            // 标准的数组，hash一致
            const first = list[0];
            const itemName = `${this.name}ArrayItem`;
            const itemType = new Type(first, itemName);
            this.typeDesc = `${itemType.TypeDesc}[]`;
            this.intfDefs.push(...itemType.IntfDefs);
          } else {
            const containingUnknow = this.isContainingUnknow(list);
            if (containingUnknow) {
              const filteredList = this.filterOutUnknow(list);
              if (this.hashIsConsistent(filteredList)) {
                // 元素可能为空的数组
              } else {
                // 元组
              }
            } else {
              const tupleItemTypeDescList: string[] = [];
              const tupleItemIntfDefs: IntfDef[] = [];
              // 标准的元组
              list.map((value, index) => {
                const tupleItemName = `${this.name}TupleItem${index.toString()}${value.StructHash.slice(0, 4).toUpperCase()}`;
                const tupleItemType = new Type(value, tupleItemName);
                tupleItemTypeDescList.push(tupleItemType.TypeDesc);
                tupleItemIntfDefs.push(...tupleItemType.IntfDefs);
              });
              this.typeDesc = `[${tupleItemTypeDescList.join(', ')}]`;
              this.intfDefs = tupleItemIntfDefs;
            }
          }
        } else {
          // list长度为空，无法判断类型，故为any[]
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
