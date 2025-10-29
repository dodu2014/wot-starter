<script setup lang="ts">
import type { FormExpose } from 'wot-design-uni/components/wd-form/types'
import type { ChangePasswordModel } from '@/service/apis/base/globals'

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

const form = ref<FormExpose>()

const { error, loading, send } = useRequest(
  () => Webapi_Base.user.ChangeUserPassword({
    data: model,
  }),
  { immediate: false },
)
  .onError((error) => {
    warning(error.error?.message || '修改密码失败')
  })

async function handleSubmit() {
  const res = await form.value?.validate()
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
  <view class="flex-col gap-y-3">
    <wd-form ref="form" :model="model">
      <wd-cell-group border>
        <wd-input
          v-model="model.userName"
          label="账号"
          label-width="100px"
          prop="userName"
          clearable
          disabled
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <wd-input
          v-model="model.password"
          label="原密码"
          label-width="100px"
          prop="password"
          show-password
          clearable
          placeholder="请输入原密码"
          :rules="[
            { required: true, message: '必填' },
            { required: false, validator: (value: string, rule) => value.length >= 6, message: '格式不正确, 6-16位' },
          ]"
        />
        <wd-input
          v-model="model.newPassword"
          label="新密码"
          label-width="100px"
          prop="newPassword"
          show-password
          clearable
          placeholder="请输入新密码"
          :rules="[
            { required: true, message: '必填' },
            { required: false, validator: (value: string, rule) => value.length >= 6, message: '格式不正确, 6-16位' },
          ]"
        />
        <wd-input
          v-model="model.confirmPassword"
          label="确认密码"
          label-width="100px"
          prop="confirmPassword"
          show-password
          clearable
          placeholder="请输入确认密码"
          :rules="[
            { required: true, message: '必填' },
            { required: false, validator: (value: string, rule) => value.length >= 6, message: '格式不正确, 6-16位' },
            { required: false, validator: (value: string, rule) => value === model.newPassword, message: '两次密码不一致' },
          ]"
        />
      </wd-cell-group>
      <view class="m-4">
        <wd-button :loading="loading" type="primary" block @click="handleSubmit">
          提交
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>
