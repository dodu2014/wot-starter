<script setup lang="ts">
import router, { LOGIN_PAGE } from '@/router'
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

// 模拟数据 - 积分、余额、订单数量、团队成员
const userStats = ref({
  usdt: 0,
  bond: 0,
  orders: 15,
  teamMembers: 8,
})

// 功能菜单项
interface MenuItem {
  title: string
  icon: string
  path: _LocationUrl
  query?: Record<string, string | number>
  badge?: number
}
const gridItems = ref<MenuItem[]>([
  {
    title: '我的订单',
    icon: 'list',
    path: '/pages/about/index',
    badge: 3,
  },
  {
    title: '团队成员',
    icon: 'usergroup',
    path: '/pages/about/index',
    badge: 8,
  },
  {
    title: '邀请加入',
    icon: 'qrcode',
    path: '/pages/about/index',
  },
])
const moreItems = ref<MenuItem[]>([
  {
    title: '消息中心',
    icon: 'chat1',
    path: '/pages/about/index',
  },
  // {
  //   title: '账户设置',
  //   icon: 'setting1',
  //   path: '/pages/user/settings',
  // },
  {
    title: '帮助中心',
    icon: 'help-circle',
    path: '/pages/article/list',
    query: {
      num: '02',
    },
  },
  {
    title: '关于我们',
    icon: 'info-circle',
    path: '/pages/about/index',
  },
])

const {
  theme,
  toggleTheme,
  currentThemeColor,
  showThemeColorSheet,
  themeColorOptions,
  openThemeColorPicker,
  closeThemeColorPicker,
  selectThemeColor,
} = useManualTheme()

const darkMode = computed({
  get() {
    return theme.value === 'dark'
  },
  set() {
    toggleTheme()
  },
})

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

onLoad(async () => {
  if (logined.value && !userInfo.value) {
    await userStore.loadUserInfo()
  }
})

onShow(async () => {
  if (logined.value) {
    //
  }
})
</script>

<template>
  <view class="page">
    <!-- 用户信息头部 -->
    <view class="from-orange/75 to-primary bg-gradient-to-rb text-white">
      <wd-navbar
        title="个人中心"
        safe-area-inset-top placeholder fixed
        custom-class="!bg-transparent"
        :bordered="false"
      />

      <view class="mx-8 mb-16 mt-4 flex-col gap-y-6">
        <view class="flex items-center gap-4" @click="() => !logined && router.push(LOGIN_PAGE)">
          <wd-img
            :src="userInfo?.avatarUrl || defaultAvatar"
            :width="54" :height="54"
            round
            class="border-2 border-white"
          />
          <view class="mr-auto">
            <view class="text-xl font-semibold">
              {{ userInfo?.name || userInfo?.userName || '未登录用户' }}
            </view>
            <view class="mt-1 text-xs opacity-75">
              {{ !logined ? '点击此处登录' : userInfo?.description || '这家伙很懒，什么都没有写' }}
            </view>
          </view>
          <wd-icon v-if="logined" name="setting1" size="30px" @click.prevent.stop="() => router.push({ path: '/pages/user/settings' })" />
        </view>

        <!-- 统计信息卡片 -->
        <view v-if="logined" class="grid grid-cols-2 gap-3 rounded-lg bg-white bg-opacity-20 p-3">
          <view class="text-center" @click="() => router.push({ path: '/pages/about/index', query: { type: 1 } })">
            <view class="text-lg font-bold">
              ₮ {{ logined ? userStats.usdt : ' --' }}
            </view>
            <view class="text-xs opacity-90">
              USDT
            </view>
          </view>
          <view class="text-center" @click="() => router.push({ path: '/pages/about/index', query: { type: 2 } })">
            <view class="text-lg font-bold">
              $ {{ logined ? userStats.bond : ' --' }}
            </view>
            <view class="text-xs opacity-90">
              美债
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单区域 -->
    <wd-card custom-class="rounded-lg overflow-hidden shadow-sm !mx-8 !mt--10 !mb-0 !px-0" custom-content-class="!p-2">
      <wd-grid clickable :column="3">
        <wd-grid-item
          v-for="item in gridItems"
          :key="item.title"
          :icon="item.icon"
          :text="item.title"
          :value="item.badge"
          custom-icon="text-primary"
          custom-class="rounded"
          @itemclick="() => router.push({ path: item.path, query: item.query })"
        />
        <!-- #ifdef MP-WEIXIN -->
        <wd-grid-item custom-icon="text-primary" custom-class="rounded">
          <button open-type="contact" class="button-reset flex-col gap-8px">
            <wd-icon name="service" size="26px" custom-class="text-primary line-height-37px" />
            <wd-text text="联系客服" size="12px" custom-class="!line-height-12px" />
          </button>
        </wd-grid-item>
        <!-- #endif -->
      </wd-grid>
    </wd-card>

    <!-- 主题设置 -->
    <demo-block custom-card-class="!mx-8 !mt-4" custom-card-content-class="!p-0">
      <wd-cell-group border custom-class="rounded-2! overflow-hidden">
        <wd-cell title="暗黑模式" center>
          <view class="flex justify-end">
            <wd-switch v-model="darkMode" size="14px" />
          </view>
        </wd-cell>
        <wd-cell title="选择主题色" is-link @click="openThemeColorPicker">
          <view class="flex items-center justify-end gap-2">
            <view class="h-3 w-3 rounded-full bg-primary" />
            <text>{{ currentThemeColor.name }}</text>
          </view>
        </wd-cell>
      </wd-cell-group>
    </demo-block>

    <!-- 更多功能列表 -->
    <demo-block custom-card-class="!mx-8 !mt-4" custom-card-content-class="!p-0">
      <wd-cell-group border>
        <!-- #ifdef MP-WEIXIN -->
        <button class="button-reset" open-type="openSetting">
          <wd-cell title="授权设置" value="小程序" icon="setting1" is-link center />
        </button>
        <button class="button-reset" open-type="feedback">
          <wd-cell title="用户反馈" icon="chat1" is-link center />
        </button>
        <!-- #endif -->
        <wd-cell
          v-for="item in moreItems"
          :key="item.title"
          :title="item.title"
          :icon="item.icon"
          is-link
          @click="() => router.push({ path: item.path, query: item.query })"
        />
      </wd-cell-group>
    </demo-block>

    <!-- 退出登录/操作区域 -->
    <view v-if="logined" class="mt-6 text-center">
      <wd-button plain size="small" type="primary" @click="logout">
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

  <!-- 主题色选择 ActionSheet -->
  <wd-action-sheet
    v-model="showThemeColorSheet"
    title="选择主题色"
    :close-on-click-action="true"
    @cancel="closeThemeColorPicker"
  >
    <view class="px-4 pb-4">
      <view
        v-for="option in themeColorOptions"
        :key="option.value"
        class="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0 dark:border-gray-700"
        @click="selectThemeColor(option)"
      >
        <view class="flex items-center gap-3">
          <view
            class="h-3 w-3 border-1 border-gray-200 rounded-full dark:border-gray-600"
            :style="{ backgroundColor: option.primary }"
          />
          <text class="text-4 text-gray-800 dark:text-gray-200">
            {{ option.name }}
          </text>
        </view>
        <wd-icon
          v-if="currentThemeColor.value === option.value"
          name="check"
          :color="option.primary"
          size="20px"
        />
      </view>
    </view>
    <wd-gap :height="50" />
  </wd-action-sheet>
</template>

<style lang="scss" scoped>
.page {
  background: $user-bg-url no-repeat center center / cover;
  background-attachment: fixed;

  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
