<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import router from '@/router'

const { t } = useI18n()

definePage({
  name: 'user-settings',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户设置',
  },
  needLogin: true,
})

usePageTitle('pages.user.settings.title')

const { confirm } = useGlobalDialog()
const { logined, userInfo, logout } = useUserStore()
function handleLogout() {
  confirm({
    title: t('pages.user.settings.logoutTitle'),
    msg: t('pages.user.settings.logoutMsg'),
    closeOnClickModal: false,
    confirmButtonText: t('pages.user.settings.confirmLogout'),
    success: async (res) => {
      if (res.action === 'confirm') {
        await logout()
        router.back()
      }
    },
  })
}

function handleCancelAccount() {
  confirm({
    title: '注销账户',
    msg: '注销后您的账户、财务数据及所有关联信息将被永久删除，且无法恢复。确定要申请注销账户吗？',
    closeOnClickModal: false,
    confirmButtonText: '确定注销',
    cancelButtonText: '我再想想',
    success: async (res) => {
      if (res.action === 'confirm') {
        router.push({ path: '/pages/user/cancelAccount' })
      }
    },
  })
}

function toProtocol(type: 'userAgreement' | 'privacyPolicy') {
  if (type === 'userAgreement') {
    router.push({ path: '/pages/login/userAgreement' })
  }
  else if (type === 'privacyPolicy') {
    router.push({ path: '/pages/login/privacyPolicy' })
  }
}
</script>

<template>
  <view class="flex-col flex-1 gap-4">
    <wd-cell-group border custom-class="!m-0">
      <!-- #ifdef MP-WEIXIN -->
      <button class="button-reset" open-type="openSetting">
        <wd-cell :title="$t('pages.user.settings.authSetting')" :value="$t('pages.user.settings.miniProgram')" icon="setting1" is-link center>
          <template #prefix>
            <wd-icon name="settings" :size="16" custom-class="text-primary content-center mr-2" />
          </template>
        </wd-cell>
      </button>
      <!-- #endif -->
      <wd-cell :title="$t('pages.user.settings.personalProfile')" icon="user" is-link :value="userInfo?.name || userInfo?.userName" to="/pages/user/profile">
        <template #prefix>
          <text class="i-carbon:user-profile mr-2 self-center text-20px text-primary" />
        </template>
      </wd-cell>
      <wd-cell :title="$t('pages.user.settings.changePassword')" icon="lock-on" is-link to="/pages/user/changePassword">
        <template #prefix>
          <text class="i-carbon:rule-locked mr-2 text-20px text-primary" />
        </template>
      </wd-cell>
    </wd-cell-group>

    <!-- 退出登录/操作区域 -->
    <view v-if="logined" class="flex-center">
      <wd-button size="small" type="danger" round variant="plain" @click="handleLogout">
        <view class="flex-row items-center gap-3">
          <text class="i-carbon:logout" />
          <text>{{ $t('pages.user.settings.logout') }}</text>
        </view>
      </wd-button>
    </view>

    <!-- 注销账户/显示隐私政策 -->
    <view v-if="logined" class="mt-auto flex-col items-center justify-center gap-3 pb-8">
      <!-- 协议勾选 -->
      <view class="flex-center gap-4">
        <wd-text type="primary" :text="$t('pages.login.userServiceAgreement')" @click="toProtocol('userAgreement')" />
        <wd-text type="primary" :text="$t('pages.login.privacyPolicyStatement')" @click="toProtocol('privacyPolicy')" />
      </view>

      <view class="flex-center gap-2" @click="handleCancelAccount">
        <text class="i-carbon:port-output" />
        <wd-text type="default" text="申请注销账户" />
      </view>
    </view>
  </view>
</template>
