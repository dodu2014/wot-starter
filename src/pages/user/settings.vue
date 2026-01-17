<script setup lang="ts">
import router from '@/router'

definePage({
  name: 'user-settings',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户设置',
  },
  needLogin: true,
})

const { confirm } = useGlobalMessage()
const { logined, userInfo, logout } = useUserStore()
function handleLogout() {
  confirm({
    title: '退出登录',
    msg: '确定要退出登录吗？',
    closeOnClickModal: false,
    confirmButtonText: '退出登录',
    cancelButtonText: '取消',
    success: async (res) => {
      if (res.action === 'confirm') {
        await logout()
        router.back()
      }
    },
  })
}
</script>

<template>
  <view class="flex-col gap-y-3">
    <wd-cell-group border>
      <!-- #ifdef MP-WEIXIN -->
      <button class="button-reset" open-type="openSetting">
        <wd-cell title="授权设置" value="小程序" icon="setting1" is-link center>
          <template #icon>
            <wd-icon name="setting1" :size="16" custom-class="text-primary content-center mr-2" />
          </template>
        </wd-cell>
      </button>
      <!-- #endif -->
      <wd-cell title="个人档案" icon="user" is-link :value="userInfo?.name || userInfo?.userName" to="/pages/user/profile">
        <template #icon>
          <wd-icon name="user" :size="16" custom-class="text-primary content-center mr-2" />
        </template>
      </wd-cell>
      <wd-cell title="修改密码" icon="lock-on" is-link to="/pages/user/changePassword">
        <template #icon>
          <wd-icon name="lock-on" :size="16" custom-class="text-primary content-center mr-2" />
        </template>
      </wd-cell>
    </wd-cell-group>

    <!-- 退出登录/操作区域 -->
    <view v-if="logined" class="mt-3 text-center">
      <wd-button plain size="small" type="primary" icon="logout" @click="handleLogout">
        退出登录
      </wd-button>
    </view>
  </view>
</template>
