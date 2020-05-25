import { IntfDef } from "../intfDef";

export class IntfCode {
  public get Code(): string {
    return `
${this.intfDef.DepSubIntfDefs.map((intf) => `import { ${intf.Name} } from './${intf.DirName}';`).join('\r\n')}

export interface ${this.intfDef.Name} {
${this.intfDef.Fields.map((field) => `  '${field.SrcName}': ${field.Type.TypeDesc};`).join('\r\n')}  
}
`;
  }

  public constructor(
    private intfDef: IntfDef,
  ) {}
}
