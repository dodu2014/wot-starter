<script lang="ts" setup>
import router, { HOME_PAGE } from '@/router'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录',
  },
})

const toast = useGlobalToast()
const { login } = useUserStore()
const redirectUrl = ref<_LocationUrl>()
const { confirm } = useGlobalMessage()
const { loading } = useGlobalLoading()

const model = ref({
  userName: '',
  password: '',
  remember: true,
})
const agreed = ref(false)

async function handleLogin() {
  await checkAccept()

  if (!model.value.userName || !model.value.password) {
    return toast.warning({ msg: '请输入用户名和密码' })
  }

  loading('登录中..')
  await login(model.value)

  // 保存登录信息
  if (model.value.remember) {
    uni.setStorageSync('loginInfo', {
      username: model.value.userName,
      password: model.value.password,
    })
  }
  else {
    uni.removeStorageSync('loginInfo')
  }

  // 这里添加实际登录逻辑
  toast.success({
    msg: '登录成功',
    duration: 300,
    closed() {
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
    },
  })
}

/** 检测是否接收协议 */
function checkAccept(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (agreed.value) {
      resolve(true)
      return
    }
    confirm({
      title: '同意并继续',
      msg: '请确认以及阅读且同意‘用户服务协议’和‘隐私政策’',
      confirmButtonText: '已阅读',
      success: (e) => {
        if (e.action === 'confirm') {
          agreed.value = true
          resolve(true)
          return
        }
        reject(new Error('已取消'))
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}

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

onLoad((options: any) => {
  // 如果有登录信息，则自动填充用户名
  model.value.userName = uni.getStorageSync('loginInfo')?.username

  if (options?.redirect) {
    redirectUrl.value = options.redirect
  }
  console.log('redirectUrl.value: ', redirectUrl.value)
})
</script>

<template>
  <view class="page">
    <wd-navbar
      title="用户登陆"
      safe-area-inset-top left-arrow placeholder fixed
      custom-style="background-color: transparent !important;"
      :bordered="false"
      @click-left="back"
    />

    <view class="position-absolute left-0 top-0 z-0 h-full w-full">
      <wd-img src="/static/images/login-bg.svg" custom-class="w-full h-full" />
    </view>

    <view class="z-1 flex-center flex-col flex-auto gap-y-5 px-6">
      <wd-card class="bg-op-60 shadow-md !m-0 !bg-white/15 !dark:bg-black/15" custom-content-class="flex flex-col gap-15px py-6">
        <wd-text text="欢迎登录" class="text-center font-bold !text-black !dark:text-[var(--wot-dark-color)]" size="20px" />
        <wd-form :model="model" error-type="message">
          <wd-cell-group custom-class="!bg-transparent">
            <!-- 用户名输入 -->
            <wd-input
              v-model="model.userName"
              label="账号"
              label-width="60px"
              placeholder="请输入登录账号(邮箱)"
              size="large"
              :rules="[{ required: true, message: '必填' }]"
            />

            <!-- 密码输入 -->
            <wd-input
              v-model="model.password"
              label="密码"
              label-width="60px"
              placeholder="请输入密码"
              show-password
              size="large"
              :rules="[{ required: true, message: '必填' }]"
            />
          </wd-cell-group>
        </wd-form>
      </wd-card>

      <view class="flex justify-center">
        <wd-checkbox v-model="model.remember" shape="square">
          记住密码
        </wd-checkbox>
      </view>

      <!-- 登录按钮 -->
      <wd-button type="primary" block class="mx-4" @click="handleLogin">
        立即登录
      </wd-button>
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
/* #ifdef WEB */
.page-wraper {
  background: url('/static/web/bg-user.png') no-repeat center center / cover;
  background-attachment: fixed;
}
/* #endif */
.page {
  /* #ifdef MP-WEIXIN */
  background: $user-bg-url no-repeat center center / cover;
  background-attachment: fixed;
  /* #endif */
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
}
</style>
