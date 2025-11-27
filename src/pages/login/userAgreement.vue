<script setup lang="ts">
// @ts-expect-error vue2 在 vue3 中不可识别
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'
import { userAgreementContent } from './content'

definePage({
  name: 'user-agreement',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户协议',
  },
})

const tagStyle = {
  h4: 'font-weight: bold; font-size: 16px; line-height: 16px; margin: 12px 0;',
  ul: 'margin: 8px 0; padding-left: 20px;',
  p: 'margin: 8px 0',
}
</script>

<template>
  <view class="p-15px text-default">
    <mp-html :content="userAgreementContent" :tag-style="tagStyle" />
  </view>
</template>
