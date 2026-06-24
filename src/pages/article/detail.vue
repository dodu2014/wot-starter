<script setup lang="ts">
import type { Article } from '@/service/apis/base/globals'
import { usePageTitle } from '@/hooks/usePageTitle'
import { htmlElement } from '../login/content'

definePage({
  name: 'article-detail',
  layout: 'default',
  style: {
    navigationBarTitleText: '资讯详情',
  },
})

usePageTitle('pages.article.detail.title')

const toast = useGlobalToast()
const article = ref<Article>()

const { send } = useRequest((id: string) => Webapi_Base.article.getArticle({ params: { id } }), {
  immediate: false,
}).onError(error => {
  toast.error(error.error?.message)
})

onLoad(async (e: any) => {
  if (e.id) {
    const { data } = await send(e.id)
    article.value = data!
    if (!article.value) return
    uni.setNavigationBarTitle({
      title: `${article.value.title}`,
    })
  }
})
</script>

<template>
  <view class="p-15px text-default">
    <mp-html v-if="article" :content="article.content" :tag-style="htmlElement" />
  </view>
</template>
