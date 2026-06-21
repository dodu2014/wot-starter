<script setup lang="ts">
import dayjs from 'dayjs'
import { useI18nSync } from '@/hooks/useI18nSync'
import router, { LOGIN_PAGE } from '@/router'
import defaultAvatar from '/static/images/devault-avatar.svg'

definePage({
  name: 'my',
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '个人中心',
  },
})

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
    icon: 'user-group',
    path: '/pages/about/index',
    badge: 8,
  },
  {
    title: '邀请加入',
    icon: 'qrcode',
    path: '/pages/about/index',
  },
  {
    title: '功能页面',
    icon: 'apps',
    path: '/pages/feature/index',
  },
])

const {
  theme,
  followSystem,
  toggleTheme,
  currentThemeColor,
  showThemeColorSheet,
  themeColorOptions,
  openThemeColorPicker,
  closeThemeColorPicker,
  selectThemeColor,
  setFollowSystem,
} = useManualTheme()

const isFollowSystem = computed<boolean>({
  get() {
    return followSystem.value
  },
  set(val) {
    setFollowSystem(val)
  },
})

const darkMode = computed({
  get() {
    return theme.value === 'dark'
  },
  set() {
    toggleTheme()
  },
})

const { messageCount, getMessageList } = useUserBadge()
const { wxUserInfo, wxLogin } = useWxUserStore()

// 使用国际化钩子
const { setLocale, currentLang } = useI18nSync()
function handleToggleLanguage(item: LanguageAction) {
  setLocale(item.key)
}
// 控制语言切换弹出层的显示
const showLanguageSwitch = ref(false)
interface LanguageAction {
  name: string
  key: 'zh-CN' | 'en-US'
  color: string
}
// 语言切换选项
const languageActions = computed<LanguageAction[]>(() => [
  {
    name: '中文 🇨🇳',
    key: 'zh-CN',
    color: currentLang.value === 'zh-CN' ? 'var(--wot-primary-6, #0083ff)' : '',
  },
  {
    name: 'English 🇺🇸',
    key: 'en-US',
    color: currentLang.value === 'en-US' ? 'var(--wot-primary-6, #0083ff)' : '',
  },
])

onLoad(async () => {
  if (logined.value && !userInfo.value) {
    await userStore.loadUserInfo()
  }

  // #ifdef MP-WEIXIN
  if (!wxUserInfo)
    await wxLogin()
  // #endif
})

onShow(async () => {
  if (!userStore.isExpired()) {
    // 重新加载用户信息
    await userStore.loadUserInfo()

    // 统计消息列表, 并更新对应消息中心项的角标
    await getMessageList(userInfo.value!.id!)
  }
})
</script>

<template>
  <view class="page">
    <!-- 用户信息头部 -->
    <view class="from-orange/75 to-primary bg-gradient-to-rb text-white">
      <wd-navbar
        :title="$t('pages.my.title')"
        safe-area-inset-top placeholder fixed
        custom-class="!bg-transparent"
        :bordered="false"
      />

      <view class="mx-8 mb-16 mt-4 flex-col gap-y-6">
        <view class="flex items-center gap-4" @click="() => !logined && router.push(LOGIN_PAGE)">
          <wd-img
            :src="logined && userInfo?.avatarUrl || defaultAvatar"
            :width="54" :height="54"
            round
          />
          <view class="mr-auto">
            <view class="text-xl font-semibold">
              {{ logined && (userInfo?.name || userInfo?.userName) || $t('pages.my.userInfo.guestName') }}
            </view>
            <view class="mt-1 text-xs opacity-75">
              {{ logined && (userInfo?.description || $t('pages.my.userInfo.description')) || $t('pages.my.userInfo.login-description') }}
            </view>
          </view>
          <wd-icon v-if="logined" name="settings" size="30px" @click.prevent.stop="() => router.push({ path: '/pages/user/settings' })" />
        </view>

        <!-- 统计信息卡片 -->
        <view v-if="logined" class="grid grid-cols-2 gap-3 rounded-lg bg-white bg-opacity-20 p-3">
          <view class="text-center" @click="() => router.push({ path: '/pages/about/index', query: { type: 1 } })">
            <view class="text-lg font-bold">
              ∫ {{ logined ? userStats.usdt : ' --' }}
            </view>
            <view class="text-xs opacity-90">
              积分
            </view>
          </view>
          <view class="text-center" @click="() => router.push({ path: '/pages/user/wallet', query: { type: 2 } })">
            <view class="text-lg font-bold">
              ¥ {{ logined ? userStats.bond : ' --' }}
            </view>
            <view class="text-xs opacity-90">
              钱包
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="mx-8 mt--10 flex flex-col gap-4">
      <!-- 功能菜单区域 -->
      <wd-card custom-class="rounded-lg overflow-hidden shadow-sm !m-0 !px-0" custom-content-class="!p-2">
        <wd-grid clickable :column="3">
          <wd-grid-item
            v-for="item in gridItems"
            :key="item.title"
            :icon="item.icon"
            :text="item.title"
            :value="item.badge"
            custom-icon="!text-primary"
            custom-class="rounded"
            @itemclick="() => router.push({ path: item.path, query: item.query })"
          />
          <!-- #ifdef MP-WEIXIN -->
          <wd-grid-item custom-icon="text-primary" custom-class="rounded">
            <button open-type="contact" class="button-reset flex-col gap-8px">
              <wd-icon name="mic" size="26px" custom-class="text-primary line-height-37px" />
              <wd-text text="联系客服" size="12px" custom-class="!line-height-12px" />
            </button>
          </wd-grid-item>
        <!-- #endif -->
        </wd-grid>
      </wd-card>

      <!-- 主题设置 -->
      <wd-cell-group insert border custom-class="!mx-0 shadow-md">
        <wd-cell :title="$t('pages.my.themeSetting.auto-mode-title')" center>
          <template #prefix>
            <text class="i-carbon:screen mr-2 text-18px text-primary" />
          </template>
          <view class="flex justify-end">
            <wd-switch v-model="isFollowSystem" size="14px" />
          </view>
        </wd-cell>
        <wd-cell :title="$t('pages.my.themeSetting.dark-mode-title')" center>
          <template #prefix>
            <text v-if="darkMode" class="i-carbon:moon mr-2 text-18px text-primary" />
            <text v-else class="i-carbon:sun mr-2 text-18px text-primary" />
          </template>
          <view class="flex justify-end">
            <wd-switch v-model="darkMode" size="14px" :disabled="isFollowSystem" />
          </view>
        </wd-cell>
        <wd-cell :title="$t('pages.my.themeSetting.custom-theme-title')" is-link @click="openThemeColorPicker">
          <template #prefix>
            <text class="i-carbon:color-palette mr-2 text-18px text-primary" />
          </template>
          <view class="flex items-center justify-end gap-2">
            <view class="h-3 w-3 rounded-full bg-primary" />
            <text>{{ $t(`pages.my.themeSheet.${currentThemeColor.value}`) }}</text>
          </view>
        </wd-cell>
      </wd-cell-group>

      <!-- 更多功能列表 -->
      <wd-cell-group insert border custom-class="!mx-0">
        <wd-cell
          :title="$t('pages.my.otherSetting.language-title')"
          prefix-icon="language"
          custom-prefix-class="!text-primary !mr-2 !text-22px"
          is-link
          @click="showLanguageSwitch = true"
        >
          <wd-text :text="currentLang === 'zh-CN' ? '中文' : 'English'" />
        </wd-cell>
        <wd-cell
          :title="$t('pages.my.controlPanel.message-title')"
          is-link
          center
          prefix-icon="message"
          custom-prefix-class="!text-primary !mr-2 !text-22px"
          @click="() => router.push('/pages/user/message')"
        >
          <wd-badge :value="messageCount" :max="99" />
        </wd-cell>
        <wd-cell
          :title="$t('pages.my.otherSetting.help-title')"
          is-link
          center
          prefix-icon="question-circle"
          custom-prefix-class="!text-primary !mr-2 !text-22px"
          @click="() => router.push({ path: '/pages/article/list', query: { num: '02' } })"
        />
        <wd-cell
          :title="$t('pages.my.otherSetting.about-title')"
          is-link
          center
          prefix-icon="info-circle"
          custom-prefix-class="!text-primary !mr-2 !text-22px"
          @click="() => router.push('/pages/about/index')"
        />
      </wd-cell-group>
    </view>

    <view class="mt-auto flex-center flex-col gap-1 pb-4">
      <wd-text :text="$t('pages.my.description')" size="12px" />
      <wd-text :text="$t('pages.my.copyright', [dayjs().year()])" size="10px" />
    </view>
  </view>

  <wd-action-sheet
    v-model="showLanguageSwitch"
    :actions="languageActions"
    :title="$t('pages.my.languageSheet.title')"
    custom-class="pb-50px"
    @select="({ item }: { item: LanguageAction }) => handleToggleLanguage(item)"
  />

  <!-- 主题色选择 ActionSheet -->
  <wd-action-sheet
    v-model="showThemeColorSheet"
    :title="$t('pages.my.themeSheet.title')"
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
            {{ $t(`pages.my.themeSheet.${option.value}`) }}
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
