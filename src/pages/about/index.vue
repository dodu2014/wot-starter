<script setup lang="ts">
import { useTeam } from '@/composables/useTeam'
import { usePageTitle } from '@/hooks/usePageTitle'

definePage({
  name: 'about',
  style: {
    navigationBarTitleText: '关于',
  },
})

// 语言切换时自动更新页面标题
usePageTitle('pages.about.title')

const { data: coreTeam } = useTeam()

function openUrl(url?: string) {
  if (!url) {
    return
  }

  window.open(url, '_blank')
}

// 打开公众号二维码
function openWeChat() {
  uni.previewImage({
    urls: ['https://wot-ui.cn/wechatPublicAccount.png'],
  })
}
</script>

<template>
  <view class="min-h-screen py-3">
    <!-- 头部介绍 -->
    <view class="mx-3 mb-3 flex flex-col gap-2">
      <text class="text-6 font-bold wot-text-text-main">
        关于我们
      </text>
      <text class="text-3.5 leading-snug wot-text-text-secondary">
        我是不如摸鱼去，一个前端打工仔，我和我的小伙伴们正在致力于开发轻量、高效的uni-app组件库和高效、易用的uni-app快速开发模板。
      </text>
    </view>

    <!-- 核心团队 -->
    <demo-block title="核心团队" transparent>
      <view class="grid grid-cols-2 gap-3">
        <view
          v-for="member in coreTeam"
          :key="member.name"
          class="rounded-2 p-4 text-center wot-bg-filled-oppo"
          @click="openUrl(member.github)"
        >
          <image
            :src="member.avatar"
            class="mx-auto mb-2 h-16 w-16 border-2 border-blue-200 rounded-full dark:border-blue-800"
          />
          <view class="mb-1 text-3.5 font-bold wot-text-text-main">
            {{ member.name }}
          </view>
          <view class="mb-2 text-2.5 text-blue-600 dark:text-blue-400">
            {{ member.title }}
          </view>
          <view class="text-2.5 leading-snug wot-text-text-secondary">
            {{ member.desc }}
          </view>
        </view>
      </view>
    </demo-block>

    <!-- 关于 uni-helper -->
    <demo-block title="关于 uni-helper 团队" transparent>
      <view class="rounded-3 p-5 wot-bg-filled-oppo">
        <text class="mb-3 block text-3.5 leading-relaxed wot-text-text-secondary">
          <text class="text-blue-600" @click="openUrl('https://uni-helper.cn/')">
            uni-helper
          </text>
          是一个旨在增强 uni-app 系列产品的开发体验为爱发电的非官方组织。作为靠爱发电的非官方项目，uni-helper 提供了打包工具插件支持、编辑器扩展支持、NPM 包等并尽力维护它们。
        </text>
        <text class="text-3.5 leading-relaxed wot-text-text-secondary">
          在此我们特别向 uni-helper 团队表示感谢，他们为 uni-app 系列产品提供了强大的支持，包括打包工具插件支持、编辑器扩展支持等，这使我们得以站在巨人的巨人的肩膀上完成此项目。
        </text>
      </view>
    </demo-block>

    <!-- 更多信息 -->
    <demo-block title="更多信息">
      <wd-cell-group border custom-class="cell-justify-end">
        <wd-cell
          title="关注公众号"
          label="uni-app教程、组件库讯息一手掌握！"
          is-link
          custom-value-class="content-center"
          @click="openWeChat"
        />
        <!-- #ifdef MP-WEIXIN -->
        <wd-cell
          title="小程序版本"
          :value="getAppVersion()"
          is-link
          custom-value-class="content-center"
          @click="() => checkMiniProgramUpdate('已经是最新版')"
        />
        <wd-cell title="内部版本" :value="packVersion" />
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <wd-cell title="版本" :value="packVersion" />
        <!-- #endif -->
      </wd-cell-group>
    </demo-block>
  </view>
</template>

<style lang="scss" scoped>
:deep() .wd-cell__right {
  align-self: center;
  flex: none;
}
</style>
