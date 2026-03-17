<script setup lang="ts">
import { uuid } from '@alova/shared'

definePage({
  name: 'user-withdraw',
  layout: 'default',
  style: {
    navigationBarTitleText: '提现',
  },
  needLogin: true,
})

// eslint-disable-next-line unused-imports/no-unused-vars
const { warning, success } = useGlobalToast()
const { loading, close: hideLoading } = useGlobalLoading()
const { confirm } = useGlobalMessage()
const merchantId = import.meta.env.VITE_WEIXIN_PAY_MERCHANT_ID

const balance = ref(186)
const amount = ref('')

const { wxUserInfo } = useWxUserStore()
console.log('wxUserInfo:', wxUserInfo)
console.log('uuid:', uuid())

function setMaxDrawValue() {
  let maxValue = balance.value
  if (maxValue > 200)
    maxValue = 200
  amount.value = `${maxValue}`
}

const { send: sendRequestMerchantTransfer } = useRequest(
  () => Webapi_Weixin.wxPay.requestMerchantTransfer({
    params: {
      amout: Number.parseFloat(amount.value),
      openId: wxUserInfo?.openId,
      orderNum: uuid(),
    },
  }),
  {
    immediate: false,
  },
).onError((err) => {
  console.log('err:', err)
}).onComplete(() => {
  hideLoading()
})

function confirmTransfer() {
  if (!wx.canIUse('requestMerchantTransfer')) {
    warning('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试')
    return
  }
  if (!amount.value || Number.isNaN(Number(amount.value))) {
    warning('请输入正确的金额值')
    return
  }
  const amountValue = Number.parseFloat(amount.value)
  if (amountValue < 1) {
    warning('提现金额不能小于1元')
    return
  }
  if (amountValue > balance.value) {
    warning('提现金额不能大于余额')
    return
  }
  if (amountValue > 200) {
    warning('提现金额不能大于200元')
    return
  }
  confirm({
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    msg: '再次确认你的提现金额并继续提现吗？',
    async success(res) {
      if (res.action !== 'confirm')
        return
      loading('loading')
      const { code, data, message } = await sendRequestMerchantTransfer()
      if (code !== 200) {
        warning(message!)
        return
      }
      if (data?.state !== 'WAIT_USER_CONFIRM' || !data?.package_info) {
        warning('请求转账失败，请稍后再试')
        return
      }

      uni.requestMerchantTransfer({
        mchId: merchantId,
        appId: uni.getAccountInfoSync().miniProgram.appId,
        package: data.package_info,
        success: (res) => {
          // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
          console.log('success:', res)
        },
        fail: (res) => {
          console.log('fail:', res)
        },
      })
    },
  })
}
</script>

<template>
  <view class="flex-col flex-full">
    <wd-card type="rectangle" custom-class="!mb-0">
      <wd-cell title="提现方式" title-width="80px" is-link>
        <view class="w-full flex gap-x-2">
          <wd-icon name="money-circle" size="16px" />
          <view class="flex-col items-start gap-x-2">
            <wd-text text="微信零钱" custom-class="!text-default" />
            <wd-text text="实施到账" size="12px" />
          </view>
        </view>
      </wd-cell>
    </wd-card>

    <view class="flex-col gap-y-3 px-8 py-4">
      <wd-text text="提现金额" size="12px" custom-class="!text-default" />
      <wd-input v-model="amount" size="large" inputmode="decimal" no-border label-width="0" placeholder="请输入提现金额…" focus custom-class="!p-0 !bg-transparent is-large2">
        <template #prefix>
          <text class="text-default">
            ¥
          </text>
        </template>
      </wd-input>
      <view class="flex-col">
        <wd-text :text="`当前钱包余额 ${balance} 元`" size="12px" />
        <view class="flex items-center gap-x-2">
          <wd-text text="最小提现金额为 1 元, 最大 200 元" size="12px" />
          <wd-button type="text" size="small" @click="setMaxDrawValue">
            最大提现
          </wd-button>
        </view>
      </view>

      <wd-button type="success" size="large" custom-class="mt-30px" @click="confirmTransfer">
        确认提现
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-input.is-large2) {
  .wd-input__prefix,
  .wd-input__inner {font-size: 20px !important;}
}
</style>
