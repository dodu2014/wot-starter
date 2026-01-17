<script setup lang="ts">
import type { Article } from '@/service/apis/base/globals'
import dayjs from 'wot-design-uni/dayjs'
import router from '@/router'

const toast = useGlobalToast()

const num = ref<string>()
const page = ref(1)
const totalPage = ref(0)
const modelList = ref<Article[]>([])

definePage({
  name: 'article-list',
  layout: 'default',
  style: {
    navigationBarTitleText: '资讯列表',
    enablePullDownRefresh: true,
  },
})

const { send: sendGetDetailRequest } = useRequest(
  (num: string) => Webapi_Base.articleCategory.getArticleCategory({ params: { num } }),
  { immediate: false },
)
  .onError((error) => {
    toast.error(error.error?.message)
  })

type Mode = 'push' | 'replace'
const { loading, send: sendGetListRequest } = useRequest(
  (num?: string, page: number = 1) => Webapi_Base.article.getArticleList({ params: { categoryNum: num, page, pageSize: 20 } }),
  { immediate: false },
)
  .onError((error) => {
    toast.error(error.error?.message)
  })
async function loadList(num?: string, _page = 1, mode: Mode = 'push') {
  const { data } = await sendGetListRequest(num, _page)
  totalPage.value = +(data?.totalPageCount || 0)
  if (mode === 'push')
    modelList.value.push(...(data?.list || []))
  else modelList.value = data?.list || []
  if (page.value < totalPage.value)
    page.value = _page
}

onLoad(async (e: any) => {
  num.value = e?.num
  await loadList(num.value, page.value)

  if (num.value) {
    const { data } = await sendGetDetailRequest(num.value)
    if (!data)
      return
    uni.setNavigationBarTitle({
      title: `${data.name}`,
    })
  }
})

onPullDownRefresh(async () => {
  modelList.value = []
  page.value = 1
  totalPage.value = 0

  await loadList(num.value, page.value, 'replace')
  uni.stopPullDownRefresh()
})

onReachBottom(async () => {
  if (page.value < totalPage.value)
    await loadList(num.value, page.value + 1)
})
</script>

<template>
  <view class="flex-col">
    <!-- 骨架屏 -->
    <view v-if="loading && !modelList.length" class="px-4">
      <view v-for="item in 3" :key="item" style="display: flex; margin-top: 20px">
        <wd-skeleton animation="gradient" :row-col="[{ size: '48px', type: 'rect' }]" />
        <wd-skeleton animation="gradient" :custom-style="{ width: '100%', marginLeft: '12px' }" :row-col="[{ width: '50%' }, { width: '100%' }]" />
      </view>
    </view>

    <!-- 缺省内容 -->
    <view v-if="loading === false && !modelList.length" class="h-65vh flex-center flex-col">
      <app-empty image="content" tip="暂无内容" />
    </view>

    <!-- 列表 -->
    <wd-cell-group border>
      <wd-cell
        v-for="(item, index) in modelList" :key="index"
        :title="`${item.title}`"
        :label="`日期：${dayjs(item.creationDate).format('YYYY-MM-DD HH:mm')}`"
        is-link center
        @click="() => router.push({ path: '/pages/article/detail', query: { id: item.id as string } })"
      />
    </wd-cell-group>

    <!-- 加载更多 -->
    <wd-loadmore v-if="totalPage >= page" :state="loading ? 'loading' : 'finished'" custom-class="!line-height-6 !h-auto" />
  </view>
</template>
