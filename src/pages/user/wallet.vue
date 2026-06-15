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

const WITHDRAW_SUCCESSED_EVENT = 'user-wallet-withdraw-successed' // 提现成功事件名称

const balance = ref(186) // TODO 预设的钱包余额，请根据实际业务设置

onLoad(() => {
  uni.$on(WITHDRAW_SUCCESSED_EVENT, (amount: number) => {
    balance.value += amount
  })
})

onUnload(() => {
  uni.$off(WITHDRAW_SUCCESSED_EVENT)
})
</script>

<template>
  <view class="flex-center flex-col flex-full gap-y-3 py-10vh">
    <view class="mb-30px h-56px w-56px flex flex-center rounded-full bg-orange text-26px text-white">
      <text class="i-carbon:wallet" />
    </view>
    <wd-text text="我的钱包" size="14px" custom-class="!text-default" />
    <wd-text :text="balance" mode="price" prefix="￥" size="36px" bold custom-class="!text-default" />
    <view class="flex-full" />
    <wd-button size="large" type="primary" @click="() => router.push('/pages/user/withdraw')">
      立即提现
    </wd-button>
    <wd-button type="info" variant="text" size="small" icon="list" @click="() => {}">
      钱包明细
    </wd-button>
  </view>
</template>
