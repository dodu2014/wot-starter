import type { SubscribeResult } from './useSubscribeMessage'

export const subscribeEmployeeMessages = {
  工单状态变更提醒: 'VxBDiHXkwFxzuZcXZLcviZpWL2nui8J0sDg-CkX7KWJtlRGaN-psvDHvats8e48b',
}

/** 订阅员工消息名称的联合类型 */
export type SubscribeEmployeeMessage = keyof typeof subscribeEmployeeMessages
/** 订阅员工消息 id 的联合类型 */
export type SubscribeEmployeeMessageId = typeof subscribeEmployeeMessages[SubscribeEmployeeMessage]

/** 订阅员工消息的成功结果 */
export type SubscribeEmployeeMessageSuccessResult = UniApp.RequestSubscribeMessageSuccessCallbackResult & {
  [key in SubscribeEmployeeMessageId]: SubscribeResult
}

/** 订阅员工消息 hook */
export function useSubscribeEmployeeMessage() {
  const { warning } = useGlobalToast()
  const { loading, close: hideLoading } = useGlobalLoading()
  const subscribeResult = ref<SubscribeEmployeeMessageSuccessResult>()

  /** 请求订阅员工消息 */
  async function requestSubscribeEmployeeMessage(...messageIds: SubscribeEmployeeMessage[]) {
    const tmplIds = messageIds.map(key => subscribeEmployeeMessages[key])
    if (!tmplIds || tmplIds.length === 0) {
      warning('没有需要订阅的消息')
      return
    }
    // uni.requestSubscribeMessage 在某些环境下可能直接返回值而非 Promise
    loading({ msg: 'loading' })
    const requestResult = wx.requestSubscribeEmployeeMessage({ tmplIds }) as any
    hideLoading()
    subscribeResult.value = (requestResult instanceof Promise ? await requestResult : requestResult) as unknown as SubscribeEmployeeMessageSuccessResult
  }

  /** 判断订阅员工消息的结果是否为成功 */
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
    subscribeResult,
    requestSubscribeEmployeeMessage,
    isSuccessedSubscribeResult,
  }
}
