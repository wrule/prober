import Lodash from 'lodash';
import { Value } from '../value';
import { ValueType } from '../valueType';
import { IntfDef } from '../intfDef';

export class Type {
  private typeName: string;
  // TypeScript类型描述
  public get Name(): string {
    return this.typeName;
  }

  private intfDefs: IntfDef[];
  // 类型描述中蕴含的接口定义列表
  public get IntfDefs(): IntfDef[] {
    return this.intfDefs;
  }

  // 如果字段为记录的话，生产接口名
  private recordIntfName(name: string): string {
    return `I${Lodash.upperFirst(Lodash.camelCase(name))}`;
  }

  public constructor(
    private value: Value,
    private name: string = '',
  ) {
    this.intfDefs = [];
    switch (value.Type) {
      case ValueType.Record: {
        this.typeName = this.recordIntfName(name);
        this.intfDefs.push(new IntfDef(value, this.typeName));
      } break;
      case ValueType.List: {
        // 对数组元素分析求解，这可是很复杂的
        this.typeName = 'any[]';
      } break;
      default: {
        this.typeName = value.Type.toString();
      }
    }
  }
}
