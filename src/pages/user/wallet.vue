<script setup lang="ts">
import { uuid } from '@alova/shared'

definePage({
  name: 'user-wallt',
  layout: 'default',
  style: {
    navigationBarTitleText: '钱包',
  },
})

// eslint-disable-next-line unused-imports/no-unused-vars
const { warning, success } = useGlobalToast()
const merchantId = import.meta.env.VITE_WEIXIN_PAY_MERCHANT_ID

const { wxUserInfo } = useWxUserStore()

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
  <view class="flex-col gap-y-3">
    <wd-button @click="confirmTransfer">
      确认提现
    </wd-button>
  </view>
</template>
