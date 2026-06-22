<script setup lang="ts">
import type { USE_LOCALES } from '@/hooks/useI18nSync'
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/hooks/usePageTitle'
// @ts-expect-error vue2 在 vue3 中不可识别
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'
import { tagStyle, userAgreementContent } from './content'

definePage({
  name: 'user-agreement',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户协议',
  },
})

usePageTitle('pages.login.userAgreement.title')

const { locale } = useI18n()
const content = computed(() => userAgreementContent[locale.value as USE_LOCALES])
</script>

<template>
  <view class="p-15px text-default">
    <mp-html :content="content" :tag-style="tagStyle" />
  </view>
</template>
