<script setup lang="ts">
import defaultAvatar from '/static/logo.png'

definePage({
  name: 'my',
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '个人中心',
  },
})

const { confirm } = useGlobalMessage()
const userStore = useUserStore()
const { userInfo, logined } = storeToRefs(userStore)

const router = useRouter()

// 模拟数据 - 积分、余额、订单数量、团队成员
const userStats = ref({
  points: 1250,
  balance: 888.88,
  orders: 15,
  teamMembers: 8,
})

// 功能菜单项
const menuItems = ref([
  {
    title: '我的订单',
    icon: 'list',
    path: '/pages/order/list',
    badge: 3,
  },
  {
    title: '我的团队',
    icon: 'usergroup',
    path: '/pages/team/list',
    badge: 8,
  },
  {
    title: '积分商城',
    icon: 'gift',
    path: '/pages/points/mall',
  },
  {
    title: '账户设置',
    icon: 'setting1',
    path: '/pages/settings/index',
  },
  {
    title: '帮助中心',
    icon: 'help-circle',
    path: '/pages/help/index',
  },
  {
    title: '关于我们',
    icon: 'info-circle',
    path: '/pages/about/index',
  },
])

// 页面跳转方法
function navigateTo(path: string) {
  router.push({ path })
}

// 跳转到登录页面
function toLogin() {
  if (!logined.value) {
    router.push({ path: '/pages/login/index' })
  }
}

function logout() {
  confirm({
    title: '退出登录',
    msg: '确定要退出登录吗？',
    closeOnClickModal: false,
    confirmButtonText: '退出登录',
    cancelButtonText: '取消',
    success: async (res) => {
      console.log('res', res)
      if (res.action === 'confirm')
        await userStore.logout()
    },
  })
}

// 编辑用户信息
function editProfile() {
  uni.showToast({
    title: '编辑用户信息',
    icon: 'none',
  })
}

onLoad(async () => {
  if (logined.value && !userInfo.value) {
    await userStore.loadUserInfo()
  }
})
</script>

<template>
  <view class="page">
    <!-- 用户信息头部 -->
    <view class="from-orange-600 to-red-700 bg-gradient-to-r text-white">
      <wd-navbar
        title="个人中心"
        safeareainsettop placeholder fixed
        custom-style="background-color: transparent !important;"
        :bordered="false"
      />

      <view class="mx-8 mb-12 mt-4 flex-col gap-y-6">
        <view class="flex items-center justify-between" @click="toLogin">
          <view class="flex items-center">
            <wd-img
              :src="userInfo?.avatarUrl || defaultAvatar"
              :width="54" :height="54"
              round
              class="mr-4 border-2 border-white"
            />
            <view>
              <view class="text-xl font-semibold">
                {{ userInfo?.name || userInfo?.userName || '未登录用户' }}
              </view>
              <view class="mt-1 text-sm opacity-75">
                {{ userInfo?.description || '点击此处登录' }}
              </view>
            </view>
          </view>
          <wd-icon name="setting1" size="30px" @click.prevent="editProfile" />
        </view>

        <!-- 统计信息卡片 -->
        <view class="grid grid-cols-2 gap-3 rounded-lg bg-white bg-opacity-20 p-3">
          <view class="text-center">
            <view class="text-lg font-bold">
              ₮{{ logined ? userStats.points : ' --' }}
            </view>
            <view class="text-xs opacity-90">
              USDT
            </view>
          </view>
          <view class="text-center">
            <view class="text-lg font-bold">
              ${{ logined ? userStats.balance : ' --' }}
            </view>
            <view class="text-xs opacity-90">
              美债
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单区域 -->
    <wd-card class="rounded-lg shadow-sm !mx-8 !-mt-6">
      <view class="grid grid-cols-3 gap-3">
        <view
          v-for="item in menuItems.slice(0, 3)"
          :key="item.title"
          class="flex flex-col items-center py-3"
          @click="navigateTo(item.path)"
        >
          <wd-icon :name="item.icon" size="24px" class="mb-2 text-#d7421a" />
          <wd-text :text="item.title" size="12px" />
        </view>
      </view>
    </wd-card>

    <!-- 更多功能列表 -->
    <demo-block custom-card-class="!mx-8 !mt-4" custom-card-content-class="!p-0">
      <wd-cell-group border>
        <wd-cell
          v-for="item in menuItems.slice(3)"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          is-link
          @click="navigateTo(item.path)"
        />
      </wd-cell-group>
    </demo-block>

    <!-- 退出登录/操作区域 -->
    <view v-if="logined" class="mt-6 text-center">
      <wd-button plain size="small" type="error" @click="logout">
        <wd-icon name="logout" class="mr-1" />
        退出登录
      </wd-button>
    </view>

    <!-- 底部安全提示 -->
    <view class="mt-8 pb-4 text-center text-xs text-gray-400" hidden>
      <view>账号安全已保护</view>
      <view>最后登录时间：{{ userInfo?.date || '--' }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  // background: linear-gradient(115deg, #bcd3e8 0%, #94d0d3 100%);
  background: url('/static/images/bg-user.png') no-repeat center center / cover;
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
