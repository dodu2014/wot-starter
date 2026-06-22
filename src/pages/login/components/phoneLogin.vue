<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { checkAccept } from './method'

defineOptions({ name: 'PhoneLogin' })

const emit = defineEmits<{
  loginSuccess: []
}>()

const { t } = useI18n()

const agreed = defineModel('agreed', {
  required: true,
  default: false,
})

const { easyLogin } = useUserStore()
const { loading, close: hideLoading } = useGlobalLoading()
const toast = useGlobalToast()
const wxUserStore = useWxUserStore()
const { wxUserInfo } = storeToRefs(wxUserStore)

const { send: sendGetUserPhoneNumberFromCodeRequest } = useRequest(
  (code: string) => Webapi_Weixin.wxOpen.getUserPhoneNumberFromCode({ params: { code } }),
  { immediate: false },
)

async function handleLogin(e: { code: string, errMsg: string, encryptedData: string, iv: string }) {
  console.log('login-detail', e)
  const { code, errMsg } = e
  if (!errMsg.includes(':ok')) {
    toast.warning(t('pages.login.phoneLogin.userCancelled'))
    return
  }
  if (!code) {
    toast.warning(t('pages.login.phoneLogin.getPhoneFailed'))
    return
  }

  agreed.value = await checkAccept(agreed.value, t)

  loading('loading')
  if (!wxUserInfo.value)
    await wxUserStore.wxLogin()
  // code 换取 完整电话号码
  const phoneNumberRes = await sendGetUserPhoneNumberFromCodeRequest(code)
  // request
  const { isSuccess } = await easyLogin(phoneNumberRes.data!, '', wxUserInfo.value?.openId, wxUserInfo.value?.unionId)
  hideLoading()
  if (!isSuccess) {
    toast.error(t('pages.login.phoneLogin.loginFailed'))
    return
  }
  // 触发事件
  emit('loginSuccess')
}
</script>

<template>
  <view class="flex-col items-center gap-y-3rem">
    <view class="flex-center gap-x-20px">
      <text class="i-carbon:application-mobile block text-50px text-primary" />
      <text class="i-carbon:direct-link block text-24px text-default" />
      <text class="i-carbon:bare-metal-server block text-50px text-primary" />
    </view>

    <!-- 登录按钮 -->
    <wd-button type="primary" icon="mobile" block custom-class="mx-4 w-full" open-type="getPhoneNumber" @getphonenumber="handleLogin">
      {{ $t('pages.login.phoneLogin.quickLoginBtn') }}
    </wd-button>
  </view>
</template>

<style lang="scss" scoped>
</style>
