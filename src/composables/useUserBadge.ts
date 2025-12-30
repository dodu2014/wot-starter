const { setTabbarItem } = useTabbar()

/** 用户角标数据 hook */
export function useUserBadge() {
  /** 用户消息计数 */
  const messageCount = ref(0)

  /** 获取用户消息列表 */
  const { send: getMessageList } = useRequest(
    (userId: string, isRead: boolean = false) =>
      Webapi_Base.userMessage.getUserMessageList({
        params: { toId: userId, isDelete: false, isRead, pageSize: 1 },
      }),
    { immediate: false },
  ).onSuccess(({ data }) => {
    if (data.isSuccess) {
      messageCount.value = +(data.data?.totalItemCount || 0)
      setTabbarItem('my', messageCount.value)
    }
  })

  return {
    /** 用户消息计数 */
    messageCount,
    /** 获取用户消息列表 */
    getMessageList,
  }
}
