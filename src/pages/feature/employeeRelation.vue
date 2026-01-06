<script setup lang="ts">
definePage({
  name: 'feature-employeeRelation',
  layout: 'default',
  style: {
    navigationBarTitleText: '用工关系',
  },
})

const { logined, userInfo } = useUserStore()
const { warning } = useGlobalToast()

const { send: sendCode2SessionRequest } = useRequest(
  (code: string) => Webapi_Weixin.wxOpen.onLogin({ params: { code } }),
  { immediate: false },
)

const openId = ref('')
function wxLogin() {
  uni.login({
    // provider:'weixin',
    success: async (loginRes) => {
      console.log('loginRes', loginRes)
      if (loginRes.code) {
        const { data } = await sendCode2SessionRequest(loginRes.code)
        openId.value = (data as any)?.openId
      }
    },
  })
}

const { send: sendBindRequest } = useRequest(
  (status: string) => Webapi_Weixin.wxOpen.onCheckEmployeeRelation({ params: {
    openId: openId.value,
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
  if (!openId.value) {
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
  if (!openId.value) {
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
  if (logined && openId.value)
    handleCheck()
})
</script>

<template>
  <view class="flex-col gap-y-3 p-4">
    <wd-button block @click="wxLogin">
      wx login {{ openId }}
    </wd-button>
    <wd-button block @click="handleRequest">
      请求绑定
    </wd-button>
    <wd-button block @click="handleCheck">
      检测用工关系
    </wd-button>
  </view>
</template>
