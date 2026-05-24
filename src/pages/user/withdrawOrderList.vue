<script setup lang="ts">
import type { UserWalletWithdrawOrder } from '@/service/apis/base/globals'
import dayjs from 'dayjs'
import router from '@/router'

const toast = useGlobalToast()

const { userInfo } = useUserStore()

const page = ref(1)
const totalPage = ref(0)
const modelList = ref<UserWalletWithdrawOrder[]>([])

definePage({
  name: 'user-wallet-withdraw-order-list',
  layout: 'default',
  style: {
    navigationBarTitleText: '提现记录',
    enablePullDownRefresh: true,
  },
  needLogin: true,
})

type Mode = 'push' | 'replace'
const { loading, send: sendGetListRequest } = useRequest(
  (userId?: string, page?: number) => Webapi_Base.userWalletWithdrawOrder.getUserWalletWithdrawOrderList({ params: { userId, page, status: 4 } }),
  { immediate: false },
)
  .onError((error) => {
    toast.error(error.error?.message)
  })
async function loadList(_page = 1, mode: Mode = 'push') {
  const { data } = await sendGetListRequest(userInfo?.id, _page)
  totalPage.value = data?.totalPageCount as number || 0
  if (mode === 'push')
    modelList.value.push(...(data?.list || []))
  else modelList.value = data?.list || []
  if (page.value < totalPage.value)
    page.value = _page
}

onPullDownRefresh(async () => {
  modelList.value = []
  page.value = 1
  totalPage.value = 0

  await loadList(page.value, 'replace')
  uni.stopPullDownRefresh()
})

onReachBottom(async () => {
  if (page.value < totalPage.value)
    await loadList(page.value + 1)
})

// eslint-disable-next-line unused-imports/no-unused-vars
onLoad(async (e: any) => {
  await loadList(page.value)
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
        title="用户提现到微信零钱"
        :label="`日期：${dayjs(item.completedTime).format('YYYY-MM-DD HH:mm')}`"
        is-link center
        @click="() => router.push({ path: '/pages/article/detail', query: { id: item.id as string } })"
      >
        <wd-text type="primary" :text="item.amout" prefix="¥" />
      </wd-cell>
    </wd-cell-group>

    <!-- 加载更多 -->
    <wd-loadmore v-if="totalPage >= page" :state="loading ? 'loading' : 'finished'" custom-class="!line-height-6 !h-auto" />
  </view>
</template>
