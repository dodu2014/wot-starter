/*
 * @Author: weisheng
 * @Date: 2025-11-25 19:57:54
 * @LastEditTime: 2026-04-13 18:44:19
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: /wot-starter/uno.config.ts
 * 记得注释
 */
import type { Preset } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'
import presetLegacyCompat from '@unocss/preset-legacy-compat'
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
    // 遗留兼容预设, https://unocss.dev/presets/legacy-compat
    // 解决 app 端，不支持的渐变模式
    presetLegacyCompat({
      // options
      legacyColorSpace: true, // 移除 'in oklch' 等关键词，强制使用 sRGB [7†L19-L22]
      commaStyleColorFunction: true, // 将空格分隔的 rgb() 转为逗号分隔，兼容性更好 [7†L13-L16]
    }) as Preset<object>,
  ],
  rules: [
    [
      /^text-overflow-(\d+)$/,
      ([_, d]) =>
        d === '1'
          ? { 'white-space': 'nowrap', 'overflow': 'hidden', 'text-overflow': 'ellipsis' }
          : {
              'display': '-webkit-box',
              '-webkit-line-clamp': d,
              'line-clamp': d,
              '-webkit-box-orient': 'vertical',
              'box-orient': 'vertical',
              'overflow': 'hidden',
              'text-overflow': 'ellipsis',
            },
    ],
    [
      /^text-primary-(\d+)$/,
      ([_, d]) => ({
        color: `var(--wot-primary-${d})`,
      }),
    ],
    [
      /^from-primary-(\d+)$/,
      ([_, d]) => ({
        '--un-gradient-from-position': '0%',
        '--un-gradient-from': `var(--wot-primary-${d}, #4d7fff) var(--un-gradient-from-position)`,
        '--un-gradient-to-position': '100%',
        '--un-gradient-to': 'rgba(255, 255, 255, 0) var(--un-gradient-to-position)',
        '--un-gradient-stops': 'var(--un-gradient-from), var(--un-gradient-to)',
      }),
    ],
    [
      /^to-primary-(\d+)$/,
      ([_, d]) => ({
        '--un-gradient-to': `var(--wot-primary-${d}, #4d7fff) var(--un-gradient-to-position)`,
      }),
    ],
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
