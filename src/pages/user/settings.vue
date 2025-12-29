<script setup lang="ts">
definePage({
  name: 'user-settings',
  layout: 'default',
  style: {
    navigationBarTitleText: '用户设置',
  },
  needLogin: true,
})

const { userInfo } = useUserStore()
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
      <wd-cell title="个人档案" icon="user" is-link :value="userInfo?.userName" to="/pages/user/profile">
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
  </view>
</template>
