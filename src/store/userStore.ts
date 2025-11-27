import type { AccessTokenModel, LoginModel, UserProfileInfo } from '@/service/apis/base/globals.d.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'wot-design-uni/dayjs'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const toast = useGlobalToast()
    const { close: hideLoading } = useGlobalLoading()

    /** 定义用户信息 */
    const userInfo = ref<UserProfileInfo>()

    /** 定义token */
    const tokenModel = ref<AccessTokenModel>()

    /** 设置用户信息 */
    const setUserInfo = (val?: UserProfileInfo) => {
      console.log('设置用户信息', val)
      userInfo.value = val || undefined
    }

    /* 清除所有信息 */
    const clear = () => {
      userInfo.value = undefined
      tokenModel.value = undefined
    }

    /** 加载用户信息 */
    const loadUserInfo = async () => {
      const { send } = useRequest(() => Webapi_Base.auth.getProfileInfo()).onError((error) => {
        toast.error(error.error?.message || '获取用户档案失败')
      })

      const res = await send()
      console.log('加载用户信息', res.data)
      setUserInfo(res.data)
    }

    /* 设置 token 信息 */
    const setToken = (val?: AccessTokenModel) => {
      console.log('设置 token 信息', val)
      tokenModel.value = val
    }

    // 判断 tokenModel 是否过期
    const tokenIsExpired = computed(() => {
      if (!tokenModel.value || !tokenModel.value.token || !tokenModel.value.expiration)
        return true
      return dayjs().valueOf() >= dayjs(tokenModel.value.expiration).valueOf() // 过期
    })

    /* 是否登录 */
    const logined = computed(() => {
      return Boolean(!tokenIsExpired.value && userInfo.value)
    })

    /* 登录请求 */
    const { send: sendLoginRequest } = useRequest((model: LoginModel) => Webapi_Base.auth.login({ params: {}, data: model }))
      .onError((error) => {
        toast.error(error.error?.message || '')
      })
      .onComplete(() => {
        hideLoading()
      })
    /** 登录 */
    async function login(model: LoginModel) {
      const { isSuccess, data } = await sendLoginRequest(model)
      if (isSuccess) {
        console.log('成功登录', data)
        setToken(data)
        await loadUserInfo()
      }
      return { isSuccess, data }
    }

    /** 简易登录 */
    async function easyLogin(phoneNumber: string, userId = '', openId = '', unionId = '') {
      const { send } = useRequest(
        (phoneNumber: string, userId = '', openId = '', unionId = '') => Webapi_Base.auth.easyLogin({ params: { phoneNumber, userId, openId, unionId } }),
        { immediate: false },
      ).onError((error) => {
        toast.error(error.error?.message || '登录失败')
      }).onComplete(() => {
        hideLoading()
      })
      const { isSuccess, data } = await send(phoneNumber, userId, openId, unionId)
      if (isSuccess) {
        setToken(data)
        await loadUserInfo()
      }
      return { isSuccess, data }
    }

    /** 退出登录 */
    async function logout() {
      const { error, send } = useRequest(() => Webapi_Base.auth.logout()).onError((error) => {
        toast.error(error.error?.message || '')
      })
      const res = await send()
      if (!error.value) {
        console.log('成功退出登录', res)
        clear()
      }
    }

    return {
      /** 定义用户信息 */
      userInfo,
      /** 清除用户信息 */
      clear,
      /** 加载用户信息 */
      loadUserInfo,
      /** 设置用户信息 */
      setUserInfo,
      /** 定义token */
      tokenModel,
      /** 设置token */
      setToken,
      /** 是否登录 */
      logined,
      /** 登录 */
      login,
      /** 简易登录 */
      easyLogin,
      /** 退出登录 */
      logout,
    }
  },
  // 持久化
  { persist: true },
)
