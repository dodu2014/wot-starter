<script lang="ts" setup>
import { checkAccept } from './method'

defineOptions({ name: 'PhoneLogin' })

const emit = defineEmits<{
  loginSuccess: []
}>()

const agreed = defineModel('agreed', {
  required: true,
  default: false,
})

const { easyLogin } = useUserStore()
const { loading, close: hideLoading } = useGlobalLoading()
const toast = useGlobalToast()

const { send: sendCode2SessionRequest } = useRequest(
  (code: string) => Webapi_Weixin.wxOpen.onLogin({ params: { code } }),
  { immediate: false },
)

const { send: sendGetUserPhoneNumberFromCodeRequest } = useRequest(
  (code: string) => Webapi_Weixin.wxOpen.getUserPhoneNumberFromCode({ params: { code } }),
  { immediate: false },
)

async function handleLogin(e: { code: string, errMsg: string, encryptedData: string, iv: string }) {
  console.log('login-detail', e)
  const { code, errMsg } = e
  if (!errMsg.includes(':ok')) {
    toast.warning('用户已取消')
    return
  }
  if (!code) {
    toast.warning('获取用户手机号失败')
    return
  }

  agreed.value = await checkAccept(agreed.value)

  uni.login({
    // provider:'weixin',
    success: async (loginRes) => {
      console.log('loginRes', loginRes)
      if (loginRes.code) {
        const codeResult = await sendCode2SessionRequest(loginRes.code)
        const { openId, unionId, sessionId } = codeResult.data! as { openId: string, unionId: string, sessionId: string }
        console.log('code to session', sessionId)
        loading('loading')
        // code 换取 完整电话号码
        const phoneNumberRes = await sendGetUserPhoneNumberFromCodeRequest(code)
        // request
        const { isSuccess } = await easyLogin(phoneNumberRes.data!, '', openId, unionId)
        hideLoading()
        if (!isSuccess) {
          toast.error('登录失败')
          return
        }
        // 触发事件
        emit('loginSuccess')
      }
      else {
        toast.success({ msg: '登录失败' })
      }
    },
    fail: (err) => {
      toast.error(err.errMsg)
    },
  })
}
</script>

<template>
  <view class="flex-col gap-y-3rem items-center">
    <view class="flex-center gap-x-20px">
      <text class="i-carbon:application-mobile text-50px text-primary block" />
      <text class="i-carbon:direct-link text-24px text-default block" />
      <text class="i-carbon:bare-metal-server text-50px text-primary block" />
    </view>

    <!-- 登录按钮 -->
    <wd-button type="primary" icon="mobile" block custom-class="mx-4 w-full" open-type="getPhoneNumber" @getphonenumber="handleLogin">
      一键快捷登录
    </wd-button>
  </view>
</template>

<style lang="scss" scoped>
</style>
