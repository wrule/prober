import Hasha from 'hasha';

/**
 * 提供对于文本进行hash计算的方法
 * @param text 文本
 */
export function Hash(text: string): string {
  return Hasha(text, {
    algorithm: 'sha1',
  });
}
