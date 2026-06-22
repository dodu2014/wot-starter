/** 检测是否接收协议 */
export function checkAccept(agreed: boolean, t: (key: string) => string): Promise<boolean> {
  const { confirm } = useGlobalDialog()
  return new Promise((resolve, reject) => {
    if (agreed) {
      resolve(true)
      return
    }
    confirm({
      title: t('pages.login.agreeAndContinue'),
      msg: t('pages.login.agreePrompt'),
      confirmButtonText: t('pages.login.agree'),
      closeOnClickModal: false,
      success: (e) => {
        if (e.action === 'confirm') {
          agreed = true
          resolve(true)
          return
        }
        reject(new Error('Cancelled'))
      },
      fail: (res) => {
        reject(res)
      },
    })
  })
}
