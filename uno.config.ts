/*
 * @Author: weisheng
 * @Date: 2025-11-25 19:57:54
 * @LastEditTime: 2026-04-13 18:44:19
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: /wot-starter/uno.config.ts
 * 记得注释
 */
import { presetUni } from '@uni-helper/unocss-preset-uni'
import { presetWot } from '@wot-ui/unocss-preset'

import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  blocklist: [/^i-(?![a-z0-9]+:[a-z0-9-]+$).+/],
  content: {
    filesystem: ['src/**/*.{vue,html}'],
  },
  presets: [
    presetUni({
      attributify: false,
    }),
    presetWot({
      preflight: false,
    }),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      // HBuilderX 下显式注册已使用的图标集，避免 Android 构建/运行时图标加载报错。
      collections: {
        // carbon: () => import('@iconify/json/json/carbon.json').then(i => i.default),
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-row': 'flex flex-row',
      'flex-col': 'flex flex-col',
      'text-default': 'text-[var(--wot-text-main)]',
      'bg-default': 'bg-[var(--wot-filled-oppo)]',
      'bg-second': 'bg-[var(--wot-filled-bottom)]',
      'bg-third': 'bg-[var(--wot-filled-content)]',
    },
  ],
  theme: {
    colors: {
      /** 主题色，用法如: text-primary */
      primary: 'var(--wot-primary-6, #4D7FFF)',
      warning: 'var(--wot-warning-6, #F57F00)',
      success: 'var(--wot-success-6, #12B886)',
      danger: 'var(--wot-danger-6, #F14646)',
    },
    fontSize: {
      /** 提供更小号的字体，用法如：text-2xs */
      '2xs': ['20rpx', '28rpx'],
      '3xs': ['18rpx', '26rpx'],
    },
  },
})
