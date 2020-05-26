import fs from 'fs';
import path from 'path';
import { Field } from './field';
import { IntfDef } from './intfDef';
import { IntfCode } from './intfCode';

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
      fs.writeFileSync(codeFilePath, new IntfCode(intfDef).Code);
    }
  }

  /**
   * 探测JavaScript的值的类型
   * @param value JavaScript值
   * @param desc 类型描述（一般为字段名）
   * @param outPath 代码输出目录的路径
   */
  public Do(
    value: any,
    desc: string = '',
    outPath: string = '',
  ): Field {
    const field = new Field(value, desc);
    if (outPath) {
      field.Type.IntfDefs.forEach((intfDef) => {
        this.writeIntfDefToFile(intfDef, outPath);
      });
    }
    return field;
  }

  public constructor() {}
}
