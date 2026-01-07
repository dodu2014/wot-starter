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
const { warning } = useGlobalToast()
const { wxUserInfo, wxLogin } = useWxUserStore()

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
      console.log('checkEmployeeRelation success', res)
      // request
      await sendBindRequest(res.bindingStatus)
    },
    complete(res) {
      console.log('checkEmployeeRelation complete', res)
    },
    fail(res) {
      console.log('checkEmployeeRelation fail', res)
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
  console.log('bindEmployeeRelation')
  wx.bindEmployeeRelation({
    tmplIds: [],
    success(res) {
      console.log('bindEmployeeRelation success', res)
      handleCheck()
    },
    complete(res) {
      console.log('bindEmployeeRelation complete', res)
    },
    fail(res) {
      console.log('bindEmployeeRelation fail', res)
    },
  })
}

onLoad(() => {
  if (logined && wxUserInfo?.openId)
    handleCheck()
})
</script>

<template>
  <view class="flex-col gap-y-3 p-4">
    <wd-button block @click="wxLogin">
      wx login {{ wxUserInfo?.openId }}
    </wd-button>
    <wd-button block @click="handleRequest">
      请求绑定
    </wd-button>
    <wd-button block @click="handleCheck">
      检测用工关系
    </wd-button>
  </view>
</template>
