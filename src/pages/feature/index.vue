<script setup lang="ts">
import router from '@/router'

definePage({
  name: 'feature-index',
  layout: 'default',
  style: {
    navigationBarTitleText: '功能展示',
  },
})

const { wxUserInfo, wxLogin } = useWxUserStore()
onLoad(async () => {
  // #ifdef MP-WEIXIN
  if (!wxUserInfo)
    await wxLogin()
  // #endif
})
</script>

<template>
  <view class="flex-col gap-y-3">
    <wd-cell-group>
      <!-- #ifdef MP-WEIXIN -->
      <wd-cell title="一次性订阅消息" icon="mail" is-link @click="() => router.push('/pages/feature/subscribeMessage')" />
      <wd-cell title="用工关系" icon="user-talk" is-link @click="() => router.push('/pages/feature/employeeRelation')" />
      <!-- #endif -->
    </wd-cell-group>
  </view>
</template>
