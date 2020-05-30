import { TypeKind } from '../typeKind';

/**
 * 用于约束JavaScript化Type类型对象的接口
 */
export interface IJsType {
  kind: TypeKind,
  types: IJsType[],
  intfName: string,
  intfMbrs: [string, IJsType][],
}
