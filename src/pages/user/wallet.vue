<script setup lang="ts">
import router from '@/router'

definePage({
  name: 'user-wallt',
  layout: 'default',
  style: {
    navigationBarTitleText: '我的钱包',
  },
  needLogin: true,
})
</script>

<template>
  <view class="flex-center flex-col flex-full gap-y-3 py-10vh">
    <wd-icon name="money-circle" size="56px" color="white" custom-class="mb-30px bg-orange rounded-full" />
    <wd-text text="我的钱包" size="14px" custom-class="!text-default" />
    <wd-text text="200.00" mode="price" prefix="￥" size="36px" bold custom-class="!text-default" />
    <view class="flex-full" />
    <wd-button size="large" type="success" @click="() => router.push('/pages/user/withdraw')">
      立即提现
    </wd-button>
    <wd-button size="large" type="info" @click="() => router.push('/pages/user/walletDetail')">
      钱包明细
    </wd-button>
  </view>
</template>
