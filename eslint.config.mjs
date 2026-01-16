import uniHelper from '@uni-helper/eslint-config'

// 配置参考 https://github.com/antfu/eslint-config?tab=readme-ov-file#customization (工厂函数还接受任意数量的自定义配置覆盖：antfu)
export default uniHelper(
  {
    // unocss: true,
    rules: {
      'no-console': 'off',
      'no-ignore': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
    },
    ignores: [
      'src/uni_modules/**/*',
      'docs/.vitepress/dist',
      'docs/.vitepress/cache',
      '**/*.md',
      // 忽略自动生成的 api
      './src/service/**',
      // 忽略微信原生组件
      './src/wxcomponents/**',
    ],
  },
)
