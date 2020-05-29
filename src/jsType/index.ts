/**
 * 用于约束Type类型JavaScript化的接口
 */
export interface IJsType {
  kind: string,
  types: IJsType[],
  intfName: string,
  intfMbrs: [string, IJsType][],
}
