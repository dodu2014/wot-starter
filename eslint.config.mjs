import uniHelper from '@uni-helper/eslint-config'

// 配置参考 https://github.com/antfu/eslint-config?tab=readme-ov-file#customization (工厂函数还接受任意数量的自定义配置覆盖：antfu)
export default uniHelper(
  {
    ignores: [
      '.github/**',
      './node_modules/**',
      './dist/**',
      // 忽略 uni_modules 目录
      './src/uni_modules/**',
      // unplugin-auto-import 生成的类型文件，每次提交都改变，所以加入这里吧，与 .gitignore 配合使用
      './src/auto-import.d.ts',
      // vite-plugin-uni-pages 生成的类型文件，每次切换分支都一堆不同的，所以直接 .gitignore
      './src/uni-pages.d.ts',
      // 插件生成的文件
      './src/pages.json',
      './src/manifest.json',
      // 忽略自动生成文件
      './src/service/**',
    ],
  },
  {
    // unocss: true,
    rules: {
      'no-console': 'off',
      'no-ignore': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
    },
    ignores: [
      'src/uni_modules/**/*',
    ],
  },
)
