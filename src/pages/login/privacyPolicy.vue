<script setup lang="ts">
import type { USE_LOCALES } from '@/hooks/useI18nSync'
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/hooks/usePageTitle'
// @ts-expect-error vue2 在 vue3 中不可识别
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'
import { tagStyle, userAgreementContent } from './content'

definePage({
  name: 'privacy-policy',
  layout: 'default',
  style: {
    navigationBarTitleText: '隐私政策',
  },
})

usePageTitle('pages.login.privacyPolicy.title')

const { locale } = useI18n()
const content = computed(() => userAgreementContent[locale.value as USE_LOCALES])
</script>

<template>
  <view class="p-15px text-default">
    <mp-html :content="content" :tag-style="tagStyle" />
  </view>
</template>
