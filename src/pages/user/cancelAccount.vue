<script setup lang="ts">
import { usePageTitle } from '@/hooks/usePageTitle'
import router, { LOGIN_PAGE } from '@/router'

definePage({
  name: 'user-cancel-account',
  layout: 'default',
  style: {
    navigationBarTitleText: '注销账户',
  },
  needLogin: true,
})

usePageTitle('pages.user.cancelAccount.title')

const { confirm } = useGlobalDialog()
const toast = useGlobalToast()
const { loading: showLoading, close: hideLoading } = useGlobalLoading()
const { cancelAccount } = useUserStore()

async function handleCancelAccount() {
  confirm({
    title: '最后确认',
    msg: '此操作不可逆！注销后您的账户、财务数据及所有关联信息将被永久删除，无法恢复。确认继续注销吗？',
    closeOnClickModal: false,
    confirmButtonText: '确认注销',
    cancelButtonText: '取消',
    success: async (res) => {
      if (res.action !== 'confirm')
        return

      showLoading('正在注销账户...')
      try {
        const result = await cancelAccount()
        hideLoading()
        if (result.isSuccess) {
          toast.success('账户已成功注销')
          setTimeout(() => {
            router.replace({ path: LOGIN_PAGE })
          }, 1500)
        }
      }
      catch {
        hideLoading()
        toast.error('注销失败，请稍后重试')
      }
    },
  })
}
</script>

<template>
  <view class="flex-col flex-1 gap-4 px-4 py-6">
    <!-- 警告图标 -->
    <view class="flex-center">
      <view class="h-20 w-20 flex-center rounded-full bg-red-50">
        <text class="i-carbon:warning-alt-filled text-40px text-red-500" />
      </view>
    </view>

    <!-- 标题 -->
    <view class="text-center">
      <text class="text-18px font-bold">
        注销账户
      </text>
      <text class="mt-2 text-14px text-gray-500">
        请仔细阅读以下说明，注销操作不可逆
      </text>
    </view>

    <!-- 风险说明卡片 -->
    <wd-notice-bar wrapable :scrollable="false" prefix="exclamation-circle-fill" direction="horizontal" custom-class="!rounded-lg">
      <text class="font-bold">
        重要提示：
      </text>账户注销后，以下所有数据将被<text class="font-bold">
        永久删除
      </text>且无法恢复：
    </wd-notice-bar>

    <!-- 将删除的数据列表 -->
    <wd-notice-bar wrapable :scrollable="false" prefix="delete" direction="horizontal" type="info" custom-class="!rounded-lg">
      <wd-text text="将被永久删除的内容：" type="warning" bold size="16px" />
      <view class="mt-4 flex flex-col gap-2">
        <view class="flex items-start gap-1">
          <text class="text-12px text-red-400">
            •
          </text>
          <text class="text-13px text-gray-600">
            账户信息（用户名、邮箱、手机号、密码等）
          </text>
        </view>
        <view class="flex items-start gap-1">
          <text class="text-12px text-red-400">
            •
          </text>
          <text class="text-13px text-gray-600">
            全部财务数据（收支记录、分类标签、预算设定）
          </text>
        </view>
        <view class="flex items-start gap-1">
          <text class="text-12px text-red-400">
            •
          </text>
          <text class="text-13px text-gray-600">
            财务报表与统计数据
          </text>
        </view>
        <view class="flex items-start gap-1">
          <text class="text-12px text-red-400">
            •
          </text>
          <text class="text-13px text-gray-600">
            微信账户关联信息
          </text>
        </view>
        <view class="flex items-start gap-1">
          <text class="text-12px text-red-400">
            •
          </text>
          <text class="text-13px text-gray-600">
            团队协作记录与关系
          </text>
        </view>
      </view>
    </wd-notice-bar>

    <!-- 注销前确认 -->
    <view class="border border-orange-100 rounded-lg bg-orange-50 p-4">
      <view class="flex items-start gap-2">
        <text class="mt-0.5 text-14px text-orange-500">
          !
        </text>
        <view class="flex flex-col gap-1">
          <text class="text-13px text-orange-700 font-medium">
            注销前请确认：
          </text>
          <text class="text-12px text-orange-600">
            • 已导出所有需要的财务数据
          </text>
          <text class="text-12px text-orange-600">
            • 已退出所有团队空间
          </text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="flex flex-col gap-3">
      <wd-button type="danger" round block @click="handleCancelAccount">
        <view class="flex-row items-center gap-2">
          <text class="i-carbon:trash-can" />
          <text>确认注销账户</text>
        </view>
      </wd-button>
      <wd-button type="primary" round plain block @click="router.back()">
        返回设置
      </wd-button>
    </view>
  </view>
</template>
