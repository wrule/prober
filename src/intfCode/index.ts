import { TypeInterface } from '../type/interface';

/**
 * 用于生成接口代码的类
 */
export class IntfCode {
  /**
   * 根据内置模板获取接口TypeScript代码
   */
  public get Code(): string {
    return `
${([] as any[]).map((intf) => `import { ${intf.Name} } from './${intf.DirName}';`).join('\r\n')}

export interface ${this.intfType.TypeDesc} {
${this.intfType.Members.map((mbr) => `  '${mbr.name}': ${mbr.type.TypeDesc};`).join('\r\n')}  
}
`.trim() + '\r\n';
  }

  /**
   * 构造函数
   * @param intfType 接口类型
   */
  public constructor(
    private intfType: TypeInterface,
  ) {}
}
