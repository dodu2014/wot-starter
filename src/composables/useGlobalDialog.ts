import type { DialogBoxButtonOption, DialogOptions, DialogResult } from '@wot-ui/ui/components/wd-dialog/types'
import { defineStore } from 'pinia'

export type GlobalDialogOptions = DialogOptions & {
  success?: (res: DialogResult) => void
  fail?: (res: DialogResult) => void
}

interface GlobalDialog {
  dialogOptions: GlobalDialogOptions | null
  currentPage: string
}

type DialogType = NonNullable<DialogOptions['type']>

function isButtonPropsObject(value: unknown): value is Record<string, any> {
  return value !== null && CommonUtil.isObj(value)
}

function normalizeButtonProps(props: DialogBoxButtonOption | undefined, text?: string): DialogBoxButtonOption | undefined {
  if (isButtonPropsObject(props)) {
    return {
      ...props,
      variant: 'base',
      ...(text ? { text } : {}),
    }
  }

  if (!props) {
    return {
      variant: 'base',
      ...(text ? { text } : {}),
    }
  }

  return props
}

function withDefaultTypeOptions(option: GlobalDialogOptions, type?: DialogType): GlobalDialogOptions {
  const next: GlobalDialogOptions = {
    ...option,
    ...(type ? { type } : {}),
  }

  if (next.showCancelButton === undefined) {
    if (next.type === 'alert') {
      next.showCancelButton = false
    }
    else if (next.type === 'confirm' || next.type === 'prompt') {
      next.showCancelButton = true
    }
  }

  return next
}

function normalizeDialogOptions(option: GlobalDialogOptions, type?: DialogType): GlobalDialogOptions {
  const next = withDefaultTypeOptions(option, type)

  const props = next.confirmButtonProps ? next.confirmButtonProps : {}
  next.confirmButtonProps = normalizeButtonProps({ ...props as object, customClass: '!bg-primary-gradient' }, next.confirmButtonText) as DialogOptions['confirmButtonProps']

  if (next.showCancelButton === false) {
    next.cancelButtonProps = null
  }
  else if (next.showCancelButton === true || next.cancelButtonProps !== undefined || next.cancelButtonText) {
    next.cancelButtonProps = normalizeButtonProps(next.cancelButtonProps, next.cancelButtonText) as DialogOptions['cancelButtonProps']
  }

  return next
}

function normalizeOption(option: GlobalDialogOptions | string, type?: DialogType): GlobalDialogOptions {
  return normalizeDialogOptions(CommonUtil.isString(option) ? { title: option } : option, type)
}

export const useGlobalDialog = defineStore('global-Dialog', {
  state: (): GlobalDialog => ({
    dialogOptions: null,
    currentPage: '',
  }),
  actions: {
    show(option: GlobalDialogOptions | string, type?: DialogType) {
      this.currentPage = getCurrentPath()
      this.dialogOptions = normalizeOption(option, type)
    },
    /**
     * 显示异步消息对话框, options 中的 success 和 fail 回调将被忽略
     * @param {GlobalDialogOptions | string} option - 消息选项对象或消息标题字符串
     * @returns {Promise<DialogResult>} 返回一个 Promise，当用户点击确认按钮时 resolve，点击取消或关闭时 reject
     * @throws {DialogResult} 当用户取消操作或对话框失败时抛出 DialogResult 对象
     */
    showAsync(option: GlobalDialogOptions | string, type?: DialogType): Promise<DialogResult> {
      return new Promise<DialogResult>((resolve, reject) => {
        this.currentPage = getCurrentPath()
        this.dialogOptions = {
          ...normalizeOption(option, type),
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
      this.show(option, 'alert')
    },
    confirm(option: GlobalDialogOptions | string) {
      this.show(option, 'confirm')
    },
    /**
     * 异步显示确认对话框
     * @param {GlobalDialogOptions | string} option - 消息选项对象或标题字符串
     * @returns {Promise<DialogResult>} 返回用户操作结果的 Promise
     */
    async confirmAsync(option: GlobalDialogOptions | string): Promise<DialogResult> {
      return await this.showAsync(option, 'confirm')
    },
    prompt(option: GlobalDialogOptions | string) {
      this.show(option, 'prompt')
    },
    close() {
      this.dialogOptions = null
      this.currentPage = ''
    },
  },
})
