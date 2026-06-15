// uni-signalr-client.ts

/**
 * SignalR 消息协议类型定义
 */
enum MessageType {
  Invocation = 1,
  StreamItem = 2,
  Completion = 3,
  StreamInvocation = 4,
  CancelInvocation = 5,
  Ping = 6,
  Close = 7,
}

interface HubMessage {
  type: MessageType
}

interface InvocationMessage extends HubMessage {
  invocationId?: string
  target: string
  arguments: any[]
}

interface CompletionMessage extends HubMessage {
  invocationId: string
  error?: string
  result?: any
}

// eslint-disable-next-line unused-imports/no-unused-vars
interface StreamItemMessage extends HubMessage {
  invocationId: string
  item?: any
}

interface PingMessage extends HubMessage {
  type: MessageType.Ping
}

interface CloseMessage extends HubMessage {
  error?: string
}

interface NegotiateResponse {
  connectionId: string
  availableTransports: {
    transport: string
    transferFormats: string[]
  }[]
  url?: string
  accessToken?: string
}

interface Callback {
  (...args: any[]): void
}

interface PendingCall {
  resolve: (value: any) => void
  reject: (reason?: any) => void
  methodName: string
}

/**
 * 配置选项
 */
interface UniSignalROptions {
  /** 访问令牌工厂函数 */
  accessTokenFactory?: () => string | Promise<string>
  /** 是否跳过协商（直接使用 WebSocket）默认 false */
  skipNegotiation?: boolean
  /** 日志记录器 */
  logger?: {
    log: (message: string) => void
    error: (message: string) => void
  }
  /** 握手超时时间（毫秒）默认 15000 */
  handshakeTimeout?: number
  /** 调用超时时间（毫秒）默认 30000 */
  invokeTimeout?: number
}

/**
 * UniApp SignalR 客户端
 * 基于 uni.connectSocket 实现，兼容 @microsoft/signalr API
 */
export class HubConnection {
  private url: string
  private options: Required<UniSignalROptions>
  private socketTask: UniApp.SocketTask | null = null
  private connectionId: string | null = null
  private state: 'disconnected' | 'connecting' | 'connected' = 'disconnected'
  private eventHandlers: Map<string, Set<Callback>> = new Map()
  private pendingCalls: Map<string, PendingCall> = new Map()
  private closeCallbacks: Set<Callback> = new Set()
  private nextInvocationId = 0
  private handshakeTimer: any = null
  private pingInterval: any = null
  private accessToken: string | null = null

  constructor(url: string, options: UniSignalROptions = {}) {
    this.url = url
    this.options = {
      accessTokenFactory: options.accessTokenFactory || (() => ''),
      skipNegotiation: options.skipNegotiation || false,
      logger: options.logger || {
        log: msg => console.log(`[SignalR] ${msg}`),
        error: msg => console.error(`[SignalR] ${msg}`),
      },
      handshakeTimeout: options.handshakeTimeout || 15000,
      invokeTimeout: options.invokeTimeout || 30000,
    }
  }

  /**
   * 启动连接（协商 + WebSocket + 握手）
   */
  public start(): Promise<void> {
    if (this.state === 'connected') {
      return Promise.resolve()
    }
    if (this.state === 'connecting') {
      return new Promise((resolve, reject) => {
        const checkState = setInterval(() => {
          if (this.state === 'connected') {
            clearInterval(checkState)
            resolve()
          }
          else if (this.state === 'disconnected') {
            clearInterval(checkState)
            reject(new Error('Connection failed'))
          }
        }, 100)
      })
    }

    this.state = 'connecting'
    this.options.logger.log('Starting connection...')

    return this.getAccessToken()
      .then((token) => {
        this.accessToken = token
        if (this.options.skipNegotiation) {
          return this.startWebSocket()
        }
        else {
          return this.negotiate().then(() => this.startWebSocket())
        }
      })
      .then(() => this.handshake())
      .then(() => {
        this.state = 'connected'
        this.options.logger.log('Connection established')
        this.startPingInterval()
      })
      .catch((err) => {
        this.state = 'disconnected'
        this.options.logger.error(`Start failed: ${err.message}`)
        throw err
      })
  }

  /**
   * 停止连接
   */
  public async stop(): Promise<void> {
    if (this.state === 'disconnected')
      return

    this.options.logger.log('Stopping connection...')
    if (this.pingInterval)
      clearInterval(this.pingInterval)
    if (this.handshakeTimer)
      clearTimeout(this.handshakeTimer)

    if (this.socketTask) {
      return new Promise((resolve) => {
        if (this.socketTask) {
          this.socketTask.close({
            success: () => {
              this.cleanup()
              resolve()
            },
            fail: (err) => {
              this.options.logger.error(`Close failed: ${err.errMsg}`)
              this.cleanup()
              resolve()
            },
          })
        }
        else {
          this.cleanup()
          resolve()
        }
      })
    }
    else {
      this.cleanup()
      return Promise.resolve()
    }
  }

  /**
   * 调用服务端方法（等待返回值）
   */
  public invoke(methodName: string, ...args: any[]): Promise<any> {
    if (this.state !== 'connected') {
      return Promise.reject(new Error('Connection not started'))
    }

    const invocationId = this.generateInvocationId()
    const message: InvocationMessage = {
      type: MessageType.Invocation,
      invocationId,
      target: methodName,
      arguments: args,
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        if (this.pendingCalls.has(invocationId)) {
          this.pendingCalls.delete(invocationId)
          reject(new Error(`Invocation timeout: ${methodName}`))
        }
      }, this.options.invokeTimeout)
    })

    const callPromise = new Promise<any>((resolve, reject) => {
      this.pendingCalls.set(invocationId, { resolve, reject, methodName })
      this.sendMessage(message).catch((err) => {
        this.pendingCalls.delete(invocationId)
        reject(err)
      })
    })

    return Promise.race([callPromise, timeoutPromise])
  }

  /**
   * 发送调用（不等待返回值）
   */
  public send(methodName: string, ...args: any[]): Promise<void> {
    if (this.state !== 'connected') {
      return Promise.reject(new Error('Connection not started'))
    }

    const message: InvocationMessage = {
      type: MessageType.Invocation,
      target: methodName,
      arguments: args,
    }

    return this.sendMessage(message)
  }

  /**
   * 注册客户端方法（供服务端调用）
   */
  public on(eventName: string, callback: Callback): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, new Set())
    }
    this.eventHandlers.get(eventName)!.add(callback)
  }

  /**
   * 移除客户端方法
   */
  public off(eventName: string, callback?: Callback): void {
    if (!callback) {
      this.eventHandlers.delete(eventName)
      return
    }
    const handlers = this.eventHandlers.get(eventName)
    if (handlers) {
      handlers.delete(callback)
      if (handlers.size === 0)
        this.eventHandlers.delete(eventName)
    }
  }

  /**
   * 注册连接关闭回调
   */
  public onclose(callback: Callback): void {
    this.closeCallbacks.add(callback)
  }

  // ==================== 私有方法 ====================

  private async getAccessToken(): Promise<string> {
    const factory = this.options.accessTokenFactory
    if (!factory)
      return ''
    const token = await factory()
    return token || ''
  }

  /** 在 URL 的 path 与 query 之间插入 /negotiate，避免 /path?query/negotiate 错误 */
  private buildNegotiateUrl(): string {
    const qIdx = this.url.indexOf('?')
    if (qIdx === -1)
      return `${this.url}/negotiate`
    return `${this.url.slice(0, qIdx)}/negotiate${this.url.slice(qIdx)}`
  }

  private async negotiate(): Promise<void> {
    const negotiateUrl = this.buildNegotiateUrl()
    const headers: Record<string, string> = {}
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    this.options.logger.log(`Negotiating with ${negotiateUrl}`)

    return new Promise((resolve, reject) => {
      uni.request({
        url: negotiateUrl,
        method: 'POST',
        header: headers,
        success: (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Negotiate failed: HTTP ${res.statusCode}`))
            return
          }
          const data = res.data as NegotiateResponse
          // ASP.NET Core 8+ 对纯 WebSocket 连接可能返回 connectionId: 0，
          // 使用 != null 而非 !data.connectionId 避免 0 被误判为 falsy
          if (data.connectionId == null) {
            reject(new Error('Invalid negotiate response'))
            return
          }
          this.connectionId = data.connectionId
          this.options.logger.log(`Negotiate success, connectionId: ${this.connectionId}`)
          resolve()
        },
        fail: (err) => {
          reject(new Error(`Negotiate request failed: ${err.errMsg}`))
        },
      })
    })
  }

  private startWebSocket(): Promise<void> {
    const wsUrl = this.buildWebSocketUrl()
    this.options.logger.log(`Connecting WebSocket: ${wsUrl}`)

    return new Promise((resolve, reject) => {
      this.socketTask = uni.connectSocket({
        url: wsUrl,
        header: this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {},
        success: () => {
          this.options.logger.log('WebSocket task created')
        },
        fail: (err) => {
          this.options.logger.error(`WebSocket connect failed: ${err.errMsg}`)
          reject(new Error(`WebSocket connect failed: ${err.errMsg}`))
        },
      })

      // 监听连接打开 - 等待连接完全建立后再 resolve
      this.socketTask.onOpen(() => {
        this.options.logger.log('WebSocket opened, waiting for connection ready...')
        // uni-app 需要等待一小段时间确保 WebSocket 完全就绪
        setTimeout(() => {
          this.options.logger.log('WebSocket connection ready')
          resolve()
        }, 100)
      })

      // 监听错误
      this.socketTask.onError((err) => {
        this.options.logger.error(`WebSocket error: ${err.errMsg}`)
        this.stop().catch(() => {})
        this.notifyClose(err.errMsg)
        reject(new Error(`WebSocket error: ${err.errMsg}`))
      })

      // 监听关闭
      this.socketTask.onClose((res) => {
        this.options.logger.log(`WebSocket closed: code=${res.code}, reason=${res.reason}`)
        this.stop().catch(() => {})
        this.notifyClose(res.reason || 'Connection closed')
      })
    })
  }

  private buildWebSocketUrl(): string {
    let wsUrl = this.url.replace(/^http/, 'ws')
    if (!this.options.skipNegotiation && this.connectionId) {
      const separator = wsUrl.includes('?') ? '&' : '?'
      wsUrl = `${wsUrl}${separator}id=${this.connectionId}`
    }
    if (this.accessToken) {
      const separator = wsUrl.includes('?') ? '&' : '?'
      wsUrl = `${wsUrl}${separator}access_token=${encodeURIComponent(this.accessToken)}`
    }
    return wsUrl
  }

  private async handshake(): Promise<void> {
    const handshakeMessage = `${JSON.stringify({ protocol: 'json', version: 1 })}\x1E`
    this.options.logger.log('Sending handshake')

    await new Promise<void>((resolve, reject) => {
      this.handshakeTimer = setTimeout(() => {
        reject(new Error('Handshake timeout'))
      }, this.options.handshakeTimeout)

      // 握手成功的标记
      let handshakeCompleted = false

      const completeHandshake = () => {
        if (handshakeCompleted)
          return
        handshakeCompleted = true
        clearTimeout(this.handshakeTimer)
        this.options.logger.log('Handshake acknowledged')
        // 切换到正常消息处理器
        this.socketTask!.onMessage(msg => this.processMessage(msg.data))
        resolve()
      }

      // 握手期间的消息处理器
      const handleHandshakeMessage = (res: { data: string | ArrayBuffer }) => {
        let data = typeof res.data === 'string' ? res.data : this.arrayBufferToString(res.data)
        this.options.logger.log(`Handshake received: ${data}`)
        // 去除记录分隔符 \x1E
        // eslint-disable-next-line no-control-regex
        data = data.replace(/\x1E$/, '')
        if (!data) {
          this.options.logger.log('Empty handshake message, ignoring')
          return
        }
        try {
          const parsed = JSON.parse(data)
          // 标准握手响应: { "protocol": "json", "version": 1 }
          if (parsed.protocol === 'json' && parsed.version === 1) {
            completeHandshake()
          }
          // 错误响应
          else if (parsed.error) {
            reject(new Error(`Handshake error: ${parsed.error}`))
          }
          // 关闭消息
          else if (parsed.type === MessageType.Close) {
            reject(new Error(`Handshake closed: ${parsed.error || 'Unknown'}`))
          }
          // 其他消息（Ping 或空响应）- 认为握手已成功
          // 某些服务器在握手后立即发送 Ping 或跳过显式握手响应
          else {
            this.options.logger.log(`Received non-handshake message, assuming handshake complete`)
            completeHandshake()
            // 处理这条消息
            this.processMessage(data)
          }
        }
        catch (err: any) {
          reject(new Error(`Invalid handshake response: ${data}, error: ${err.message}`))
        }
      }

      // 注册握手消息处理器
      this.socketTask!.onMessage(handleHandshakeMessage)

      // 发送握手消息
      this.socketTask!.send({
        data: handshakeMessage,
        success: () => {
          this.options.logger.log('Handshake message sent successfully')
        },
        fail: (err) => {
          clearTimeout(this.handshakeTimer)
          reject(new Error(`Send handshake failed: ${err.errMsg}`))
        },
      })
    })
  }

  private sendMessage(message: HubMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socketTask || this.state !== 'connected') {
        reject(new Error('WebSocket not connected'))
        return
      }
      // SignalR JSON 协议要求每条消息以记录分隔符 0x1E 结尾
      const data = `${JSON.stringify(message)}\x1E`
      this.socketTask.send({
        data,
        success: () => resolve(),
        fail: err => reject(new Error(`Send failed: ${err.errMsg}`)),
      })
    })
  }

  private processMessage(data: string | ArrayBuffer) {
    const messageData = typeof data === 'string' ? data : this.arrayBufferToString(data)
    this.options.logger.log(`Received: ${messageData}`)

    // 按记录分隔符拆分消息
    const messages = messageData.split('\x1E').filter(msg => msg.trim())

    for (const msgStr of messages) {
      let message: HubMessage
      try {
        message = JSON.parse(msgStr)
      }
      catch (e: any) {
        this.options.logger.error(`Invalid JSON: ${msgStr}, error: ${e.message}`)
        continue
      }

      switch (message.type) {
        case MessageType.Invocation:
          this.handleInvocation(message as InvocationMessage)
          break
        case MessageType.Completion:
          this.handleCompletion(message as CompletionMessage)
          break
        case MessageType.StreamItem:
          // 简化处理，暂不支持流
          this.options.logger.log('StreamItem ignored')
          break
        case MessageType.Ping:
          // 响应 Ping 消息（通常服务器不需要回复，但若需要可发送空消息）
          break
        case MessageType.Close:
          this.handleClose(message as CloseMessage)
          break
        default:
          this.options.logger.log(`Unknown message type: ${message.type}`)
      }
    }
  }

  private handleInvocation(message: InvocationMessage) {
    const handlers = this.eventHandlers.get(message.target)
    if (handlers && handlers.size > 0) {
      handlers.forEach((cb) => {
        try {
          cb(...message.arguments)
        }
        catch (err) {
          this.options.logger.error(`Client callback error: ${err}`)
        }
      })
      // 如果 invocationId 存在，需要返回完成消息（非必要，SignalR 协议中客户端调用不要求返回）
      if (message.invocationId) {
        const completion: CompletionMessage = {
          type: MessageType.Completion,
          invocationId: message.invocationId,
        }
        this.sendMessage(completion).catch(err => this.options.logger.error(`Failed to send completion: ${err}`))
      }
    }
    else {
      this.options.logger.log(`No handler for method: ${message.target}`)
      // 若存在 invocationId 应返回错误
      if (message.invocationId) {
        const errorMsg: CompletionMessage = {
          type: MessageType.Completion,
          invocationId: message.invocationId,
          error: `No method '${message.target}' found`,
        }
        this.sendMessage(errorMsg).catch(err => this.options.logger.error(`Failed to send error: ${err}`))
      }
    }
  }

  private handleCompletion(message: CompletionMessage) {
    const pending = this.pendingCalls.get(message.invocationId)
    if (pending) {
      this.pendingCalls.delete(message.invocationId)
      if (message.error) {
        pending.reject(new Error(message.error))
      }
      else {
        pending.resolve(message.result)
      }
    }
    else {
      this.options.logger.log(`No pending call for invocationId: ${message.invocationId}`)
    }
  }

  private handleClose(message: CloseMessage) {
    this.options.logger.log(`Connection closed by server: ${message.error || 'No error'}`)
    this.stop().catch(() => {})
    this.notifyClose(message.error || 'Closed by server')
  }

  private startPingInterval() {
    // 每 15 秒发送一次 Ping 保持连接（可选）
    this.pingInterval = setInterval(() => {
      if (this.state === 'connected') {
        const ping: PingMessage = { type: MessageType.Ping }
        this.sendMessage(ping).catch(err => this.options.logger.error(`Ping failed: ${err}`))
      }
    }, 15000)
  }

  private generateInvocationId(): string {
    return `${Date.now()}_${this.nextInvocationId++}`
  }

  private arrayBufferToString(buffer: ArrayBuffer): string {
    if (typeof TextDecoder !== 'undefined') {
      const decoder = new TextDecoder('utf-8')
      return decoder.decode(new Uint8Array(buffer))
    }
    else {
      // Fallback for environments without TextDecoder
      const uint8Array = new Uint8Array(buffer)
      let result = ''
      for (let i = 0; i < uint8Array.length; i++) {
        result += String.fromCharCode(uint8Array[i] as number)
      }
      // Attempt UTF-8 decoding (basic)
      try {
        return decodeURIComponent(escape(result))
      }
      catch {
        return result // Return as-is if decoding fails
      }
    }
  }

  private cleanup() {
    if (this.socketTask) {
      try {
        this.socketTask.close({})
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (e: any) {}
      this.socketTask = null
    }
    this.state = 'disconnected'
    this.connectionId = null
    if (this.pingInterval)
      clearInterval(this.pingInterval)
    if (this.handshakeTimer)
      clearTimeout(this.handshakeTimer)
    this.pendingCalls.forEach((call, id) => {
      call.reject(new Error('Connection closed'))
      this.pendingCalls.delete(id)
    })
    this.eventHandlers.clear()
  }

  private notifyClose(error?: string) {
    this.closeCallbacks.forEach((cb) => {
      try {
        cb(error)
      }
      catch (err) {
        this.options.logger.error(`Close callback error: ${err}`)
      }
    })
  }
}

/**
 * 构建器（与官方 API 对齐）
 */
export class HubConnectionBuilder {
  private url: string = ''
  private options: UniSignalROptions = {}

  withUrl(url: string): this {
    this.url = url
    return this
  }

  configureLogging(logger: UniSignalROptions['logger']): this {
    this.options.logger = logger
    return this
  }

  withAccessTokenFactory(factory: () => string | Promise<string>): this {
    this.options.accessTokenFactory = factory
    return this
  }

  withSkipNegotiation(skip: boolean): this {
    this.options.skipNegotiation = skip
    return this
  }

  build(): HubConnection {
    if (!this.url) {
      throw new Error('URL is required')
    }
    return new HubConnection(this.url, this.options)
  }
}
