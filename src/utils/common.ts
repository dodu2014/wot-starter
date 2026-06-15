/**
 * 延迟执行指定的时间
 * @param ms - 延迟的毫秒数
 * @returns 在指定延迟后解析的 Promise
 */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
