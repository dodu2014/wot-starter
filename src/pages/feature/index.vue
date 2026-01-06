<script setup lang="ts">
import router from '@/router'

definePage({
  name: 'feature-index',
  layout: 'default',
  style: {
    navigationBarTitleText: '功能展示',
  },
})
</script>

<template>
  <view class="flex-col gap-y-3">
    <wd-cell-group>
      <wd-cell title="用工关系" icon="user" is-link @click="() => router.push('/pages/feature/employeeRelation')" />
    </wd-cell-group>
  </view>
</template>
