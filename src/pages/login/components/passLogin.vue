<script lang="ts" setup>
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import { zodAdapter } from '@wot-ui/ui'
import { z } from 'zod'
import router from '@/router'
import { checkAccept } from './method'

defineOptions({ name: 'PassLogin' })

const emit = defineEmits<{
  loginSuccess: []
}>()

const agreed = defineModel('agreed', {
  required: true,
  default: false,
})

const toast = useGlobalToast()
const { login } = useUserStore()
const { loading } = useGlobalLoading()
const wxUserStore = useWxUserStore()
const { wxUserInfo } = storeToRefs(wxUserStore)

const model = ref({
  userName: uni.getStorageSync('loginInfo')?.username || '',
  password: '',
  remember: true,
})
const loginFormRef = ref<FormExpose>()

async function handleLogin() {
  const res = await loginFormRef.value?.validate()
  if (!res?.valid) {
    return
  }

  agreed.value = await checkAccept(agreed.value)

  loading('登录中..')
  // #ifdef MP-WEIXIN
  await wxUserStore.wxLogin()
  // #endif

  await login(model.value, wxUserInfo.value?.openId)

  // 保存登录信息
  if (model.value.remember) {
    uni.setStorageSync('loginInfo', {
      username: model.value.userName,
      password: model.value.password,
    })
  }
  else {
    uni.removeStorageSync('loginInfo')
  }

  // 这里添加实际登录逻辑
  toast.success({
    msg: '登录成功',
    duration: 300,
    closed() {
      // 触发成功登录时间
      emit('loginSuccess')
    },
  })
}
</script>

<template>
  <view class="flex-col gap-y-5">
    <wd-card custom-class="!rounded-lg !shadow-sm !shadow-gray !shadow-op-10 !m-0 !bg-#ffffff98 !dark:bg-#1a1a1a98" custom-content-class="flex-col gap-15px !py-5">
      <wd-text text="欢迎登录" custom-class="text-center font-bold !text-default" size="20px" />
      <wd-form
        ref="loginFormRef" :model="model" :schema="zodAdapter(
          z.object({
            userName: z.string().min(1, 'required'),
            password: z.string().min(1, 'required'),
          }),
        )" error-type="message"
      >
        <wd-form-item
          prop="userName"
          title="登录账号"
          title-width="80px" custom-class="!bg-transparent"
        >
          <!-- 用户名输入 -->
          <wd-input
            v-model="model.userName"
            placeholder="输入你的登录账户"
            :rules="[{ required: true, message: 'required' }]"
          />
        </wd-form-item>

        <!-- 密码输入 -->
        <wd-form-item
          prop="password"
          title="登录密码"
          title-width="80px" custom-class="!bg-transparent"
        >
          <wd-input
            v-model="model.password"
            placeholder="输入你的密码"
            show-password
            :rules="[{ required: true, message: 'required' }]"
          />
        </wd-form-item>
      </wd-form>
    </wd-card>

    <!-- 登录按钮 -->
    <wd-button type="primary" icon="login" custom-class="mx-4" @click="handleLogin">
      立即登录
    </wd-button>

    <view class="flex-center gap-2">
      <wd-checkbox v-model="model.remember" shape="square">
        记住账号
      </wd-checkbox>
      <wd-text type="primary" text="注册新账号" @click="() => router.push('/pages/login/register')" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
</style>
