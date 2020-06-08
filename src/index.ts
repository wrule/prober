import fs from 'fs';
import path from 'path';
import { Field } from './field';
import { IntfCode } from './intfCode';
import { TypeDeducer } from './typeDeducer';
import { TypeJSON } from './typeJson';
import { Type } from './type';
import { TypeInterface } from './type/interface';
import { TypeKind } from './typeKind';

/**
 * 探测器类
 */
export class Prober {
  /**
   * 向指定目录写入文本文件
   * @param outPath 目录
   * @param fileName 文件名
   * @param text 文本内容
   */
  private writeFile(
    outPath: string,
    fileName: string,
    text: string,
  ): void {
    if (!fs.existsSync(outPath)) {
      fs.mkdirSync(outPath, { recursive: true });
    }
    fs.writeFileSync(path.join(outPath, fileName), text, 'utf8');
  }

  private writeIntf(
    outPath: string,
    intfType: TypeInterface,
  ): void {
    intfType.DepIntfTypes.forEach((type) => {
      this.writeIntf(path.join(outPath, type.IntfName), type);
    });
    const intfCode = new IntfCode(intfType);
    this.writeFile(outPath, 'index.ts', intfCode.Code);
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
  ): Type {
    const field = new Field(value, desc);
    const deducer = new TypeDeducer();
    const type = deducer.Deduce(field.Value, field.SrcName);
    if (outPath) {
      const jsonStr = TypeJSON.Stringify(type);
      this.writeFile(outPath, 'type.json', jsonStr);
      if (type.Kind === TypeKind.Interface) {
        this.writeIntf(outPath, type as TypeInterface);
      } else {
        type.DepIntfTypes.forEach((dtype) => {
          this.writeIntf(path.join(outPath, dtype.IntfName), dtype);
        });
      }
    }
    return type;
  }

  public constructor() {}
}
