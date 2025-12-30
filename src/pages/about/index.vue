<script setup lang="ts">
definePage({
  name: 'about',
  style: {
    navigationBarTitleText: '关于',
  },
})

// 打开公众号二维码
function openWeChat() {
  uni.previewImage({
    urls: ['https://wot-ui.cn/wechatPublicAccount.png'],
  })
}
</script>

<template>
  <view class="min-h-screen flex-col gap-y-3 py-3">
    <!-- 头部介绍 -->
    <wd-card title="关于我们" custom-class="!mb-0" custom-content-class="pb-3">
      <text class="text-3.5">
        我是不如摸鱼去，一个前端打工仔，我和我的小伙伴们正在致力于开发轻量、高效的uni-app组件库和高效、易用的uni-app快速开发模板。
      </text>
    </wd-card>

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
          :value="getMiniProgramVersion()"
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
