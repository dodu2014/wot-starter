<script lang="ts" setup>
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import type { RegisterByEmailModel } from '@/service/apis/base/globals'
import { zodAdapter } from '@wot-ui/ui'
import { z } from 'zod'
import router from '@/router'

definePage({
  name: 'register',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户注册',
  },
})

const toast = useGlobalToast()
const { loading } = useGlobalLoading()
const { alert } = useGlobalDialog()
const userStore = useUserStore()

const agreed = ref(true)
const registerFormRef = ref<FormExpose>()

const model = ref<RegisterByEmailModel>({
  userName: '',
  email: '',
  validateCode: '',
  password: '',
  confirmPassword: '',
})

const sendCodeLoading = ref(false)
const sendCodeText = ref('验证码')
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 通过 zodAdapter 转换 zod 的模式对象
const schema = zodAdapter(
  z.object({
    userName: z.string().min(6, '最少6位数字'),
    email: z.email('格式无效'),
    validateCode: z.string().min(1, '必填'),
    password: z.string().min(6, '至少6位数字'),
    confirmPassword: z.string().min(6, '至少6位数字'),
  })
    .refine(data => data.password === data.confirmPassword, { message: '两次密码不匹配', path: ['confirmPassword'] }),
)

async function handleSendCode() {
  if (countdown.value > 0)
    return

  if (!model.value.email) {
    toast.error('请输入你的邮箱')
    return
  }

  const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i
  if (!emailRegex.test(model.value.email)) {
    toast.error('请输入有效的电子邮件地址')
    return
  }

  sendCodeLoading.value = true
  try {
    const { send: sendEmailCode } = useRequest(
      (email: string) => Webapi_Base.auth.sendEmail({ params: { email } }),
      { immediate: false },
    ).onError((err) => {
      toast.error(err.error.message)
    })
    await sendEmailCode(model.value.email)
    toast.success('验证码已发送')
    countdown.value = 60
    sendCodeText.value = '60s'
    countdownTimer = setInterval(() => {
      countdown.value--
      sendCodeText.value = `${countdown.value}s`
      if (countdown.value <= 0) {
        sendCodeText.value = '验证码'
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }
    }, 1000)
  }
  catch {
    // toast.error('Failed to send verification code')
  }
  finally {
    sendCodeLoading.value = false
  }
}

async function handleRegister() {
  const res = await registerFormRef.value?.validate()
  if (!res?.valid) {
    return
  }

  if (!agreed.value) {
    toast.warning('请接受用户协议')
    return
  }

  loading('注册...')

  const { isSuccess, error } = await userStore.register({
    userName: model.value.userName,
    password: model.value.password,
    confirmPassword: model.value.confirmPassword,
    email: model.value.email,
    validateCode: model.value.validateCode,
  }, '业务')

  if (isSuccess) {
    alert({
      title: '注册成功',
      msg: '点击确定返回登录',
      confirmButtonText: 'OK',
      showCancelButton: false,
      closeOnClickModal: false,
      success: () => {
        router.back()
      },
    })
  }
  else {
    toast.error(error?.error?.message || '注册失败')
  }
}

function handleBack() {
  router.back()
}

function toProtocol(type: 'userAgreement' | 'privacyPolicy') {
  if (type === 'userAgreement') {
    router.push({ path: '/pages/login/userAgreement' })
  }
  else if (type === 'privacyPolicy') {
    router.push({ path: '/pages/login/privacyPolicy' })
  }
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<template>
  <view class="page">
    <image class="bg-animation" src="/static/images/login-bg.svg" mode="aspectFill" />

    <wd-navbar
      title="用户注册"
      :bordered="false"
      placeholder safe-area-inset-top left-arrow fixed
      custom-class="!bg-transparent"
      @click-left="handleBack"
    />

    <view class="z-1 my-auto flex-col gap-5 px-6">
      <wd-card
        custom-class="!rounded-lg !m-0 !bg-#ffffff55 !dark:bg-#00000044 backdrop-blur-10px"
        custom-content-class="flex flex-col gap-15px !py-6"
      >
        <wd-text text="注册新账号" custom-class="text-center font-bold !text-default" size="20px" />

        <wd-form ref="registerFormRef" :model="model" :schema="schema" error-type="message">
          <wd-form-item title="登录账号" title-width="80px" prop="userName" custom-class="!bg-transparent">
            <!-- 用户名 -->
            <wd-input
              v-model="model.userName"
              placeholder="用户名"
            />
          </wd-form-item>

          <!-- 邮箱 -->
          <wd-form-item title="邮箱" title-width="80px" prop="email" custom-class="!bg-transparent">
            <wd-input
              v-model="model.email"
              placeholder="电子邮箱"
            />
          </wd-form-item>

          <!-- 验证码 -->
          <wd-form-item title="验证码" title-width="80px" prop="validateCode" custom-class="!bg-transparent">
            <wd-input
              v-model="model.validateCode"
              placeholder="邮箱验证码"
              custom-class="flex-1"
            >
              <template #suffix>
                <wd-button
                  custom-class="ml-2"
                  :loading="sendCodeLoading"
                  :disabled="countdown > 0"
                  size="mini"
                  round
                  @click="handleSendCode"
                >
                  {{ sendCodeText }}
                </wd-button>
              </template>
            </wd-input>
          </wd-form-item>

          <!-- 密码 -->
          <wd-form-item title="密码" title-width="80px" prop="password" custom-class="!bg-transparent">
            <wd-input
              v-model="model.password"
              placeholder="密码"
              show-password
            />
          </wd-form-item>

          <!-- 确认密码 -->
          <wd-form-item title="确认密码" title-width="80px" prop="confirmPassword" custom-class="!bg-transparent">
            <wd-input
              v-model="model.confirmPassword"
              placeholder="确认密码"
              show-password
            />
          </wd-form-item>
        </wd-form>
      </wd-card>

      <!-- 协议勾选 -->
      <view class="flex-center gap-1">
        <wd-checkbox v-model="agreed" type="square" custom-label-class="!text-12px">
          阅读并同意
        </wd-checkbox>
        <wd-text type="primary" text="用户服务协议" size="12px" @click="toProtocol('userAgreement')" />
        <wd-text text="&" size="12px" />
        <wd-text type="primary" text="隐私政策" size="12px" @click="toProtocol('privacyPolicy')" />
      </view>

      <!-- 注册按钮 -->
      <wd-button
        type="primary"
        round
        icon="login"
        custom-class="mx-4"
        :disabled="!agreed"
        @click="handleRegister"
      >
        <text class="i-carbon:checkmark" />
        提交注册
      </wd-button>

      <!-- 已有账号 -->
      <view class="flex-center flex-row">
        <wd-text text="已经有账户?" size="12px" custom-class="!text-default" />
        <wd-text text="返回登录" size="12px" custom-class="!text-primary ml-1" @click="handleBack" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
}

.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.45;
}

:deep() {
  .wd-input.is-cell,
  .wd-input__icon,
  .wd-cell-group__body {
    background-color: transparent !important;
  }
}
</style>
