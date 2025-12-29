<script setup lang="ts">
import { onExit } from '@dcloudio/uni-app'
import router from './router'

const { logined, userInfo } = storeToRefs(useUserStore())

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

onLaunch(async () => {
  // #ifdef MP-WEIXIN
  checkMiniProgramUpdate()
  // #endif

  // #ifdef WEB
  await startConnection()

  uni.$on('signalR-joinToGroup', async (groupName: string) => {
    await joinToGroup(groupName)
  })

  setTimeout(async () => {
    if (logined.value) {
      await joinToGroup(`user_${userInfo.value?.id || ''}`)
    }
  }, 100)
  // #endif
})

onExit(async () => {
  console.log('App onExit called')
  await stopConnection()

  // #ifdef WEB
  uni.$off('signalR-joinToGroup')
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
