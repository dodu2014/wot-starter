<script setup lang="ts">
import type { UserMessage } from '@/service/apis/base/globals'
import dayjs from 'wot-design-uni/dayjs'
import router from '@/router'

const { userInfo } = useUserStore()
const toast = useGlobalToast()

const page = ref(1)
const totalPage = ref(0)
const modelList = ref<UserMessage[]>([])

definePage({
  name: 'user-message',
  layout: 'default',
  style: {
    navigationBarTitleText: '消息中心',
    enablePullDownRefresh: true,
  },
  needLogin: true,
})

type Mode = 'push' | 'replace'
const { loading, send: sendGetListRequest } = useRequest(
  (page: number = 1) => Webapi_Base.userMessage.getUserMessageList({ params: {
    toId: userInfo?.id,
    page,
    pageSize: 20,
  } }),
  { immediate: false },
)
  .onError((error) => {
    toast.error(error.error?.message)
  })
async function loadList(_page = 1, mode: Mode = 'push') {
  const { data } = await sendGetListRequest(_page)
  totalPage.value = +(data?.totalPageCount || 0)
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

onLoad(async () => {
  await loadList(page.value)
})

const showDetail = ref(false)
const messageModel = ref<UserMessage>()
const { send: sendGetMessageRequest } = useRequest(
  (id: string) => Webapi_Base.userMessage.getUserMessage({ params: { id } }),
  { immediate: false },
).onSuccess(({ data }) => {
  showDetail.value = true
  messageModel.value = data?.data || {}
  const model = modelList.value.find(i => i.id === data?.data?.id)
  if (model)
    model.isReaded = true
})

const { requestSubscribeMessage, isSuccessedSubscribeResult } = useSubscribeMessage()
async function handleToPage(pagePath: string) {
  // #ifdef MP-WEIXIN
  await requestSubscribeMessage('业务受理通知')
  const subscribeSuccessed = isSuccessedSubscribeResult()
  if (!subscribeSuccessed)
    return
  // #endif
  const path = (pagePath.startsWith('/') ? pagePath : `/${pagePath}`) as _LocationUrl
  router.push(path)
}
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
    <view v-if="loading === false && !modelList.length" class="flex-center flex-col h-65vh">
      <app-empty image="content" tip="暂无内容" />
    </view>

    <!-- 列表 -->
    <wd-cell-group v-if="modelList.length" border custom-class="cell-justify-end">
      <wd-cell
        v-for="(item, index) in modelList" :key="index"
        :label="`${dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}`"
        center
        is-link
        @click="() => sendGetMessageRequest(item.id!)"
      >
        <template #icon>
          <view class="content-center flex items-center pr-3">
            <wd-icon name="mail" :size="24" :custom-class="item.isReaded ? 'text-gray' : 'text-primary'" />
          </view>
        </template>
        <template #title>
          <view>
            <wd-text :text="item.content" :lines="1" :bold="!item.isReaded" custom-class="!text-default" />
          </view>
        </template>
      </wd-cell>
    </wd-cell-group>

    <!-- 加载更多 -->
    <wd-loadmore v-if="totalPage >= page" :state="loading ? 'loading' : 'finished'" custom-class="!line-height-6 !h-auto" />

    <!-- 消息详情弹层 -->
    <wd-popup
      v-model="showDetail"
      :z-index="10000"
      position="bottom" closable safe-area-inset-bottom lock-scroll
      @close="() => showDetail = false"
    >
      <view v-if="messageModel" class="px-4 pb-6 pt-8 flex-col gap-y-3 min-h-180px">
        <view class="flex-1">
          <wd-text :text="messageModel?.content" custom-class="!text-default" />
        </view>
        <view class="flex items-center justify-between">
          <wd-text :text="dayjs(messageModel?.createdAt).format('YYYY-MM-DD HH:mm')" />
          <view>
            <!-- #ifdef MP-WEIXIN -->
            <wd-button v-if="messageModel?.pagePath" @click="() => handleToPage(messageModel!.pagePath!)">
              转到详情
            </wd-button>
            <!-- #endif -->
          </view>
        </view>
      </view>
    </wd-popup>

    <!-- 留言 -->
    <wd-fab v-if="false" :expandable="false">
      <template #trigger>
        <wd-button icon="chat" type="error" @click="() => router.push('/pages/user/message')">
          给平台留言
        </wd-button>
      </template>
    </wd-fab>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-cell__right) {
  flex: none !important;
}
</style>
