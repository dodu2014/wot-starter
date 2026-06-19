import type { DialogOptions, DialogResult } from '@wot-ui/ui/components/wd-dialog/types'
import { defineStore } from 'pinia'

export type GlobalDialogOptions = DialogOptions & {
  success?: (res: DialogResult) => void
  fail?: (res: DialogResult) => void
}

interface GlobalDialog {
  dialogOptions: GlobalDialogOptions | null
  currentPage: string
}

export const useGlobalDialog = defineStore('global-Dialog', {
  state: (): GlobalDialog => ({
    dialogOptions: null,
    currentPage: '',
  }),
  actions: {
    show(option: GlobalDialogOptions | string) {
      const opt = (CommonUtil.isString(option) ? { title: option } : option)
      opt.cancelButtonProps = {
        text: opt.cancelButtonText,
        round: false,
        variant: 'base',
        ...opt.cancelButtonProps as any,
      }
      opt.confirmButtonProps = {
        text: opt.confirmButtonText,
        customClass: '!bg-primary-gradient',
        round: false,
        ...opt.confirmButtonProps as any,
      }
      this.currentPage = getCurrentPath()
      this.dialogOptions = {
        ...opt,
      }
    },
    /**
     * 显示异步消息对话框, options 中的 success 和 fail 回调将被忽略
     * @param {GlobalDialogOptions | string} option - 消息选项对象或消息标题字符串
     * @returns {Promise<DialogResult>} 返回一个 Promise，当用户点击确认按钮时 resolve，点击取消或关闭时 reject
     * @throws {DialogResult} 当用户取消操作或对话框失败时抛出 DialogResult 对象
     */
    showAsync(option: GlobalDialogOptions | string): Promise<DialogResult> {
      return new Promise<DialogResult>((resolve, reject) => {
        const opt = (CommonUtil.isString(option) ? { title: option } : option)
        opt.cancelButtonProps = {
          text: opt.cancelButtonText,
          round: false,
          variant: 'base',
          ...opt.cancelButtonProps as any,
        }
        opt.confirmButtonProps = {
          text: opt.confirmButtonText,
          customClass: '!bg-primary-gradient',
          round: false,
          ...opt.confirmButtonProps as any,
        }
        this.currentPage = getCurrentPath()
        this.dialogOptions = {
          ...opt,
          success(res) {
            resolve(res)
          },
          fail(res) {
            reject(res)
          },
        }
      })
    },
    alert(option: GlobalDialogOptions | string) {
      const DialogOptions = CommonUtil.deepMerge({ type: 'alert' }, CommonUtil.isString(option) ? { title: option } : option) as DialogOptions
      DialogOptions.showCancelButton = false
      this.show(DialogOptions)
    },
    confirm(option: GlobalDialogOptions | string) {
      const DialogOptions = CommonUtil.deepMerge({ type: 'confirm' }, CommonUtil.isString(option) ? { title: option } : option) as DialogOptions
      DialogOptions.showCancelButton = true
      this.show(DialogOptions)
    },
    /**
     * 异步显示确认对话框
     * @param {GlobalDialogOptions | string} option - 消息选项对象或标题字符串
     * @returns {Promise<DialogResult>} 返回用户操作结果的 Promise
     */
    async confirmAsync(option: GlobalDialogOptions | string): Promise<DialogResult> {
      const messageOptions = CommonUtil.deepMerge({ type: 'confirm' }, CommonUtil.isString(option) ? { title: option } : option) as DialogOptions
      messageOptions.showCancelButton = true
      return await this.showAsync(messageOptions)
    },
    prompt(option: GlobalDialogOptions | string) {
      const DialogOptions = CommonUtil.deepMerge({ type: 'prompt' }, CommonUtil.isString(option) ? { title: option } : option) as DialogOptions
      DialogOptions.showCancelButton = true
      this.show(DialogOptions)
    },
    close() {
      this.dialogOptions = null
      this.currentPage = ''
    },
  },
})
