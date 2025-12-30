const { confirm } = useGlobalMessage()

/** 检测是否接收协议 */
export function checkAccept(agreed: boolean): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (agreed) {
      resolve(true)
      return
    }
    confirm({
      title: '同意并继续',
      msg: '请确认以及阅读且同意‘用户服务协议’和‘隐私政策’',
      confirmButtonText: '已阅读',
      closeOnClickModal: false,
      success: (e) => {
        if (e.action === 'confirm') {
          agreed = true
          resolve(true)
          return
        }
        reject(new Error('已取消'))
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}
