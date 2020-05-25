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
    return Array.from(new Set(values.map((value) => value.StructHash))).length < 2;
  }

  private isContainingUnknow(values: Value[]): boolean {
    return values.some((value) => value.Type === ValueType.Unknow);
  }

  private filterOutUnknow(values: Value[]): Value[] {
    return values.filter((value) => value.Type !== ValueType.Unknow);
  }

  /**
   * 从值列表中收集元组信息
   * @param values 值列表
   * @param name 元组描述名
   */
  private collectTuple(
    values: Value[],
    name: string = '',
    suffix: string = '',
  ): [string, IntfDef[]] {
    // 存放所有元组项目的类型列表
    const typeList: Type[] = [];
    // 存放所有元组项目的值的hash和对应类型的映射（用于元组内根据hash聚类）
    const hashTypeMap = new Map<string, Type>();
    // 收集元组内所有项目的类型信息
    values.forEach((value) => {
      const curHash = value.StructHash;
      if (hashTypeMap.has(curHash)) {
        const existingType = hashTypeMap.get(curHash) as Type;
        typeList.push(existingType);
      } else {
        const kindNum = Array.from(hashTypeMap.values()).filter(
          (type) => type.Kind === TypeKind.Interface
        ).length + 1;
        const kindCode = curHash.slice(0, 4).toUpperCase();
        const newTypeSuffix = `${suffix ? `${suffix}_` : ''}TupleItemKind${kindNum}_${kindCode}`;
        const newType = new Type(value, name, newTypeSuffix);
        hashTypeMap.set(curHash, newType);
        typeList.push(newType);
      }
    });
    // 整理输出结果
    const tupleTypeDesc: string = `[${typeList.map((type) => type.TypeDesc).join(', ')}]`;
    const tupleIntfDefs: IntfDef[] = [];
    typeList.forEach((type) => {
      tupleIntfDefs.push(...type.IntfDefs);
    });
    return [tupleTypeDesc, tupleIntfDefs];
  }

  /**
   * 从某一个值中收集数组信息
   * @param value 值
   * @param desc 数组主要描述
   * @param suffix 数组后缀描述
   */
  private collectArray(
    value: Value,
    desc: string = '',
    suffix: string = '',
  ): void {

  }

  /**
   * 构造函数
   * @param value 待分析的值
   * @param name 对于值的类型的主要描述（会经过规范化处理）
   * @param suffix 对于值的类型的后缀描述（不会经过规范化处理）
   */
  public constructor(
    private value: Value,
    private desc: string = '',
    private suffix: string = '',
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
        this.typeDesc = `${this.interfaceName(this.desc)}_${this.suffix}`;
        this.intfDefs.push(new IntfDef(this.value, this.typeDesc));
      } break;
      case ValueType.List: {

        const list = this.value.List;
        if (list.length > 0) {
          console.log(this.desc, 'list长度大于0');
          if (this.hashIsConsistent(list)) {
            console.log('hash一致');
            // 标准的数组，hash一致
            const first = list[0];
            const itemType = new Type(first, this.desc, 'ArrayItem');
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
              // 标准的元组
              const result = this.collectTuple(list, this.desc, this.suffix);
              this.typeDesc = result[0];
              this.intfDefs = result[1];
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
