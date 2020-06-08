import fs from 'fs';
import path from 'path';
import { Field } from './field';
import { IntfCode } from './intfCode';
import { TypeDeducer } from './typeDeducer';
import { TypeJSON } from './typeJson';
import { Type } from './type';

/**
 * 探测器类
 */
export class Prober {
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
      fs.writeFileSync(outPath, jsonStr, 'utf8');
    }
    return type;
  }

  public constructor() {}
}
