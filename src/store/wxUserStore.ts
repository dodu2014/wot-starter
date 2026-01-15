import type { WxUser } from '@/service/apis/weixin/globals'

export const useWxUserStore = defineStore(
  'wxUserStore',
  () => {
    const wxUserInfo = ref<WxUser>()

    const { send: sendOnLoginByCode } = useRequest(
      (code: string) => Webapi_Weixin.wxOpen.onLogin({ params: { code } }),
      { immediate: false },
    )

    function wxLogin() {
      const { loading, close: hideLoading } = useGlobalLoading()
      return new Promise<WxUser>((resolve, reject) => {
        loading('loading')
        uni.login({
          success: async (res) => {
            console.log('✈️✈️ wxlogin successed.', res)
            if (!res.code) {
              reject(new Error('code is empty'))
              return
            }
            const { isSuccess, message, data } = await sendOnLoginByCode(res.code)
            if (!isSuccess) {
              reject(new Error(message))
              return
            }
            if (!data) {
              reject(new Error('data is empty'))
              return
            }
            wxUserInfo.value = data
            resolve(data)
          },
          complete: () => {
            hideLoading()
          },
        })
      })
    }

    return {
      wxUserInfo,
      wxLogin,
    }
  },

  // 为了调试方便，可在开发环境配置持久化，生产环境不需要
  { persist: false },
)
