<script setup lang="ts">
import type { Article2 } from '@/service/apis/base/globals'
// @ts-expect-error vue2 在 vue3 中不可识别
import mpHtml from '@/uni_modules/mp-html/components/mp-html/mp-html.vue'

definePage({
  name: 'article-detail',
  layout: 'default',
  style: {
    navigationBarTitleText: '资讯详情',
  },
})

const toast = useGlobalToast()
const article = ref<Article2>()

const tagStyle = {
  h4: 'font-weight: bold; font-size: 16px; line-height: 16px; margin: 12px 0;',
  ul: 'margin: 8px 0; padding-left: 20px;',
  p: 'margin: 8px 0',
}

const { send } = useRequest(
  (id: string) => Webapi_Base.article.getArticle({ params: { id } }),
  { immediate: false },
)
  .onError((error) => {
    toast.error(error.error?.message)
  })

onLoad(async (e: any) => {
  if (e.id) {
    const { data } = await send(e.id)
    article.value = data
    if (!article.value)
      return
    uni.setNavigationBarTitle({
      title: `${article.value.title}`,
    })
  }
})
</script>

<template>
  <view class="p-15px">
    <mp-html v-if="article" :content="article.content" :tag-style="tagStyle" />
  </view>
</template>
