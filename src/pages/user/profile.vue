<script setup lang="ts">
import type { FormExpose } from '@wot-ui/ui/components/wd-form/types'
import type { ApiResultOfUpFileUploadResult, UserProfileModel } from '@/service/apis/base/globals'
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/hooks/usePageTitle'

const { t } = useI18n()

definePage({
  name: 'user-profile',
  layout: 'default',
  style: {
    navigationBarTitleText: '个人资料',
  },
  needLogin: true,
})

usePageTitle('pages.user.profile.title')

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
    warning(error.error?.message || t('pages.user.profile.modifyFailed'))
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
    success(t('pages.user.profile.modifySuccess'))
  }
}

onLoad(() => {})
</script>

<template>
  <view class="flex-col gap-y-4">
    <wd-form ref="formRef" border :model="model">
      <wd-form-item
        :title="$t('pages.user.profile.account')"
        title-width="100px"
        prop="userName"
      >
        <wd-input
          v-model="model.userName"
          clearable
          disabled
          :placeholder="$t('pages.user.profile.accountPlaceholder')"
          marker-side="after"
          :rules="[{ required: true, message: t('pages.user.profile.required') }]"
        />
      </wd-form-item>
      <wd-form-item
        :title="$t('pages.user.profile.email')"
        title-width="100px"
        prop="email"
      >
        <wd-input
          v-model="model.email!"
          clearable
          disabled
          :placeholder="$t('pages.user.profile.emailPlaceholder')"
          marker-side="after"
          :rules="[
            { required: true, message: t('pages.user.profile.required') },
            { required: false, pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '邮箱格式不正确' },
          ]"
        />
      </wd-form-item>
      <wd-form-item
        :title="$t('pages.user.profile.nickname')"
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
            { required: true, message: t('pages.user.profile.required') },
            { required: false, validator: (value: string) => value.length >= 2, message: '格式不正确，2-10个字符' },
          ]"
        />
      </wd-form-item>
      <wd-form-item :title="$t('pages.user.profile.avatar')" title-width="100px">
        <view class="flex-col items-start gap-3">
          <app-upload v-model:value="model.avatarUrl!" :limit="1" :show-limit-num="false" />
          <!-- #ifdef MP-WEIXIN -->
          <wd-button type="info" size="small" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
            {{ $t('pages.user.profile.useWechatAvatar') }}
          </wd-button>
          <!-- #endif -->
        </view>
      </wd-form-item>
      <wd-form-item
        :title="$t('pages.user.profile.description')"
        title-width="100px"
        prop="description"
      >
        <wd-textarea
          v-model="model.description"
          clearable
          :placeholder="$t('pages.user.profile.descriptionPlaceholder')"
          :maxlength="200"
          show-word-limit
        />
      </wd-form-item>
    </wd-form>

    <view class="mx-4">
      <wd-button :loading="loading" type="primary" round block @click="handleSubmit">
        {{ $t('pages.user.profile.submit') }}
      </wd-button>
    </view>
  </view>
</template>
