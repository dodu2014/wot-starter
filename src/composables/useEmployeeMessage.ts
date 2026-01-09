import type { SubscribeResult } from './useSubscribeMessage'

export const employeeMessages = {
  工单状态变更提醒: 'VxBDiHXkwFxzuZcXZLcviZpWL2nui8J0sDg-CkX7KWJtlRGaN-psvDHvats8e48b',
}

/** 订阅用工消息名称的联合类型 */
export type EmployeeMessage = keyof typeof employeeMessages
/** 订阅用工消息 id 的联合类型 */
export type EmployeeMessageId = typeof employeeMessages[EmployeeMessage]

/** 订阅用工消息的成功结果 */
export type EmployeeMessageSuccessResult = UniApp.RequestSubscribeMessageSuccessCallbackResult & {
  [key in EmployeeMessageId]: SubscribeResult
}

type BindStatus = WechatMiniprogram.CheckEmployeeRelationSuccessCallbackResult['bindingStatus']

/** 封装的用工消息 hook */
export function useEmployeeMessage(options?: {
  /** 绑定成功回调 */
  checkSuccessCallback?: (status: BindStatus) => void
}) {
  /** 订阅消息名称 */
  const messageIds = ref<string[]>([])
  const bindStatus = ref<BindStatus>('')
  const { warning, success } = useGlobalToast()
  const { loading, close: hideLoading } = useGlobalLoading()
  const subscribeResult = ref<EmployeeMessageSuccessResult>()

  /** 绑定用工关系 */
  function bindEmployeeRelation(...messages: EmployeeMessage[]) {
    const tmplIds = messages.map(key => employeeMessages[key])
    if (!tmplIds || tmplIds.length === 0) {
      warning('没有需要订阅的消息')
      return
    }
    messageIds.value = tmplIds

    loading({ msg: 'loading' })
    wx.bindEmployeeRelation({
      tmplIds,
      success(res) {
        console.log('bindEmployeeRelation success', res)
        // 绑定成功，通过检查再次确认绑定状态
        checkEmployeeRelation()
      },
      fail(res) {
        if (res.errMsg.includes('current platform is not supported')) {
          warning('绑定失败：当前平台不受支持')
          return
        }
        warning(res.errMsg)
      },
      complete() {
        hideLoading()
      },
    })
  }

  /** 检查用工关系状态 */
  function checkEmployeeRelation() {
    loading({ msg: 'loading' })
    wx.checkEmployeeRelation({
      async success(res) {
        bindStatus.value = res.bindingStatus
        if (res.bindingStatus === 'accept')
          success('已授权用工关系')
        else
          warning('未授权用工关系')
        options?.checkSuccessCallback?.(res.bindingStatus)
      },
      fail(res) {
        if (res.errMsg.includes('current platform is not supported')) {
          warning('检测失败：当前平台不受支持')
          return
        }
        warning(res.errMsg)
      },
      complete() {
        hideLoading()
      },
    })
  }

  /** 请求订阅用工消息 */
  async function requestSubscribeEmployeeMessage(...messages: EmployeeMessage[]) {
    const tmplIds = messages.map(key => employeeMessages[key])
    if (!tmplIds || tmplIds.length === 0) {
      warning('没有需要订阅的消息')
      return
    }
    // uni.requestSubscribeMessage 在某些环境下可能直接返回值而非 Promise
    loading({ msg: 'loading' })
    wx.requestSubscribeEmployeeMessage({
      tmplIds,
      success(res) {
        if (res.bindingStatus === 'accept')
          success('订阅成功')
      },
      fail(res) {
        if (res.errMsg.includes('current platform is not supported')) {
          warning('检测失败：当前平台不受支持')
        }
      },
      complete() {
        hideLoading()
      },
    })
  }

  /** 判断用工消息的订阅结果是否为成功 */
  function isSuccessedSubscribeResult(): boolean {
    // 遍历结果中除 errMsg 的 key，判断其值是否全部为 accept，只要包含 reject 则返回 false
    for (const key in subscribeResult.value) {
      // 判断是否为 SubscribeMessageId 类型
      if (key === 'errMsg')
        continue
      if (subscribeResult.value[key] === 'reject') {
        warning('需要同意所有订阅')
        return false
      }
    }
    return true
  }

  return {
    bindStatus,
    subscribeResult,
    bindEmployeeRelation,
    checkEmployeeRelation,
    requestSubscribeEmployeeMessage,
    isSuccessedSubscribeResult,
  }
}
