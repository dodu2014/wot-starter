<script setup lang="ts">
import type { CreateMerchantTransferRequest } from '@/service/apis/weixin/globals'
import { uuid } from '@alova/shared'
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/hooks/usePageTitle'
import router from '@/router'

const { t } = useI18n()

definePage({
  name: 'user-withdraw',
  layout: 'default',
  style: {
    navigationBarTitleText: '提现',
  },
  needLogin: true,
})

usePageTitle('pages.user.withdraw.title')

const { warning, success } = useGlobalToast()
const { loading: showLoading, close: hideLoading } = useGlobalLoading()
const { confirm } = useGlobalDialog()
const merchantId = import.meta.env.VITE_WEIXIN_PAY_MERCHANT_ID

const balance = ref(186) // TODO 预设的钱包余额，请根据实际业务设置
const amount = ref('')

const { userInfo } = useUserStore()
const { wxUserInfo } = useWxUserStore()
console.log('wxUserInfo:', wxUserInfo)
console.log('uuid:', uuid())

/** 设置可提现的最大值 */
function setMaxDrawValue() {
  let maxValue = balance.value
  if (maxValue > 200) maxValue = 200
  amount.value = `${maxValue}`
}

/** 成功提现后的处理 */
function successTransferHandler() {
  balance.value -= Number(amount.value)

  // 触发用户钱包变化事件
  uni.$emit('user-wallet-withdraw-successed', Number(amount.value) * -1)
  amount.value = ''

  success({
    msg: t('pages.user.withdraw.successMsg'),
    duration: 1200,
    closed() {
      router.back()
    },
  })
}

const { send: sendRequestMerchantTransfer, loading } = useRequest(
  (data: CreateMerchantTransferRequest) =>
    Webapi_Weixin.wxPay.requestMerchantTransfer({ params: { notifyUrl: '' }, data }),
  { immediate: false },
)
  .onComplete(() => {
    hideLoading()
  })
  .onError(({ error }) => {
    warning(error)
  })
  .onSuccess(({ data: transferBill }) => {
    showLoading('loading')
    const { data, message, isSuccess } = transferBill
    if (!isSuccess) {
      warning(message!)
      return
    }
    if (data?.state !== 'WAIT_USER_CONFIRM' || !data?.package_info) {
      warning(t('pages.user.withdraw.transferFailed'))
      return
    }

    uni.requestMerchantTransfer({
      mchId: merchantId,
      appId: uni.getAccountInfoSync().miniProgram.appId,
      package: data.package_info,
      success: res => {
        // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
        console.log('success:', res)
        successTransferHandler()
      },
      fail: res => {
        console.log('fail:', res)
      },
    })
  })

function confirmTransfer() {
  if (!wx.canIUse('requestMerchantTransfer')) {
    warning(t('pages.user.withdraw.wechatVersionLow'))
    return
  }
  if (!amount.value || Number.isNaN(Number(amount.value))) {
    warning(t('pages.user.withdraw.invalidAmount'))
    return
  }
  const amountValue = Number.parseFloat(amount.value)
  if (amountValue < 1) {
    warning(t('pages.user.withdraw.amountLessThan1'))
    return
  }
  if (amountValue > balance.value) {
    warning(t('pages.user.withdraw.amountGreaterThanBalance'))
    return
  }
  if (amountValue > 200) {
    warning(t('pages.user.withdraw.amountGreaterThan200'))
    return
  }
  confirm({
    confirmButtonText: t('pages.user.withdraw.confirm'),
    cancelButtonText: t('pages.user.withdraw.cancel'),
    msg: t('pages.user.withdraw.confirmMsg'),
    async success(res) {
      if (res.action !== 'confirm') return
      showLoading('loading')
      await sendRequestMerchantTransfer({
        userId: userInfo!.id!,
        openId: wxUserInfo!.openId!,
        amount: amountValue,
        appId: VITE_APPID,
        mchId: VITE_WEIXIN_PAY_MERCHANT_ID,
      })
    },
  })
}
</script>

<template>
  <view class="flex-col flex-full">
    <wd-card type="rectangle" custom-class="!mb-0">
      <wd-cell :title="$t('pages.user.withdraw.method')" title-width="80px" is-link>
        <view class="w-full flex gap-x-2">
          <wd-icon name="info-circle" size="16px" />
          <view class="flex-col items-start gap-x-2">
            <wd-text :text="$t('pages.user.withdraw.wechatBalance')" custom-class="!text-default" />
            <wd-text :text="$t('pages.user.withdraw.realTime')" size="12px" />
          </view>
        </view>
      </wd-cell>
    </wd-card>

    <view class="flex-col gap-y-3 px-8 py-4">
      <wd-text :text="$t('pages.user.withdraw.amount')" size="12px" custom-class="!text-default" />
      <wd-input
        v-model="amount"
        size="large"
        type="number"
        inputmode="numeric"
        no-border
        label-width="0"
        :placeholder="$t('pages.user.withdraw.amountPlaceholder')"
        focus
        custom-class="!p-0 !bg-transparent is-large2"
      >
        <template #prefix>
          <text class="text-default"> ¥ </text>
        </template>
      </wd-input>
      <view class="flex-col">
        <wd-text :text="$t('pages.user.withdraw.currentBalance', [balance])" size="12px" />
        <view class="flex items-center gap-x-2">
          <wd-text :text="$t('pages.user.withdraw.minMaxAmount')" size="12px" />
          <wd-button type="primary" variant="text" size="small" @click="setMaxDrawValue">
            {{ $t('pages.user.withdraw.maxWithdraw') }}
          </wd-button>
        </view>
      </view>

      <wd-button
        type="primary"
        size="large"
        custom-class="mt-30px"
        :loading="loading"
        :disabled="loading"
        @click="confirmTransfer"
      >
        {{ $t('pages.user.withdraw.confirmBtn') }}
      </wd-button>
      <wd-button
        type="info"
        variant="text"
        icon="time-line"
        size="small"
        @click="() => router.push('/pages/user/withdrawOrderList')"
      >
        {{ $t('pages.user.withdraw.withdrawRecord') }}
      </wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
:deep(.wd-input.is-large2) {
  .wd-input__prefix,
  .wd-input__inner {
    font-size: 20px !important;
  }
}
</style>
