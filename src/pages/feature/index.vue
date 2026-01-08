<script setup lang="ts">
import router from '@/router'

definePage({
  name: 'feature-index',
  layout: 'default',
  style: {
    navigationBarTitleText: '功能展示',
  },
})

const { wxLogin } = useWxUserStore()
async function toPage(path: _LocationUrl) {
  await wxLogin()
  router.push(path)
}
</script>

<template>
  <view class="flex-col gap-y-3">
    <wd-cell-group>
      <wd-cell title="一次性订阅消息" icon="mail" is-link @click="() => toPage('/pages/feature/subscribeMessage')" />
      <wd-cell title="用工关系" icon="user-talk" is-link @click="() => toPage('/pages/feature/employeeRelation')" />
    </wd-cell-group>
  </view>
</template>
