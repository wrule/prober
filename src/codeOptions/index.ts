/**
 * 代码生成选项接口
 */
export interface ICodeOptions {
  /**
   * 接口成员可省略
   */
  mbrOmit?: boolean;
  /**
   * 可添加任意接口成员
   */
  anyMbr?: boolean;
  /**
   * 数组元素采样率，(0, 1]，默认为1，即百分百采样
   */
  arraySamplingRate?: number;
  /**
   * 数组元素采样个数，与采样率冲突，优先级高于采样率
   */
  arraySamplingCount?: number;
}
