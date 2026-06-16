import { defineConfig } from '@uni-helper/unh'
import { copyBuildApkToDist, copyDevApkToDist } from './scripts/copyBaseApk'

export default defineConfig({
  // 平台配置
  platform: {
    // 默认平台，当不指定平台时使用此平台
    default: 'h5',
    // 平台别名，可以使用短名称代替完整平台名称
    alias: {
      'h5': ['w', 'h'],
      'mp-weixin': ['wx'],
    },
  },
  // 准备阶段配置，可以自定义hooks
  hooks: {
    // 安装依赖时的钩子
    prepare() {
      console.log('prepare ...')
    },
    // 开发时的钩子，接收平台参数
    dev({ platform, options, envData }) {
      console.log('dev:', { platform, options, envData })
    },
    onDevAfter({ platform, options, envData }) {
      console.log('devAfter:', { platform, options, envData })
      if (platform === 'app') {
        copyDevApkToDist()
      }
    },
    // 构建时的钩子，接收平台参数
    build({ platform, options, envData }) {
      console.log('build:', { platform, options, envData })
    },
    // 构建后的hooks，接收平台参数
    onBuildAfter({ platform, options, envData }) {
      console.log('buildAfter:', { platform, options, envData })
      if (platform === 'app') {
        copyBuildApkToDist()
      }
    },
  },
  // 自动生成配置
  autoGenerate: {
    // 是否自动生成页面配置
    pages: true,
    manifest: true,
  },
  // 小程序开发者工具配置
  devtools: {
    // 是否自动打开小程序开发者工具
    open: true,
  },
})
