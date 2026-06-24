<script setup lang="ts">
import type { USE_LOCALES } from '@/hooks/useI18nSync'
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import { htmlElement, userAgreementContent } from './content'

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
    <mp-html :content="content" :tag-style="htmlElement" />
  </view>
</template>
