<script lang="ts" setup>
import router, { HOME_PAGE } from '@/router'
import PassLogin from './components/passLogin.vue'
import PhoneLogin from './components/phoneLogin.vue'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录',
  },
})

const agreed = ref(false)
const redirectUrl = ref<_LocationUrl>()

type TabMode = 'phone' | 'password'
const tab = ref<TabMode>('phone')

function back() {
  const pages = getCurrentPages()
  if (pages.length > 1)
    router.back()
  else
    router.pushTab({ path: HOME_PAGE })
}

function toProtocol(type: 'privacyPolicy' | 'userAgreement') {
  // 这里可以跳转到协议页面
  router.push({ path: `/pages/login/${type}` })
}

function loginSuccess() {
  if (!redirectUrl.value) {
    if (getCurrentPages().length > 1)
      router.back()
    else
      router.pushTab({ path: HOME_PAGE })
    return
  }
  // 判断 redirectUrl 是否为 tab 页面
  if (isPageTabbar(redirectUrl.value)) {
    router.pushTab(redirectUrl.value)
  }
  else {
    router.replace(redirectUrl.value)
  }
}

onLoad((e: any) => {
  const { redirect } = e
  redirectUrl.value = (redirect && decodeURIComponent(redirect) as _LocationUrl) || undefined
})
</script>

<template>
  <view class="page">
    <wd-navbar
      title="用户登陆"
      :bordered="false"
      :fixed="true"
      placeholder
      safe-area-inset-top
      left-arrow
      custom-class="!bg-transparent"
      @click-left="back"
    />

    <view class="position-absolute left-0 top-0 z-0 h-full w-full">
      <wd-img src="/static/images/login-bg.svg" custom-class="w-full h-full" />
    </view>

    <view class="z-1 flex-center flex-col flex-auto px-10">
      <!-- #ifdef MP-WEIXIN -->
      <!-- tabs -->
      <wd-tabs v-model="tab" animated>
        <!-- 微信快捷登录 -->
        <wd-tab title="快捷登录" name="phone">
          <view class="tab-content">
            <phone-login v-model:agreed="agreed" class="mt--120px" @login-success="loginSuccess" />
          </view>
        </wd-tab>

        <!-- 账号密码登录 -->
        <wd-tab title="密码登录" name="password">
          <view class="tab-content">
            <pass-login v-model:agreed="agreed" @login-success="loginSuccess" />
          </view>
        </wd-tab>
      </wd-tabs>
      <!-- #endif -->

      <!-- #ifdef WEB -->
      <pass-login v-model:agreed="agreed" @login-success="loginSuccess" />
      <!-- #endif -->
    </view>

    <view class="z-10 flex justify-center pb-30px text-14px">
      <wd-checkbox v-model="agreed" shape="square">
        已阅读并同意
      </wd-checkbox>
      <wd-text type="primary" text="《用户协议》" @click="toProtocol('userAgreement')" />
      <wd-text type="primary" text="《隐私政策》" @click="toProtocol('privacyPolicy')" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  background: $user-bg-url no-repeat center center / cover;
  background-attachment: fixed;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

:deep() {
  .wd-input.is-cell,
  .wd-input__icon,
  .wd-cell-group__body {
    background-color: transparent !important;
  }

  .wd-tabs,
  .wd-tabs__nav {
    background-color: transparent !important;
  }
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1rem;
  height: 350px;
  justify-content: center;
}
</style>
