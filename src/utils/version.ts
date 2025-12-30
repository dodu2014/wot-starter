import pack from '../../package.json'

export const packVersion = `v${pack.version}`

/** 获取小程序版本信息 */
export function getMiniProgramVersion() {
  // #ifdef MP
  const { miniProgram } = uni.getAccountInfoSync()
  if (miniProgram) {
    switch (miniProgram.envVersion) {
      case 'release':
        return `v${miniProgram.version}`
      case 'develop':
        return '开发版'
      case 'trial':
      default:
        return '体验版'
    }
  }
  // #endif
  // #ifdef APP-PLUS
  return `v${plus.runtime.version}（APP）`
  // #endif
  // #ifdef WEB
  return packVersion
  // #endif
}

/**
 * 检测小程序更新
 * @param notUpdatePrompt 没有更新时的提示
 * @returns 版本更新管理器对象
 */
export function checkMiniProgramUpdate(notUpdatePrompt = '') {
  // 全局消息提示（必须在方法局部定义，全局定义会报错）
  const { alert } = useGlobalMessage()
  const { loading, close: hideLoading } = useGlobalLoading()

  // 返回全局唯一的版本更新管理器对象： updateManager，用于管理小程序更新
  const updateManager = uni.getUpdateManager()
  // 分享到朋友圈时，updateManager 为 null
  if (!updateManager)
    return

  // 当向应用后台请求完新版本信息，会进行回调
  updateManager.onCheckForUpdate((res) => {
    // 请求完新版本信息的回调
    if (res.hasUpdate)
      loading('版本更新中..')
    else if (notUpdatePrompt)
      alert({ msg: notUpdatePrompt, closeOnClickModal: false })
  })

  // 当新版本下载完成，会进行回调
  updateManager.onUpdateReady(async (res: { version?: string }) => {
    hideLoading()
    alert({
      title: '版本更新',
      msg: `新版本 v${res.version || ''} 已经准备好，是否更新并重启应用？`,
      closeOnClickModal: false,
      beforeConfirm: ({ resolve }) => {
        // 当新版本下载完成，调用该方法会强制当前uni-app应用上新版本并重启
        updateManager.applyUpdate()
        resolve(true)
      },
    })
  })

  // 当新版本下载失败，会进行回调
  updateManager.onUpdateFailed((res: { version?: string }) => {
    // 新的版本下载失败
    hideLoading()
    alert({
      title: '版本更新',
      msg: `新版本 v${res.version || ''} 下载失败，请检查网络！`,
      closeOnClickModal: false,
    })
  })

  return updateManager
}
