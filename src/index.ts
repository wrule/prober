import rspObj from '../test/2.json';
import { Field } from './field';
import { Type } from './type';
import fs from 'fs';
import path from 'path';
import { IntfDef } from './intfDef';

/**
 * 探测器类
 */
export class Prober {
  /**
   * 写入某一接口定义的代码到指定路径的文件
   * @param intfDef 接口定义
   * @param outPath 文件写入路径
   */
  private writeIntfDefToFile(
    intfDef: IntfDef,
    outPath: string,
  ): void {
    // 深度优先，生成依赖代码
    intfDef.DepSubIntfDefs.forEach((depIntfDef) => {
      const depDirPath = path.join(outPath, depIntfDef.DirName);
      this.writeIntfDefToFile(depIntfDef, depDirPath);
    });
    if (outPath) {
      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, { recursive: true });
      }
      const codeFilePath = path.join(outPath, 'index.ts');
      fs.writeFileSync(codeFilePath, intfDef.IntfCode.Code);
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
