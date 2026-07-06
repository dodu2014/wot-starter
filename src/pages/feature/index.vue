<script setup lang="ts">
import CitysPicker from '@/components/CitysPicker.vue'
import router from '@/router'

definePage({
  name: 'feature-index',
  layout: 'default',
  style: {
    navigationBarTitleText: '功能展示',
  },
})

const { wxUserInfo, wxLogin } = useWxUserStore()
const cityValue = ref<string[]>(['410000', '411100', '411102'])
const cityLabels = ref<string[]>(['河南省', '漯河市', '源汇区'])

onLoad(async () => {
  // #ifdef MP-WEIXIN
  if (!wxUserInfo)
    await wxLogin()
  // #endif
})
</script>

<template>
  <view class="flex-col gap-y-3">
    <wd-cell-group border custom-class="cell-justify-end">
      <!-- #ifdef MP-WEIXIN -->
      <wd-cell title="一次性订阅消息" icon="mail" is-link @click="() => router.push('/pages/feature/subscribeMessage')" />
      <wd-cell title="用工关系" icon="user-talk" is-link @click="() => router.push('/pages/feature/employeeRelation')" />
      <!-- #endif -->
      <!-- 城市选择器 -->
      <citys-picker v-model:value="cityValue" v-model:labels="cityLabels" prefix-icon="ordered-list" title="选择城市" />
      <wd-cell title="测试的" prefix-icon="swap" is-link />
    </wd-cell-group>
  </view>
</template>
