<script setup lang="ts">
import { onExit } from '@dcloudio/uni-app'
import router from './router'

const { logined, userInfo } = storeToRefs(useUserStore())
const { wxUserInfo, wxLogin } = useWxUserStore()

// #ifdef WEB
const { addListener, joinToGroup, startConnection, stopConnection } = useSignalR({
  url: `${import.meta.env.VITE_API_BASE_URL}/hubs/commonHub`,
  immediate: false,
  onConnectedCallback: async () => {
    console.log('SignalR connected')

    // 加入到组后，会收到组客户端id
    addListener('onJoinToGroup', (clientId: string, groupName: string) => {
      console.log('客户端成功加入到组，客户id', clientId, groupName)
    })

    // 新消息
    addListener('onMessage', (message: any) => {
      console.log('收到SignalR消息', message)
      if (!logined.value) {
        return
      }

      const { confirm } = useGlobalMessage()
      confirm({
        title: '新消息提醒',
        msg: `${message.content}`,
        cancelButtonText: '取消',
        confirmButtonText: '立即查看',
        closeOnClickModal: false,
        type: 'confirm',
        success: (e) => {
          if (e.action === 'confirm') {
            router.push('/pages/about/index')
          }
        },
      })
    })
  },
  onDisConnectedCallback: () => {
    console.log('SignalR disconnected')
  },
})
// #endif

// 监听用户登录状态，以便在用户登录后，加入到用户组
watch(
  () => logined.value,
  (val) => {
    console.log('logined changed', val)
    if (val) {
      // #ifdef WEB
      joinToGroup(`user_${userInfo.value?.id || ''}`)
      // #endif
    }
  },
  {
    immediate: true,
  },
)

onLaunch(async () => {
  // #ifdef MP-WEIXIN
  //  检测小程序更新
  checkMiniProgramUpdate()

  // 检查用户登录状态，未登录则进行微信登录
  if (!wxUserInfo)
    await wxLogin()
  // #endif

  // #ifdef WEB
  // 链接 SignalR
  await startConnection()

  setTimeout(async () => {
    if (logined.value) {
      await joinToGroup(`user_${userInfo.value?.id || ''}`)
    }
  }, 100)
  // #endif
})

onExit(async () => {
  console.log('App onExit called')

  // #ifdef WEB
  // 断开 SignalR 连接
  await stopConnection()
  // #endif
})
</script>

<style lang="scss">
.page-wraper {
  min-height: calc(100vh - var(--window-top));
  box-sizing: border-box;
  background: #f9f9f9;

  display: flex;
  flex-direction: column;
}

.wot-theme-dark.page-wraper {
  background: #222;
}
</style>
