import fs from 'fs';
import path from 'path';
import { Field } from './field';
import { IntfCode } from './intfCode';
import { TypeDeducer } from './typeDeducer';
import { TypeJSON } from './typeJson';
import { Type } from './type';
import { TypeInterface } from './type/interface';
import { TypeKind } from './typeKind';
import { ICodeOptions } from './codeOptions';

/**
 * 探测器类
 */
export class Prober {
  private readonly TypeFileName: string = 'type.json';

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

  /**
   * 向指定目录写入接口类型定义代码
   * @param outPath 指定目录
   * @param intfType 接口类型
   * @param options 代码生成选项
   */
  private writeIntf(
    outPath: string,
    intfType: TypeInterface,
    options: ICodeOptions,
  ): void {
    intfType.DepIntfTypes.forEach((type) => {
      this.writeIntf(path.join(outPath, type.IntfFullName), type, options);
    });
    const intfCode = new IntfCode(intfType, options);
    this.writeFile(outPath, 'index.ts', intfCode.Code);
  }

  /**
   * 探测JavaScript的值的类型
   * @param value JavaScript值
   * @param desc 类型描述（一般为字段名）
   */
  public Do(
    value: any,
    desc: string = '',
  ): Type {
    const field = new Field(value, desc);
    const deducer = new TypeDeducer();
    return deducer.Deduce(field.Value, field.SrcName);
  }

  /**
   * 从本地加载类型
   * @param inPath 输入路径
   * @returns 加载得到的类型
   */
  public Load(
    inPath: string,
  ): Type {
    const filePath = path.join(inPath, this.TypeFileName);
    const jsonText = fs.readFileSync(filePath, 'utf8');
    return TypeJSON.Parse(jsonText);
  }

  /**
   * Dump类型到本地并且生成代码
   * @param outPath 输出路径
   * @param fileName 目标文件名
   */
  public Dump(
    type: Type,
    outPath: string,
    options: ICodeOptions,
  ): void {
    const jsonStr = TypeJSON.Stringify(type);
    this.writeFile(outPath, this.TypeFileName, jsonStr);
    if (type.Kind === TypeKind.Interface) {
      this.writeIntf(outPath, type as TypeInterface, options);
    } else {
      type.DepIntfTypes.forEach((dtype) => {
        this.writeIntf(path.join(outPath, dtype.IntfFullName), dtype, options);
      });
    }
  }

  /**
   * 判断目录里是否存在类型
   * @param outPath 目录
   * @param fileName 目标文件名
   * @returns 是否存在类型
   */
  public Exists(
    outPath: string,
  ): boolean {
    const filePath = path.join(outPath, this.TypeFileName);
    return fs.existsSync(filePath);
  }

  /**
   * 更新类型
   * @param value JavaScript值
   * @param desc 类型描述（一般为字段名）
   * @param dstPath 代码目标路径
   * @param options 代码生成选项
   */
  public Update(
    value: any,
    desc: string = '',
    dstPath: string = '',
    options: ICodeOptions,
  ): Type {
    let newType = this.Do(value, desc);
    if (this.Exists(dstPath)) {
      const oldType = this.Load(dstPath);
      newType = oldType.Merge(newType);
    }
    this.Dump(newType, dstPath, options);
    return newType;
  }

  public constructor() {}
}
