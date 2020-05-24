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

  // 如果字段为记录的话，生成接口名
  private recordIntfName(name: string): string {
    return `I${Lodash.upperFirst(Lodash.camelCase(name))}`;
  }

  /**
   * 如果字段为记录数组的话，生成接口名
   * @param name 输入的字段名称
   */
  private recordArrayItemIntfName(name: string): string {
    return `I${Lodash.upperFirst(Lodash.camelCase(name))}Array_Item`;
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
    this.intfDefs = [];
    switch (this.value.Type) {
      case ValueType.Record: {
        this.typeName = this.recordIntfName(this.name);
        this.intfDefs.push(new IntfDef(this.value, this.typeName));
      } break;
      case ValueType.List: {
        this.typeName = '';
        // 对数组元素分析求解，这可是很复杂的
        const list = this.value.List;
        if (list.length > 0) {
          const hashs = Array.from(new Set(list.map((item) => item.StructHash)));
          // 数组结构一致
          if (hashs.length < 2) {
            const first = list[0];
            switch (first.Type) {
              case ValueType.Record: {
                this.typeName = this.recordArrayItemIntfName(this.name);
                this.intfDefs.push(new IntfDef(first, this.typeName));
                console.log(this.typeName);
              } break;
              case ValueType.List: {

              } break;
              default: {
                this.typeName = `${first.Type.toString()}[]`;
                console.log(this.typeName);
              }
            }
          } else {

          }
        } else {
          this.typeName = 'any[]';
        }
      } break;
      default: {
        this.typeName = this.value.Type.toString();
      }
    }
  }
}
