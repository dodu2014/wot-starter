<script setup lang="ts">
definePage({
  name: 'my',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '个人中心',
  },
})

const userStore = useUserStore()
const { userInfo, logined } = storeToRefs(userStore)

const router = useRouter()
// 页面跳转方法
function navigateTo(name: string) {
  router.push({
    name,
  })
}

onLoad(async () => {
  console.log('userInfo', userInfo)
  // if (userInfo) {
  //   await userStore.loadUserInfo()
  // }
})
</script>

<template>
  <view class="flex flex-col pt-3">
    <wd-card title="userInfo">
      {{ userInfo || 'null' }}

      <template #footer>
        <view class="flex justify-end gap-12px">
          <wd-button size="small" plain :disabled="logined" @click="userStore.login">
            模拟登录
          </wd-button>
          <wd-button size="small" plain :disabled="!logined" type="error" @click="userStore.logout">
            退出登录
          </wd-button>
        </view>
      </template>
    </wd-card>

    <view>
      <wd-button @click="navigateTo('feedback')">
        测试需要登陆的页面
      </wd-button>
    </view>
  </view>
</template>
