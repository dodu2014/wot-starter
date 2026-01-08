<script setup lang="ts">
definePage({
  name: 'feature-subscribe-message',
  layout: 'default',
  style: {
    navigationBarTitleText: '一次性订阅消息',
  },
})

const { error } = useGlobalToast()
const { wxUserInfo } = useWxUserStore()
const { requestSubscribeMessage } = useSubscribeMessage()

const { send } = useRequest(
  (openId: string) => Webapi_Demo.subscribeMessage.sendSubscribeMessageTo({ params: { openId } }),
  { immediate: false },
)
async function testSendMessage() {
  if (!wxUserInfo?.openId) {
    error('请先登录')
    return
  }
  await send(wxUserInfo.openId)
}
</script>

<template>
  <view class="flex-1 flex-col justify-center gap-y-3 p-4">
    <view class="text-center">
      {{ wxUserInfo?.openId }}
    </view>

    <wd-button block @click="() => requestSubscribeMessage('业务受理通知')">
      订阅
    </wd-button>
    <wd-button block @click="testSendMessage">
      测试 `业务受理通知` 模板消息
    </wd-button>
  </view>
</template>
