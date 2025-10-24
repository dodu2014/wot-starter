import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserProfileInfo } from '@/service/apis/base/globals.d.ts'
import { Webapi_Base } from '@/service/apis'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const GlobalToast = useGlobalToast()

    /* 定义用户信息 */
    const userInfo = ref<UserProfileInfo>()

    /* 设置用户信息 */
    const setUserInfo = (val?: UserProfileInfo) => {
      console.log('设置用户信息', val)
      userInfo.value = val || undefined
    }

    /* 清除用户信息 */
    const clearUserInfo = () => {
      userInfo.value = undefined
    }

    /** 加载用户信息 */
    const loadUserInfo = async () => {
      const { send } = useRequest(() => Webapi_Base.auth.GetProfileInfo()).onError((error) => {
        GlobalToast.error(error.error?.message || '获取用户档案失败')
      })

      const res = await send()
      console.log('加载用户信息', res.data)
      setUserInfo(res.data)
    }

    /* 定义token */
    const token = ref<string>()

    /* 设置用户信息 */
    const setToken = (val?: string) => {
      console.log('设置用户信息', val)
      token.value = val || undefined
    }

    /* 是否登录 */
    const logined = computed(() => {
      return Boolean(token.value && userInfo.value)
    })

    /* 登录 */
    async function login() {
      const { error, send } = useRequest(() => Webapi_Base.auth.Login({ data: { userName: 'admin', password: 'admin999' } })).onError((error) => {
        GlobalToast.error(error.error?.message || '')
      })
      const res = await send()
      if (!error.value) {
        console.log('成功登录', res)
        setToken(res.data.token)
        await loadUserInfo()
      }
    }

    /* 退出登录 */
    async function logout() {
      const { error, send } = useRequest(() => Webapi_Base.auth.Logout()).onError((error) => {
        GlobalToast.error(error.error?.message || '')
      })
      const res = await send()
      if (!error.value) {
        console.log('成功退出登录', res)
        setToken()
        setUserInfo()
      }
    }

    return {
      /* 定义用户信息 */
      userInfo,
      /* 清除用户信息 */
      clearUserInfo,
      /* 加载用户信息 */
      loadUserInfo,
      /* 设置用户信息 */
      setUserInfo,
      /* 定义token */
      token,
      /* 设置token */
      setToken,
      /* 是否登录 */
      logined,
      /* 登录 */
      login,
      /* 退出登录 */
      logout,
    }
  },
  // 持久化
  { persist: true },
)
