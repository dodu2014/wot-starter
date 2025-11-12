import pack from '../../package.json'

const { alert } = useGlobalMessage()
const { loading, close: hideLoading } = useGlobalLoading()

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
  return `v${pack.version}`
  // #endif
}

/**
 * 检测小程序更新
 * @param notUpdatePrompt 没有更新时的提示
 * @returns 版本更新管理器对象
 */
export function checkMiniProgramUpdate(notUpdatePrompt = '') {
  // 小程序更新
  const updateManager = uni.getUpdateManager()
  // 分享到朋友圈时，updateManager 为 null
  if (!updateManager)
    return

  // 检测更新
  updateManager.onCheckForUpdate((res) => {
    // 请求完新版本信息的回调
    console.log('检测小程序更新...', res.hasUpdate)
    if (res.hasUpdate)
      loading('版本更新中..')
    else if (notUpdatePrompt)
      alert(notUpdatePrompt)
  })

  // 应用更新
  updateManager.onUpdateReady(async (res: any) => {
    console.log('onUpdateReady', res)
    hideLoading()
    alert({
      title: '版本更新',
      msg: '新版本已经准备好，是否更新并重启应用？',
      closeOnClickModal: false,
      beforeConfirm: ({ resolve }) => {
        updateManager.applyUpdate()
        resolve(true)
      },
    })
  })

  updateManager.onUpdateFailed((res) => {
    // 新的版本下载失败
    console.log('onUpdateFailed', res)
    hideLoading()
    alert({
      title: '版本更新',
      msg: '新版本下载失败，请检查网络！',
      closeOnClickModal: false,
    })
  })

  return updateManager
}
