<script setup lang="ts">
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import type { ChangePasswordModel } from '@/service/apis/base/globals'
import { zodAdapter } from '@wot-ui/ui'
import { z } from 'zod'

definePage({
  name: 'user-change-password',
  layout: 'default',
  style: {
    navigationBarTitleText: '修改密码',
  },
  needLogin: true,
})

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
  () => Webapi_Base.user.changeUserPassword({
    data: model,
  }),
  { immediate: false },
)
  .onError((error) => {
    warning(error.error?.message || '修改密码失败')
  })

async function handleSubmit() {
  const res = await formRef.value?.validate()
  console.log('valid', res)
  if (!res || !res?.valid)
    return

  // request
  await send()
  if (!error.value) {
    success('密码修改成功')
  }
}
</script>

<template>
  <view class="flex-col gap-y-4">
    <wd-form
      ref="formRef" border :model="model"
      :schema="zodAdapter(
        z.object({
          password: z.string().min(6, '至少6个字符').min(1, '必填'),
          newPassword: z.string().min(6, '至少6个字符').min(1, '必填'),
          confirmPassword: z.string().min(1, '必填'),
        })
          .refine(data => data.newPassword === data.confirmPassword, { message: '两次密码输入不一致', path: ['confirmPassword'] }),
      )"
    >
      <wd-form-item
        title="账号"
        title-width="140px"
        prop="userName"
      >
        <wd-input
          v-model="model.userName"
          clearable
          disabled
          placeholder="请输入用户名"
          marker-side="after"
        />
      </wd-form-item>
      <wd-form-item
        title="原密码"
        title-width="140px"
        prop="password"
      >
        <wd-input
          v-model="model.password"
          show-password
          clearable
          placeholder="请输入原密码"
          marker-side="after"
        />
      </wd-form-item>
      <wd-form-item
        title="新密码"
        title-width="140px"
        prop="newPassword"
      >
        <wd-input
          v-model="model.newPassword"
          show-password
          clearable
          placeholder="请输入新密码"
          marker-side="after"
        />
      </wd-form-item>
      <wd-form-item
        title="确认密码"
        title-width="140px"
        prop="confirmPassword"
      >
        <wd-input
          v-model="model.confirmPassword"
          show-password
          clearable
          placeholder="请输入确认密码"
          marker-side="after"
        />
      </wd-form-item>
    </wd-form>

    <view class="px-4">
      <wd-button :loading="loading" type="primary" round block @click="handleSubmit">
        提交
      </wd-button>
    </view>
  </view>
</template>
