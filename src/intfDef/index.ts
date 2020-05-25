import Lodash from 'lodash';
import { Value } from "../value";
import { Field } from "../field";
import { IntfCode } from "../intfCode";

/**
 * 接口定义类
 * 描述了一个接口的定义
 */
export class IntfDef {
  /**
   * 接口名称
   */
  public get Name(): string {
    return `I${Lodash.upperFirst(this.name)}`;
  }

  public get DirName(): string {
    return this.name;
  }

  /**
   * 接口拥有的字段列表
   */
  public get Fields(): Field[] {
    return this.value.Fields;
  }

  private depSubIntfDefs: IntfDef[];
  /**
   * 接口依赖的子级接口列表
   */
  public get DepSubIntfDefs(): IntfDef[] {
    return this.depSubIntfDefs;
  }

  public get IntfCode(): IntfCode {
    return new IntfCode(this);
  }

  /**
   * 构造函数
   * @param value 字段值
   * @param name 接口名称
   */
  public constructor(
    private value: Value,
    private name: string = '',
  ) {
    // 获取接口依赖的子级接口列表
    const result: IntfDef[] = [];
    const nameSet = new Set<string>();
    this.value.Fields.forEach((field) => {
      field.Type.IntfDefs.forEach((intf) => {
        if (!nameSet.has(intf.Name)) {
          result.push(intf);
          nameSet.add(intf.Name);
        }
      });
    });
    this.depSubIntfDefs = result;
  }
}
