<script setup lang="ts">
definePage({
  name: 'feature-employeeRelation',
  layout: 'default',
  style: {
    navigationBarTitleText: '用工关系',
  },
  needLogin: true,
})

const { logined, userInfo } = useUserStore()
const { warning, success } = useGlobalToast()
const { wxUserInfo } = useWxUserStore()

const { send: sendBindRequest } = useRequest(
  (status: string) => Webapi_Weixin.wxOpen.onCheckEmployeeRelation({ params: {
    openId: wxUserInfo?.openId,
    userId: userInfo?.id as string,
    status,
  } }),
  { immediate: false },
)

function handleCheck() {
  if (!logined) {
    warning('请先登录')
    return
  }
  if (!wxUserInfo?.openId) {
    warning('请先登录')
    return
  }
  console.log('checkEmployeeRelation')
  wx.checkEmployeeRelation({
    async success(res) {
      if (res.bindingStatus === 'accept')
        success('已授权用工关系')
      else
        warning('未授权用工关系')
      // request
      await sendBindRequest(res.bindingStatus)
    },
    complete(res) {
      console.log('checkEmployeeRelation complete', res)
    },
    fail(res) {
      warning(res.errMsg)
    },
  })
}

function handleRequest() {
  if (!logined) {
    warning('请先登录')
    return
  }
  if (!wxUserInfo?.openId) {
    warning('请先登录')
    return
  }
  wx.bindEmployeeRelation({
    tmplIds: ['VxBDiHXkwFxzuZcXZLcviZpWL2nui8J0sDg-CkX7KWJtlRGaN-psvDHvats8e48b'],
    success(res) {
      console.log('bindEmployeeRelation success', res)
      handleCheck()
    },
    complete(res) {
      console.log('bindEmployeeRelation complete', res)
    },
    fail(res) {
      warning(res.errMsg)
    },
  })
}

const { send: sendSubscribeEmployeeMessage } = useRequest(
  (openId: string) => Webapi_Demo.subscribeMessage.sendSubscribeEmployeeMessageTo({ params: { openId } }),
  { immediate: false },
)
async function testSendMessage() {
  if (!wxUserInfo?.openId) {
    warning('请先登录')
    return
  }
  await sendSubscribeEmployeeMessage(wxUserInfo.openId)
}

onLoad(() => {
  if (logined && wxUserInfo?.openId)
    handleCheck()
})
</script>

<template>
  <view class="flex-1 flex-col justify-center gap-y-3 p-4">
    <view class="text-center">
      {{ wxUserInfo?.openId }}
    </view>
    <wd-button block @click="handleRequest">
      请求绑定
    </wd-button>
    <wd-button block @click="handleCheck">
      检测用工关系
    </wd-button>
    <wd-button block @click="testSendMessage">
      测试 `工单状态变更提醒` 模板消息
    </wd-button>
  </view>
</template>
