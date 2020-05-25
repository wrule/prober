import Lodash from 'lodash';
import { Value } from '../value';
import { ValueType } from '../valueType';
import { IntfDef } from '../intfDef';
import { TypeKind } from '../typeKind';

export class Type {
  private kind: TypeKind;
  /**
   * 类型的种类，具体请参看typeKind
   */
  public get Kind(): TypeKind {
    return this.kind;
  }

  private typeDesc: string;
  /**
   * 类型描述，此值即为字段在TypeScript中的类型
   */
  public get TypeDesc(): string {
    return this.typeDesc;
  }

  private intfDefs: IntfDef[];
  /**
   * 此类型依赖的接口定义列表
   */
  public get IntfDefs(): IntfDef[] {
    return this.intfDefs;
  }



  /**
   * 判断多个值的结构hash是否一致
   * @param values 值列表
   */
  private hashIsConsistent(values: Value[]): boolean {
    return Array.from(new Set(values.map((value) => value.StructHash))).length < 2;
  }

  /**
   * 判断多个值其中是否包含unknow类型的值
   * @param values 值列表
   */
  private isContainingUnknow(values: Value[]): boolean {
    return values.some((value) => value.Type === ValueType.Unknow);
  }

  /**
   * 从值列表中过滤掉unknow类型的值，并返回过滤结果
   * @param values 值列表
   */
  private filterOutUnknow(values: Value[]): Value[] {
    return values.filter((value) => value.Type !== ValueType.Unknow);
  }

  /**
   * 从值列表中收集元组信息
   * @param values 值列表
   * @param desc 主要描述
   * @param suffixs 后缀描述
   */
  private collectTuple(
    values: Value[],
    name: string = '',
    suffixs: string[] = [],
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
        const newTypeSuffix = `TupleItemKind${kindNum}x${kindCode}`;
        const newType = new Type(value, name, suffixs.concat([newTypeSuffix]));
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
   * 锚定某一个值，且收集数组信息
   * @param value 值
   * @param desc 主要描述
   * @param suffixs 后缀描述
   */
  private collectArray(
    value: Value,
    desc: string = '',
    suffixs: string[] = [],
  ): [string, IntfDef[]] {
    const arrayItemType = new Type(value, desc, suffixs.concat(['ArrayItem']));
    return [`${arrayItemType.TypeDesc}[]`, arrayItemType.IntfDefs];
  }

  private collectInterface(
    value: Value,
    desc: string = '',
    suffixs: string[] = [],
  ): [string, IntfDef[]] {
    const suffixsText = suffixs.join('_');
    const name = `${Lodash.camelCase(desc)}${suffixsText ? `_${suffixsText}` : ''}`;
    const intfName = `I${Lodash.upperFirst(Lodash.camelCase(desc))}${suffixsText ? `_${suffixsText}` : ''}`;
    const intfDefs = [new IntfDef(value, name)];
    return [intfName, intfDefs];
  }

  /**
   * 构造函数
   * @param value 待分析的值
   * @param name 对于值的类型的主要描述（会经过规范化处理）
   * @param suffixs 对于值的类型的后缀描述（不会经过规范化处理）
   */
  public constructor(
    private value: Value,
    private desc: string = '',
    private suffixs: string[] = [],
  ) {
    this.intfDefs = [];
    switch (this.value.Type) {
      case ValueType.Boolean: {
        this.kind = TypeKind.Boolean;
        this.typeDesc = TypeKind.Boolean;
      } break;
      case ValueType.Number: {
        this.kind = TypeKind.Number;
        this.typeDesc = TypeKind.Number;
      } break;
      case ValueType.String: {
        this.kind = TypeKind.String;
        this.typeDesc = TypeKind.String;
      } break;
      case ValueType.Date: {
        this.kind = TypeKind.Date;
        this.typeDesc = TypeKind.Date;
      } break;
      case ValueType.Record: {
        this.kind = TypeKind.Interface;
        [this.typeDesc, this.intfDefs] = this.collectInterface(this.value, this.desc, this.suffixs);
      } break;
      case ValueType.List: {
        const list = this.value.List;
        if (list.length > 0) {
          if (this.hashIsConsistent(list)) {
            // hash一致，为标准的数组
            this.kind = TypeKind.Array;
            const first = list[0];
            [this.typeDesc, this.intfDefs] = this.collectArray(first, this.desc, this.suffixs);
          } else {
            // hash不一致，为标准的元组
            this.kind = TypeKind.Tuple;
            [this.typeDesc, this.intfDefs] = this.collectTuple(list, this.desc, this.suffixs);
          }
        } else {
          // list长度为空，无法判断类型，故为any[]
          this.kind = TypeKind.Array;
          this.typeDesc = `${TypeKind.Any}[]`;
        }
      } break;
      default: {
        this.kind = TypeKind.Any;
        this.typeDesc = TypeKind.Any;
      }
    }
  }
}
