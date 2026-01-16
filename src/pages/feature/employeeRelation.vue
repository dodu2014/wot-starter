<script setup lang="ts">
definePage({
  name: 'feature-employeeRelation',
  layout: 'default',
  style: {
    navigationBarTitleText: '用工关系示例',
  },
  needLogin: true,
})

const { logined, userInfo } = useUserStore()
const wxUserStore = useWxUserStore()
const { wxUserInfo } = storeToRefs(wxUserStore)

const { send: sendBindRequest } = useRequest(
  (status: string, nickName?: string) => Webapi_Weixin.wxOpen.onCheckEmployeeRelation({ params: {
    openId: wxUserInfo.value?.openId,
    userId: userInfo?.id as string,
    status,
    nickName,
  } }),
  { immediate: false },
)

const { warning } = useGlobalToast()
const { bindStatus, bindEmployeeRelation, checkEmployeeRelation, requestSubscribeEmployeeMessage } = useEmployeeMessage({
  checkSuccessCallback: async (status) => {
    await sendBindRequest(status, userInfo?.name)
  },
  acceptMessage: '已成功授权用工关系',
  rejectMessage: '未授权用工关系',
})

function handleCheck() {
  if (!logined) {
    warning('请先登录')
    return
  }
  if (!wxUserInfo.value?.openId) {
    warning('请先登录')
    return
  }
  checkEmployeeRelation()
}

function handleBind() {
  if (!logined) {
    warning('请先登录')
    return
  }
  if (!wxUserInfo.value?.openId) {
    warning('请先登录')
    return
  }
  bindEmployeeRelation('工单状态变更提醒')
}

async function handleRequestSubscribe() {
  await requestSubscribeEmployeeMessage('工单状态变更提醒')
}

const { send: sendSubscribeEmployeeMessage } = useRequest(
  (openId: string) => Webapi_Demo.subscribeMessage.sendSubscribeEmployeeMessageTo({ params: { openId } }),
  { immediate: false },
)
async function testSendMessage() {
  if (!wxUserInfo.value?.openId) {
    warning('请先登录')
    return
  }
  await sendSubscribeEmployeeMessage(wxUserInfo.value.openId)
}

onLoad(async () => {
  // #ifdef MP-WEIXIN
  if (!wxUserInfo.value)
    await wxUserStore.wxLogin()
  // #endif

  if (logined && wxUserInfo.value?.openId)
    handleCheck()
})
</script>

<template>
  <view class="flex-1 flex-col justify-center gap-y-3 p-4">
    <wd-text custom-class="text-center" :text="wxUserInfo?.openId" :lines="1" />
    <view class="text-center">
      用工关系绑定状态：{{ bindStatus || '未知' }}
    </view>
    <wd-divider />
    <wd-button block @click="handleBind">
      请求用工关系绑定
    </wd-button>
    <wd-button block @click="handleCheck">
      检测用工关系状态
    </wd-button>
    <wd-button block @click="handleRequestSubscribe">
      单独订阅指定消息
    </wd-button>
    <wd-button block @click="testSendMessage">
      测试 `工单状态变更提醒` 模板消息
    </wd-button>
  </view>
</template>
