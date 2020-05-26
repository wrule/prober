import { IntfDef } from "../intfDef";

/**
 * 用于生成接口代码的类
 */
export class IntfCode {
  /**
   * 根据内置模板获取接口TypeScript代码
   */
  public get Code(): string {
    return `
${this.intfDef.DepSubIntfDefs.map((intf) => `import { ${intf.Name} } from './${intf.DirName}';`).join('\r\n')}

export interface ${this.intfDef.Name} {
${this.intfDef.Fields.map((field) => `  '${field.SrcName}': ${field.Type.TypeDesc};`).join('\r\n')}  
}
`.trim() + '\r\n';
  }

  /**
   * 构造函数
   * @param intfDef 接口定义
   */
  public constructor(
    private intfDef: IntfDef,
  ) {}
}
