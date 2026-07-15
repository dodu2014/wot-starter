<script lang="ts" setup>
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import type { RegisterByEmailModel } from '@/service/apis/base/globals'
import { zodAdapter } from '@wot-ui/ui'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import { usePageTitle } from '@/hooks/usePageTitle'
import router from '@/router'

const { t } = useI18n()

definePage({
  name: 'register',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户注册',
  },
})

usePageTitle('pages.login.register.title')

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
const sendCodeText = ref(t('pages.login.register.sendCode'))
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 通过 zodAdapter 转换 zod 的模式对象
const schema = zodAdapter(
  z.object({
    userName: z.string().min(6, t('pages.login.register.usernameMinLength')),
    email: z.email(t('pages.login.register.invalidFormat')),
    validateCode: z.string().min(1, t('pages.login.register.required')),
    password: z.string().min(6, t('pages.login.register.passwordMinLength')),
    confirmPassword: z.string().min(6, t('pages.login.register.passwordMinLength')),
  })
    .refine(data => data.password === data.confirmPassword, { message: t('pages.login.register.repasswordMismatch'), path: ['confirmPassword'] }),
)

async function handleSendCode() {
  if (countdown.value > 0)
    return

  if (!model.value.email) {
    toast.error(t('pages.login.register.pleaseEnterEmail'))
    return
  }

  const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i
  if (!emailRegex.test(model.value.email)) {
    toast.error(t('pages.login.register.pleaseEnterValidEmail'))
    return
  }

  sendCodeLoading.value = true
  try {
    const { send: sendEmailCode } = useRequest(
      (email: string) => Webapi_Base.auth.sendEmail({ params: { email, module: 'User' } }),
      { immediate: false },
    ).onError((err) => {
      toast.error(err.error.message)
    })
    await sendEmailCode(model.value.email)
    toast.success(t('pages.login.register.verificationCodeSent'))
    countdown.value = 60
    sendCodeText.value = '60s'
    countdownTimer = setInterval(() => {
      countdown.value--
      sendCodeText.value = `${countdown.value}s`
      if (countdown.value <= 0) {
        sendCodeText.value = t('pages.login.register.sendCode')
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
    toast.warning(t('pages.login.register.pleaseAcceptUserAgreement'))
    return
  }

  loading(t('pages.login.register.registering'))

  const { isSuccess, error } = await userStore.register({
    userName: model.value.userName,
    password: model.value.password,
    confirmPassword: model.value.confirmPassword,
    email: model.value.email,
    validateCode: model.value.validateCode,
  }, '业务')

  if (isSuccess) {
    alert({
      title: t('pages.login.register.registrationSuccess'),
      msg: t('pages.login.register.clickOkReturn'),
      confirmButtonText: t('pages.login.register.ok'),
      showCancelButton: false,
      closeOnClickModal: false,
      success: () => {
        router.back()
      },
    })
  }
  else {
    toast.error(error?.error?.message || t('pages.login.register.registrationFailed'))
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
      :title="$t('pages.login.register.title')"
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
        <wd-text :text="$t('pages.login.register.createAccount')" custom-class="text-center font-bold !text-default" size="20px" />

        <wd-form ref="registerFormRef" :model="model" :schema="schema" error-type="message">
          <wd-form-item :title="$t('pages.login.register.username')" title-width="80px" prop="userName" custom-class="!bg-transparent">
            <!-- 用户名 -->
            <wd-input
              v-model="model.userName"
              :placeholder="$t('pages.login.register.usernamePlaceholder')"
            />
          </wd-form-item>

          <!-- 邮箱 -->
          <wd-form-item :title="$t('pages.login.register.email')" title-width="80px" prop="email" custom-class="!bg-transparent">
            <wd-input
              v-model="model.email"
              :placeholder="$t('pages.login.register.emailPlaceholder')"
            />
          </wd-form-item>

          <!-- 验证码 -->
          <wd-form-item :title="$t('pages.login.register.code')" title-width="80px" prop="validateCode" custom-class="!bg-transparent">
            <wd-input
              v-model="model.validateCode"
              :placeholder="$t('pages.login.register.codePlaceholder')"
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
          <wd-form-item :title="$t('pages.login.register.password')" title-width="80px" prop="password" custom-class="!bg-transparent">
            <wd-input
              v-model="model.password"
              :placeholder="$t('pages.login.register.passwordPlaceholder')"
              show-password
            />
          </wd-form-item>

          <!-- 确认密码 -->
          <wd-form-item :title="$t('pages.login.register.confirmPassword')" title-width="80px" prop="confirmPassword" custom-class="!bg-transparent">
            <wd-input
              v-model="model.confirmPassword"
              :placeholder="$t('pages.login.register.confirmPasswordPlaceholder')"
              show-password
            />
          </wd-form-item>
        </wd-form>
      </wd-card>

      <!-- 协议勾选 -->
      <view class="flex-center gap-1">
        <wd-checkbox v-model="agreed" type="square" custom-label-class="!text-12px">
          {{ $t('pages.login.register.agreeUserAgreement') }}
        </wd-checkbox>
        <wd-text type="primary" :text="$t('pages.login.userServiceAgreement')" size="12px" @click="toProtocol('userAgreement')" />
        <wd-text :text="$t('pages.login.and')" size="12px" />
        <wd-text type="primary" :text="$t('pages.login.privacyPolicyStatement')" size="12px" @click="toProtocol('privacyPolicy')" />
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
        {{ $t('pages.login.register.registerBtn') }}
      </wd-button>

      <!-- 已有账号 -->
      <view class="flex-center flex-row">
        <wd-text :text="$t('pages.login.register.alreadyHaveAccount')" size="12px" custom-class="!text-default" />
        <wd-text :text="$t('pages.login.register.backToLogin')" size="12px" custom-class="!text-primary ml-1" @click="handleBack" />
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
