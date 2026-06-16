import { onMounted, onUnmounted, ref } from 'vue'
import { HubConnectionBuilder } from '@/utils/uni-signalr-client'

/** signalr 配置选项 */
interface SianalrOption {
  /** SignalR 中心的 URL */
  url: string
  /** 立即执行 */
  immediate: boolean
  /** 手动管理模式 — 连接生命周期由外部控制，不绑定 onMounted/onUnmounted */
  manual?: boolean
  /** 连接成功后的回调方法 */
  onConnectedCallback?: () => void
  /** 重连成功后的回调方法 */
  onReconnectedCallback?: () => void
  /** 连接断开后的回调方法 */
  onDisConnectedCallback?: () => void
  /** 访问令牌工厂 */
  accessTokenFactory?: () => string | Promise<string>
  /** 日志记录器 */
  logger?: {
    log: (message: string) => void
    error: (message: string) => void
  }
}

/**
 * 用于管理 SignalR 连接的自定义钩子。
 *
 * @property {Ref<HubConnection | null>} connection - SignalR 连接实例。
 * @property {Ref<boolean>} isConnected - 指示连接是否已建立的 ref。
 * @property {() => Promise<void>} startConnection - 启动 SignalR 连接的方法。
 * @property {() => Promise<void>} stopConnection - 停止 SignalR 连接的方法。
 * @property {(eventName: string, callback: (...args: any[]) => void) => void} addListener - 用于将事件侦听器添加到 SignalR 连接的方法。
 * @property {(eventName: string, callback: (...args: any[]) => void) => void} removeListener - 从 SignalR 连接中删除事件侦听器的方法。
 * @param options - signalr 配置选项。
 * @returns 一个包含 SignalR 连接、连接状态和管理连接的方法的对象。
 */
export function useSignalR(options: SianalrOption) {
  const connection = ref<any>(null)
  const isConnected = ref(false)
  const isReconnected = ref(false)

  /** 内部变量，事件列表，存储通过 addListener 方法注册的事件 */
  let eventList: { eventName: string, func: () => void }[] = []

  /** 重连定时器 */
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  /** 是否正在主动断开连接 */
  let isManualDisconnect = false

  /**
   * 添加一个事件监听器。
   *
   * @param eventName - 事件的名称。
   * @param callback - 当事件触发时调用的回调方法。
   */
  const addListener = (eventName: string, callback: (...args: any[]) => void) => {
    if (connection.value) {
      connection.value.on(eventName, callback)
      eventList.push({ eventName, func: callback })
    }
  }

  /**
   * 移除指定事件的监听器。
   *
   * @param eventName - 事件名称。
   * @param callback - 事件触发时调用的回调方法。
   */
  const removeListener = (eventName: string, callback: (...args: any[]) => void) => {
    if (connection.value) {
      connection.value.off(eventName, callback)
    }
  }

  /** 调度重连 */
  const scheduleReconnect = () => {
    if (reconnectTimer)
      return

    console.log('SignalR reconnecting in 5 seconds...')
    isReconnected.value = true

    reconnectTimer = setTimeout(async () => {
      reconnectTimer = null
      try {
        await connection.value?.start()
        isConnected.value = true
        isReconnected.value = false
        console.log('SignalR reconnected')
        options.onReconnectedCallback?.()
      }
      catch (err) {
        console.error('SignalR reconnect failed:', err)
        scheduleReconnect()
      }
    }, 5000)
  }

  /** 初始化连接 */
  const initailConnection = () => {
    const builder = new HubConnectionBuilder()
      .withUrl(options.url)

    // 配置访问令牌
    if (options.accessTokenFactory) {
      builder.withAccessTokenFactory(options.accessTokenFactory)
    }

    // 配置日志
    if (options.logger) {
      builder.configureLogging(options.logger)
    }
    else {
      builder.configureLogging({
        log: msg => console.log(`[SignalR] ${msg}`),
        error: msg => console.error(`[SignalR] ${msg}`),
      })
    }

    connection.value = builder.build()

    // 注册连接关闭回调
    connection.value.onclose((reason?: string) => {
      isConnected.value = false
      console.log(`SignalR connection closed: ${reason}`)

      if (!isManualDisconnect) {
        // 自动重连
        scheduleReconnect()
      }

      options.onDisConnectedCallback?.()
    })
  }

  /**
   * 如果尚未连接 SignalR 连接，则启动 SignalR 连接。 如果连接无法启动，它将在 5 秒后重试。
   *
   * @returns {Promise<void>} 在连接成功启动时解析的 Promise。
   * @throws 如果连接无法启动，将向控制台记录错误消息。
   */
  const startConnection = async (): Promise<void> => {
    if (!connection.value) {
      initailConnection()
    }

    isManualDisconnect = false

    try {
      await connection.value?.start()
      isConnected.value = true
      options.onConnectedCallback?.()
    }
    catch (err) {
      console.error('启动连接时出错: ', err)
      // 失败时会通过 onclose 触发重连
    }
  }

  /**
   * 停止 SignalR 连接的异步方法。如果当前存在连接，则尝试停止连接并更新连接状态。
   *
   * @returns {Promise<void>} 一个表示异步操作的 Promise 对象。
   * @throws 如果在停止连接时发生错误，则会在控制台输出错误信息。
   */
  const stopConnection = async (): Promise<void> => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    isManualDisconnect = true

    if (connection.value) {
      try {
        await connection.value.stop()
        isConnected.value = false
        console.log('SignalR 已断开')

        // 遍历注销所有注册的事件
        for (const item of eventList) {
          removeListener(item.eventName, item.func)
          console.log('signalr 移除监听', item.eventName)
        }

        eventList = []
        connection.value = null
      }
      catch (err) {
        console.error('停止连接时出错: ', err)
      }
    }
  }

  /**
   * 加入到指定的 SignalR 组。
   *
   * @param groupName - 要加入的组名。
   * @returns 一个表示异步操作的 Promise。
   */
  const joinToGroup = async (groupName: string) => {
    if (isConnected.value)
      await connection.value?.invoke('JoinToGroup', groupName)
  }

  /**
   * 离开指定的 SignalR 组。
   *
   * @param groupName - 要离开的组名。
   * @returns 一个 Promise，表示离开组的异步操作。
   */
  const leaveGroup = async (groupName: string) => {
    if (isConnected.value)
      await connection.value?.invoke('LeaveGroup', groupName)
  }

  if (!options.manual) {
    onMounted(async () => {
      initailConnection()
      if (options.immediate)
        await startConnection()
    })

    onUnmounted(() => {
      stopConnection()
    })
  }

  return {
    connection,
    isConnected,
    isReconnected,
    startConnection,
    stopConnection,
    addListener,
    removeListener,
    joinToGroup,
    leaveGroup,
  }
}
