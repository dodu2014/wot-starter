<script setup lang="ts">
import type { FormExpose } from 'wot-design-uni/components/wd-form/types'
import { klona as jsonClone } from 'klona/json'
import type { UploadResult } from './type'
import type { UserProfileModel } from '@/service/apis/base/globals'

definePage({
  name: 'user-profile',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户档案',
  },
  needLogin: true,
})

const { userInfo, loadUserInfo } = useUserStore()
const { success, warning } = useGlobalToast()
const model = reactive<UserProfileModel>(jsonClone(userInfo) as UserProfileModel)

const form = ref<FormExpose>()
const uploadUrl = import.meta.env.VITE_UPLOAD_URL

function handleChooseAvatar(e: { avatarUrl: string }) {
  uni.uploadFile({
    url: uploadUrl,
    name: 'file',
    filePath: e.avatarUrl,
    success(e) {
      const { statusCode, errMsg, data } = e
      if (statusCode !== 200) {
        warning(errMsg!)
        return
      }
      const { absUrl } = JSON.parse(data) as UploadResult
      model.avatarUrl = absUrl
    },
  })
}

const { error, loading, send } = useRequest(
  () => Webapi_Base.user.updateUser({
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
    await loadUserInfo()
    success('档案修改成功')
  }
}

onLoad(() => {})
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
          marker-side="after"
          :rules="[{ required: true, message: '必填' }]"
        />
        <wd-input
          v-model="model.email!"
          label="电子邮箱"
          label-width="100px"
          prop="email"
          clearable
          disabled
          placeholder="请输入电子邮箱"
          marker-side="after"
          :rules="[
            { required: true, message: '必填' },
            { required: false, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' },
          ]"
        />
        <wd-input
          v-model="model.name"
          label="昵称"
          label-width="100px"
          prop="name"
          clearable
          :maxlength="10"
          marker-side="after"
          type="nickname"
          :rules="[
            { required: true, message: '必填' },
            { required: false, validator: (value: string, rule) => value.length >= 2, message: '格式不正确, 2-10位' },
          ]"
        />
        <wd-cell title="头像" title-width="100px">
          <view class="flex-col items-start gap-1">
            <app-upload v-model:value="model.avatarUrl!" />
            <wd-button type="info" size="small" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
              使用微信头像
            </wd-button>
          </view>
        </wd-cell>

        <wd-textarea
          v-model="model.description"
          label="描述"
          label-width="100px"
          prop="description"
          clearable
          placeholder="描述"
          :maxlength="200"
          show-word-limit
          class="!h-100px"
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
