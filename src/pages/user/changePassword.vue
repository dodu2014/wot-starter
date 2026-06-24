<script setup lang="ts">
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import type { ChangePasswordModel } from '@/service/apis/base/globals'
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import { zodAdapter } from '@wot-ui/ui'
import z from 'zod'

const { t } = useI18n()

definePage({
  name: 'user-change-password',
  layout: 'default',
  style: {
    navigationBarTitleText: '修改密码',
  },
  needLogin: true,
})

usePageTitle('pages.user.changePassword.title')

const { userInfo } = useUserStore()
const { success, warning } = useGlobalToast()

const model = reactive<ChangePasswordModel>({
  userName: userInfo?.userName || '',
  password: '',
  newPassword: '',
  confirmPassword: '',
})

const formRef = ref<FormExpose>()

const { error, loading, send } = useRequest(
  () =>
    Webapi_Base.user.changeUserPassword({
      data: model,
    }),
  { immediate: false },
).onError(error => {
  warning(error.error?.message || t('pages.user.changePassword.changeFailed'))
})

async function handleSubmit() {
  const res = await formRef.value?.validate()
  console.log('valid', res)
  if (!res || !res?.valid) return

  // request
  await send()
  if (!error.value) {
    success(t('pages.user.changePassword.changeSuccess'))
  }
}
</script>

<template>
  <view class="flex-col gap-y-4">
    <wd-form
      ref="formRef"
      border
      :model="model"
      :schema="
        zodAdapter(
          z
            .object({
              password: z
                .string()
                .min(6, t('pages.user.changePassword.passwordMinLength'))
                .min(1, t('pages.user.changePassword.required')),
              newPassword: z
                .string()
                .min(6, t('pages.user.changePassword.passwordMinLength'))
                .min(1, t('pages.user.changePassword.required')),
              confirmPassword: z.string().min(1, t('pages.user.changePassword.required')),
            })
            .refine(data => data.newPassword === data.confirmPassword, {
              message: t('pages.user.changePassword.repasswordMismatch'),
              path: ['confirmPassword'],
            }),
        )
      "
    >
      <wd-form-item
        :title="$t('pages.user.changePassword.account')"
        title-width="140px"
        prop="userName"
      >
        <wd-input
          v-model="model.userName"
          clearable
          disabled
          :placeholder="$t('pages.user.changePassword.accountPlaceholder')"
          marker-side="after"
        />
      </wd-form-item>
      <wd-form-item
        :title="$t('pages.user.changePassword.originalPassword')"
        title-width="140px"
        prop="password"
      >
        <wd-input
          v-model="model.password"
          show-password
          clearable
          :placeholder="$t('pages.user.changePassword.originalPasswordPlaceholder')"
          marker-side="after"
        />
      </wd-form-item>
      <wd-form-item
        :title="$t('pages.user.changePassword.newPassword')"
        title-width="140px"
        prop="newPassword"
      >
        <wd-input
          v-model="model.newPassword"
          show-password
          clearable
          :placeholder="$t('pages.user.changePassword.newPasswordPlaceholder')"
          marker-side="after"
        />
      </wd-form-item>
      <wd-form-item
        :title="$t('pages.user.changePassword.confirmPassword')"
        title-width="140px"
        prop="confirmPassword"
      >
        <wd-input
          v-model="model.confirmPassword"
          show-password
          clearable
          :placeholder="$t('pages.user.changePassword.confirmPasswordPlaceholder')"
          marker-side="after"
        />
      </wd-form-item>
    </wd-form>

    <view class="px-4">
      <wd-button :loading="loading" type="primary" round block @click="handleSubmit">
        {{ $t('pages.user.changePassword.submit') }}
      </wd-button>
    </view>
  </view>
</template>
