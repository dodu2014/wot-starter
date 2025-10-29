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
      <wd-cell title="个人档案" icon="user" is-link :value="userInfo?.userName" to="/pages/user/profile" />
      <wd-cell title="修改密码" icon="lock-on" is-link to="/pages/user/changePassword" />
    </wd-cell-group>
  </view>
</template>
