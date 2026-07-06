// #ifdef APP
const animation = weex.requireModule('animation')
// #endif

// 定义动画过渡的参数类型
interface TransitionStyles {
  opacity?: number
  transform?: string
}

interface AnimationOptions {
  styles: TransitionStyles
  duration: number
  timingFunction?: string
  delay?: number
}

/**
 * Weex 平台动画工具函数组合式函数, 仅支持 APP 平台
 * 提供在 Weex 平台上执行元素动画过渡效果的能力
 *
 * @example
 *
 * ``` ts
 * const { setWeexAnimate } = useWeexAnimation()
 * // 红包摇摆动画
 * async function startShakeAnimation() {
 *   // 获取红包元素的 ref
 *   const redpacketElement = redEnvelopeRef.value
 *   if (!redpacketElement) return
 *
 *   // 定义第一次摆动动画：向左旋转 -15 度，持续 150 毫秒
 *   await setWeexAnimate(redpacketElement, { transform: 'rotate(-15deg)' }, 75, 'ease', 0)
 *   // 定义第二次摆动动画：向右旋转 15 度，持续 150 毫秒
 *   await setWeexAnimate(redpacketElement, { transform: 'rotate(15deg)' }, 150, 'ease', 0)
 *   // 定义复位动画：回到 0 度，持续 150 毫秒
 *   await setWeexAnimate(redpacketElement, { transform: 'rotate(-15deg)' }, 150, 'ease', 0)
 *   // 定义复位动画：回到 0 度，持续 150 毫秒
 *   await setWeexAnimate(redpacketElement, { transform: 'rotate(0)' }, 75, 'ease', 0)
 *   console.log('红包摇摆动画完成')
 * }
 *
 * // 文字上浮动画
 * async function startFloatingAnimation() {
 *   // 获取红包元素的 ref
 *   const textElement = redEnvelopeTextRef.value
 *   if (!textElement) return
 *
 *   // 从底部进入并渐显
 *   await setWeexAnimate(textElement, { opacity: 1, transform: 'translateY(0) scale(1)' }, 150, 'ease-out')
 *   // 放大到 1.2 倍
 *   await setWeexAnimate(textElement, { opacity: 1, transform: 'translateY(0) scale(1.2)' }, 150, 'ease-in-out')
 *   // 缩小回原样
 *   await setWeexAnimate(textElement, { opacity: 1, transform: 'translateY(0) scale(1)' }, 150, 'ease-in-out')
 *   // 从顶部渐出
 *   await setWeexAnimate(textElement, { opacity: 0, transform: 'translateY(-100%) scale(1)' }, 150, 'ease-in')
 *   // 恢复初始化状态
 *   await setWeexAnimate(textElement, { opacity: 0, transform: 'translateY(100%) scale(1)' }, 0, 'ease-in')
 *   console.log('文字上浮动画完成')
 * }
 * ```
 */
export function useWeexAnimation() {
  /**
   * 执行 Weex 平台的动画过渡效果
   * @param {any} ref - 目标元素的引用对象
   * @param {TransitionStyles} styles - 动画过渡的样式配置
   * @param {number} duration - 动画持续时间，单位毫秒
   * @param {string} [timingFunction] - 动画时间函数，默认为 'ease'
   * @param {number} [delay] - 动画延迟时间，单位毫秒，默认为 0
   * @returns {Promise<void>} 返回一个 Promise，在动画完成时 resolve，失败时 reject
   * @throws {Error} 当 ref 参数为 undefined 时抛出错误
   */
  // oxlint-disable-next-line
  function setWeexAnimate(
    ref: any,
    styles: TransitionStyles,
    duration: number,
    timingFunction: string = 'ease',
    delay: number = 0,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // #ifndef APP
      reject(new Error('weex 不支持当前平台'))
      // #endif

      // #ifdef APP
      if (!ref) {
        reject(new Error('ref is undefined'))
        return
      }
      animation.transition(
        ref,
        {
          styles,
          duration,
          timingFunction,
          delay,
        } as AnimationOptions,
        () => {
          resolve()
        },
      )
      // #endif
    })
  }

  return {
    setWeexAnimate,
  }
}
