import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * 响应式页面标题 hook
 * 当 i18n 语言切换时，自动调用 uni.setNavigationBarTitle() 更新导航栏标题
 *
 * @param titleKey - i18n 翻译 key，如 'pages.about.title'
 * @param params - 可选，传递给 $t 的参数数组，如 [year]
 *
 * @example
 * // 基础用法
 * usePageTitle('pages.about.title')
 *
 * // 带参数用法
 * usePageTitle('pages.my.copyright', [new Date().getFullYear()])
 */
export function usePageTitle(titleKey: string, params?: any[]) {
  const { t, locale } = useI18n()

  // 设置标题的辅助函数
  const updateTitle = () => {
    const title = params ? t(titleKey, params) : t(titleKey)
    uni.setNavigationBarTitle({ title })
  }

  // 立即设置初始标题
  updateTitle()

  // 监听语言切换，更新标题
  watch(locale, () => {
    updateTitle()
  })
}
