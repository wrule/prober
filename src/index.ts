import rspObj from '../test/2.json';
import { Field } from './field';
import { Type } from './type';
import fs from 'fs';
import path from 'path';
import { IntfDef } from './intfDef';

export class Prober {
  private writeIntfToFile(
    intf: IntfDef,
    output: string,
  ): void {
    intf.DepSubIntfDefs.forEach((intf) => {
      this.writeIntfToFile(intf, path.resolve(output, intf.DirName));
    });
    if (output) {
      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
      }
      const codeFilePath = path.resolve(output, 'index.ts');
      fs.writeFileSync(codeFilePath, intf.IntfCode.Code, 'utf8');
    }
  }

  public Do(
    value: any,
    desc: string = '',
    outpath: string = '',
  ): Type {
    const field = new Field(value, desc);
    return field.Type;
  }

  public constructor() {}
}
