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
const merchantId = import.meta.env.VITE_WEIXIN_PAY_MERCHANT_ID

const amount = ref('')

const { wxUserInfo } = useWxUserStore()
console.log('wxUserInfo:', wxUserInfo)
console.log('uuid:', uuid())

const { send: sendRequestMerchantTransfer } = useRequest(
  () => Webapi_Weixin.wxPay.requestMerchantTransfer({
    params: {
      amout: 0.01,
      openId: wxUserInfo?.openId,
      orderNum: uuid(),
    },
  }),
  {
    immediate: false,
  },
)

async function confirmTransfer() {
  if (!wx.canIUse('requestMerchantTransfer')) {
    warning('当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试')
    return
  }
  const { code, data, message } = await sendRequestMerchantTransfer()
  if (code !== 200) {
    warning(message!)
    return
  }
  if (data?.state !== 'WAIT_USER_CONFIRM' || !data?.package_info) {
    warning('请求转账失败，请稍后再试')
    return
  }

  wx.requestMerchantTransfer({
    mchId: merchantId,
    appId: wx.getAccountInfoSync().miniProgram.appId,
    package: data.package_info,
    success: (res) => {
      // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
      console.log('success:', res)
    },
    fail: (res) => {
      console.log('fail:', res)
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
      <wd-input v-model="amount" size="large" inputmode="decimal" no-border label-width="0" placeholder="请输入提现金额…" focus custom-class="!p-0 !bg-transparent">
        <template #prefix>
          <text class="text-default">
            ¥
          </text>
        </template>
      </wd-input>
      <view class="flex items-center gap-x-2">
        <wd-text text="当前钱包余额 0 元" size="12px" />
        <wd-button type="text" size="small">
          全部提现
        </wd-button>
      </view>

      <wd-button type="success" size="large" custom-class="mt-30px" @click="confirmTransfer">
        确认提现
      </wd-button>
    </view>
  </view>
</template>
