import { TypeInterface } from '../type/interface';
import { ICodeOptions } from '../codeOptions';

/**
 * 用于生成接口代码的类
 */
export class IntfCode {
  /**
   * 根据内置模板获取接口TypeScript代码
   */
  public get Code(): string {
    return `
${this.intfType.DepIntfTypes.map((type) => `import { ${type.TypeDesc} } from './${type.IntfFullName}';`).join('\r\n')}

export interface ${this.intfType.TypeDesc} {
${this.intfType
  .Members
  .map((mbr) => `  '${mbr[0]}'${this.options.mbrOmit ? '?' : ''}: ${mbr[1].TypeDesc};`)
  .join('\r\n')}${this.options.anyMbr ? `
  [field: string]: any;` : ''}
}
`.trim() + '\r\n';
  }

  /**
   * 构造函数
   * @param intfType 接口类型
   */
  public constructor(
    private intfType: TypeInterface,
    private options: ICodeOptions,
  ) {}
}
