<script setup lang="ts">
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import type { ApiResultOfUpFileUploadResult, UserProfileModel } from '@/service/apis/base/globals'

definePage({
  name: 'user-profile',
  layout: 'default',
  style: {
    navigationBarTitleText: '个人资料',
  },
  needLogin: true,
})

const { userInfo, loadUserInfo } = useUserStore()
const { success, warning } = useGlobalToast()
const model = reactive<UserProfileModel>(jsonClone(userInfo) as UserProfileModel)

const formRef = ref<FormExpose>()

function handleChooseAvatar(e: { avatarUrl: string }) {
  uni.uploadFile({
    url: VITE_UPLOAD_URL,
    name: 'file',
    filePath: e.avatarUrl,
    success({ statusCode, errMsg, data }) {
      console.log('success', { statusCode, errMsg, data })
      if (statusCode !== 200) {
        warning(errMsg!)
        return
      }
      const json = JSON.parse(data) as ApiResultOfUpFileUploadResult
      model.avatarUrl = json.data?.absUrl
      console.log('model', model)
    },
    fail(err) {
      warning(err.errMsg!)
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
    warning(error.error?.message || '修改失败')
  })

async function handleSubmit() {
  const res = await formRef.value?.validate()
  console.log('valid', res)
  if (!res || !res?.valid)
    return

  // request
  await send()
  if (!error.value) {
    await loadUserInfo()
    success('修改成功')
  }
}

onLoad(() => {})
</script>

<template>
  <view class="flex-col gap-y-4">
    <wd-form ref="formRef" border :model="model">
      <wd-form-item
        title="账号"
        title-width="100px"
        prop="userName"
      >
        <wd-input
          v-model="model.userName"
          clearable
          disabled
          placeholder="请输入用户名"
          marker-side="after"
          :rules="[{ required: true, message: '必填' }]"
        />
      </wd-form-item>
      <wd-form-item
        title="邮箱"
        title-width="100px"
        prop="email"
      >
        <wd-input
          v-model="model.email!"
          clearable
          disabled
          placeholder="请输入邮箱"
          marker-side="after"
          :rules="[
            { required: true, message: '必填' },
            { required: false, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' },
          ]"
        />
      </wd-form-item>
      <wd-form-item
        title="昵称"
        title-width="100px"
        prop="name"
      >
        <wd-input
          v-model="model.name"
          clearable
          :maxlength="10"
          marker-side="after"
          type="nickname"
          :rules="[
            { required: true, message: '必填' },
            { required: false, validator: (value: string) => value.length >= 2, message: '格式不正确，2-10个字符' },
          ]"
        />
      </wd-form-item>
      <wd-form-item title="头像" title-width="100px">
        <view class="flex-col items-start gap-3">
          <app-upload v-model:value="model.avatarUrl!" :limit="1" :show-limit-num="false" />
          <!-- #ifdef MP-WEIXIN -->
          <wd-button type="info" size="small" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
            使用微信头像
          </wd-button>
          <!-- #endif -->
        </view>
      </wd-form-item>
      <wd-form-item
        title="简介"
        title-width="100px"
        prop="description"
      >
        <wd-textarea
          v-model="model.description"
          clearable
          placeholder="简介"
          :maxlength="200"
          show-word-limit
        />
      </wd-form-item>
    </wd-form>

    <view class="mx-4">
      <wd-button :loading="loading" type="primary" round block @click="handleSubmit">
        提交
      </wd-button>
    </view>
  </view>
</template>
