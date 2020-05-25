import rspObj from '../test/2.json';
import { Value } from './value';
import { Field } from './field';
import Lodash from 'lodash';
import { Type } from './type';
import fs from 'fs';
import path from 'path';
import { IntfDef } from './intfDef';


function writeIntfToFile(
  intf: IntfDef,
  output: string,
): void {
  intf.DepSubIntfDefs.forEach((intf) => {
    writeIntfToFile(intf, path.resolve(output, intf.DirName));
  });
  if (output) {
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output, { recursive: true });
    }
    const codeFilePath = path.resolve(output, 'index.ts');
    fs.writeFileSync(codeFilePath, intf.IntfCode.Code, 'utf8');
  }
}

function Do(
  value: any,
  name: string = '',
  outpath?: string,
): Type {
  const field = new Field(value, name);
  if (outpath) {
    field.Type.IntfDefs.forEach((intf) => {
      writeIntfToFile(intf, outpath);
    });
  }
  return field.Type;
}

Do(rspObj.object, 'rsp', path.resolve(__dirname, 'output'));
