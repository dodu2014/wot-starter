<script lang="ts" setup>
import type { FormExpose } from 'wot-design-uni/components/wd-form/types'
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
  await login(model.value)

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
    <wd-card custom-class="!rounded-lg !shadow-sm !shadow-gray !shadow-op-10 !m-0 !bg-#ffffff98 !dark:bg-#1a1a1a98" custom-content-class="flex flex-col gap-15px py-6">
      <wd-text text="欢迎登录" custom-class="text-center font-bold !text-black !dark:text-[var(--wot-dark-color)]" size="20px" />
      <wd-form ref="loginFormRef" :model="model" error-type="message">
        <wd-cell-group custom-class="!bg-transparent">
          <!-- 用户名输入 -->
          <wd-input
            v-model="model.userName"
            prop="userName"
            label="账号"
            label-width="60px"
            placeholder="请输入登录账号"
            size="large"
            :rules="[{ required: true, message: '必填' }]"
          />

          <!-- 密码输入 -->
          <wd-input
            v-model="model.password"
            prop="password"
            label="密码"
            label-width="60px"
            placeholder="请输入密码"
            show-password
            size="large"
            :rules="[{ required: true, message: '必填' }]"
          />
        </wd-cell-group>
      </wd-form>
    </wd-card>

    <view class="flex justify-center">
      <wd-checkbox v-model="model.remember" shape="square">
        记住密码
      </wd-checkbox>
    </view>

    <!-- 登录按钮 -->
    <wd-button type="primary" custom-class="mx-4" @click="handleLogin">
      立即登录
    </wd-button>
  </view>
</template>

<style lang="scss" scoped>
</style>
