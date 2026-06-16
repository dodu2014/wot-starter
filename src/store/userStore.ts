import type { AccessTokenModel, LoginModel, RegisterByEmailModel, UserProfileInfo } from '@/service/apis/base/globals.d.ts'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router, { LOGIN_PAGE } from '@/router'

export const useUserStore = defineStore(
  'userStore',
  () => {
    const toast = useGlobalToast()
    const { close: hideLoading } = useGlobalLoading()
    const { alert } = useGlobalDialog()

    const route = useRoute()

    /** 定义用户信息 */
    const userInfo = ref<UserProfileInfo>()

    /** 定义token */
    const tokenModel = ref<AccessTokenModel>()

    /** 设置用户信息 */
    const setUserInfo = (val?: UserProfileInfo) => {
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
      setUserInfo(res?.data as UserProfileInfo | undefined)
    }

    /* 设置 token 信息 */
    const setToken = (val?: AccessTokenModel) => {
      console.log('设置 token 信息', val)
      tokenModel.value = val
    }

    // 验证是否过期
    function isExpired() {
      if (!tokenModel.value || !tokenModel.value.token || !tokenModel.value.expiration)
        return true
      const expired = dayjs().valueOf() >= dayjs(tokenModel.value.expiration).valueOf()
      console.log('☑️☑️ userStore: token is expired?', expired)
      if (expired) {
        clear()
      }
      return expired // 是否过期
    }

    /* 是否登录 */
    const logined = computed(() => {
      return !isExpired() && Boolean(userInfo.value)
    })

    /* 登录请求 */
    const { send: sendLoginRequest } = useRequest(
      (model: LoginModel, openId?: string) => Webapi_Base.auth.login({ params: { openId }, data: model }),
      { immediate: false },
    ).onError((error) => {
      toast.error(error.error?.message || '')
    }).onComplete(() => {
      hideLoading()
    })
    /** 登录 */
    async function login(model: LoginModel, openId?: string) {
      const { isSuccess, data } = await sendLoginRequest(model, openId)
      if (isSuccess) {
        console.log('成功登录', data)
        setToken(data!)
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
        setToken(data!)
        await loadUserInfo()
      }
      return { isSuccess, data }
    }

    /** 退出登录 */
    async function logout() {
      const { error, send } = useRequest(() => Webapi_Base.auth.logout(), { immediate: false }).onError((error) => {
        toast.error(error.error?.message || '')
      })
      const res = await send()
      if (!error.value) {
        console.log('成功退出登录', res)
        clear()
      }
    }

    /** 注册请求 */
    const { send: sendRegisterRequest } = useRequest(
      (data: RegisterByEmailModel, role: string) => Webapi_Base.auth.register({ data, headers: { role } }),
      { immediate: false },
    ).onSuccess((res) => {
      console.log('注册成功', res)
    }).onError((res) => {
      console.log('注册失败', res)
      toast.warning(res.error?.message || 'Registration failed...')
    }).onComplete(() => {
      hideLoading()
    })

    /** 注册 */
    async function register(model: RegisterByEmailModel, role: string) {
      try {
        const res = await sendRegisterRequest(model, encodeURIComponent(role))
        return { isSuccess: res?.isSuccess, data: res?.data }
      }
      catch (err: any) {
        // toast.error(err?.error?.message || 'Registration failed')
        return { isSuccess: false, error: err }
      }
    }

    /**
     * 检查用户登录状态，未登录时显示提示弹窗并跳转到登录页面
     * @returns {Promise<void>} 已登录时 resolve，未登录时 reject
     * @throws {Error} 当用户未登录时抛出错误，错误信息为"未授权"
     */
    function unLoginAlert(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        if (logined.value) {
          resolve()
          return
        }
        alert({
          title: '未经授权',
          msg: '当前页面需要你先登录方可继续。',
          confirmButtonText: '立即登录',
          confirmButtonProps: {
            icon: 'login',
          },
          closeOnClickModal: false,
          success() {
            let query = ``
            if (route.query) {
              const keys = Object.keys(route.query) // 获取对象的key 返回对象key的数组
              query = keys.reduce((pre, cur) => `${pre + cur}=${route.query[cur]}&`, '?').slice(0, -1)
            }
            router.replace({
              path: LOGIN_PAGE,
              query: {
                redirect: `/${getCurrentPath()}${query}`,
              },
            })
          },
        })
        reject(new Error('未授权'))
      })
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
      /** 是否过期 */
      isExpired,
      /** 登录 */
      login,
      /** 简易登录 */
      easyLogin,
      /** 退出登录 */
      logout,
      /** 注册 */
      register,
      /** 检查用户登录状态，未登录时显示提示弹窗并跳转到登录页面 */
      unLoginAlert,
    }
  },
  // 持久化
  { persist: true },
)
