<script lang="ts" setup>
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import { zodAdapter } from '@wot-ui/ui'
import { useI18n } from 'vue-i18n'
import z from 'zod'
import router from '@/router'
import { checkAccept } from './method'

defineOptions({ name: 'PassLogin' })

const emit = defineEmits<{
  loginSuccess: []
}>()

const { t } = useI18n()

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

  agreed.value = await checkAccept(agreed.value, t)

  loading(t('pages.login.passLogin.loging'))
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
  } else {
    uni.removeStorageSync('loginInfo')
  }

  // 这里添加实际登录逻辑
  toast.success({
    msg: t('pages.login.passLogin.loginSuccess'),
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
    <wd-card
      custom-class="!rounded-lg !shadow-sm !shadow-gray !shadow-op-10 !m-0 !bg-#ffffff55 !dark:bg-#1a1a1a55 backdrop-blur-10px"
      custom-content-class="flex flex-col gap-15px !py-6"
    >
      <wd-text
        :text="$t('pages.login.passLogin.welcome')"
        custom-class="text-center font-bold !text-default"
        size="20px"
      />
      <wd-form
        ref="loginFormRef"
        :model="model"
        :schema="
          zodAdapter(
            z.object({
              userName: z.string().min(1, t('pages.login.passLogin.required')),
              password: z.string().min(1, t('pages.login.passLogin.required')),
            }),
          )
        "
        error-type="message"
      >
        <wd-form-item
          prop="userName"
          :title="$t('pages.login.passLogin.account')"
          title-width="80px"
          custom-class="!bg-transparent"
        >
          <!-- 用户名输入 -->
          <wd-input
            v-model="model.userName"
            :placeholder="$t('pages.login.passLogin.accountPlaceholder')"
            :rules="[{ required: true, message: t('pages.login.passLogin.required') }]"
          />
        </wd-form-item>

        <!-- 密码输入 -->
        <wd-form-item
          prop="password"
          :title="$t('pages.login.passLogin.password')"
          title-width="80px"
          custom-class="!bg-transparent"
        >
          <wd-input
            v-model="model.password"
            :placeholder="$t('pages.login.passLogin.passwordPlaceholder')"
            show-password
            :rules="[{ required: true, message: t('pages.login.passLogin.required') }]"
          />
        </wd-form-item>
      </wd-form>
    </wd-card>

    <view class="flex justify-center">
      <wd-checkbox v-model="model.remember" type="square" placement="left">
        {{ $t('pages.login.passLogin.rememberAccount') }}
      </wd-checkbox>
    </view>

    <!-- 登录按钮 -->
    <wd-button type="primary" round custom-class="!bg-primary-gradient mx-4" @click="handleLogin">
      <view class="flex-center gap-2">
        <text class="i-carbon:login" />
        <text>
          {{ $t('pages.login.passLogin.loginBtn') }}
        </text>
      </view>
    </wd-button>

    <view class="flex-center flex-row">
      <wd-text
        :text="$t('pages.login.passLogin.registerNewUser')"
        size="12px"
        custom-class="!text-primary"
        @click="() => router.push('/pages/login/register')"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
