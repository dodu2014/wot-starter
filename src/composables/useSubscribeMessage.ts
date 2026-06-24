export const subscribeMessages = {
  业务受理通知: 'DUXCLkKe8W2V4Ds_cbblte8ALyn6265yRA9a3gTqmAU',
}

/** 订阅消息名称的联合类型 */
export type SubscribeMessage = keyof typeof subscribeMessages
/** 订阅消息 id 的联合类型 */
export type SubscribeMessageId = (typeof subscribeMessages)[SubscribeMessage]
/** 订阅消息的结果 */
export type SubscribeResult = 'accept' | 'reject'

/** 订阅消息的成功结果 */
export type SubscribeMessageSuccessResult = UniApp.RequestSubscribeMessageSuccessCallbackResult & {
  [key in SubscribeMessageId]: SubscribeResult
}

/** 订阅消息 hook */
export function useSubscribeMessage() {
  const { warning } = useGlobalToast()
  const { loading, close: hideLoading } = useGlobalLoading()
  const subscribeResult = ref<SubscribeMessageSuccessResult>()

  /** 请求订阅消息 */
  async function requestSubscribeMessage(...messageIds: SubscribeMessage[]) {
    return new Promise<void>((resolve, reject) => {
      const tmplIds = messageIds.map(key => subscribeMessages[key])
      if (!tmplIds || tmplIds.length === 0) {
        warning('没有需要订阅的消息')
        reject(new Error('没有需要订阅的消息'))
        return
      }
      // uni.requestSubscribeMessage 在某些环境下可能直接返回值而非 Promise
      loading({ msg: 'loading' })
      uni.requestSubscribeMessage({
        tmplIds,
        success(res) {
          console.log('订阅成功', res)
          subscribeResult.value = res as unknown as SubscribeMessageSuccessResult
          if (isSuccessedSubscribeResult()) resolve()
          else reject(new Error('订阅失败'))
        },
        fail(err) {
          reject(new Error(err.errMsg))
        },
        complete() {
          console.log('订阅完成')
          hideLoading()
        },
      })
    })
  }

  /** 判断订阅消息的结果是否为成功 */
  function isSuccessedSubscribeResult(): boolean {
    // 遍历结果中除 errMsg 的 key，判断其值是否全部为 accept，只要包含 reject 则返回 false
    for (const key in subscribeResult.value) {
      // 判断是否为 SubscribeMessageId 类型
      if (key === 'errMsg') continue
      if (subscribeResult.value[key] === 'reject') {
        warning('需要同意所有订阅')
        return false
      }
    }
    return true
  }

  return {
    subscribeResult,
    requestSubscribeMessage,
    isSuccessedSubscribeResult,
  }
}
