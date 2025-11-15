<script lang="ts" setup>
import type { UploadFile, UploadRemoveEvent, UploadSuccessEvent } from 'wot-design-uni/components/wd-upload/types'

defineOptions({ name: 'AppUpload' })

withDefaults(defineProps<{
  /** 限制上传数量，默认1 */
  limit?: number
  /** 是否支持多选, 默认单选，如果最多上传1张时无效 */
  multiple?: boolean
  /** 上传地址 */
  actionUrl?: string
}>(), {
  limit: 1,
  multiple: false,
  actionUrl: import.meta.env.VITE_UPLOAD_URL,
})

const emit = defineEmits<{
  /** 值被更新时触发 */
  update: [string | string[]]
}>()

/** 模型双向绑定 v-model:value */
const model = defineModel<string | string[]>('value', {
  required: true,
  default: () => {
    return undefined
  },
  validator: (value) => {
    if (typeof value === 'string')
      return true
    if (Array.isArray(value))
      return value.every(i => typeof i === 'string')
    return false
  },
})

const filesList = computed<UploadFile[]>(() => {
  if (!model.value)
    return []
  if (typeof model.value === 'string') {
    return [{ url: model.value }]
  }
  else if (Array.isArray(model.value)) {
    return model.value.map(i => ({ url: i }))
  }
  return []
})

function handleSuccessChange({ file }: UploadSuccessEvent) {
  const json = JSON.parse(file.response as string) as { url: string, absUrl: string, data?: any }

  if (typeof model.value === 'string') {
    model.value = json.absUrl
  }
  else if (Array.isArray(model.value)) {
    model.value.push(json.absUrl)
  }
  emit('update', model.value)
}

function handleRemove({ file }: UploadRemoveEvent) {
  if (typeof model.value === 'string') {
    model.value = ''
  }
  else if (Array.isArray(model.value)) {
    const index = model.value.findIndex(i => i === file.url)
    model.value.splice(index, 1)
  }
  emit('update', model.value)
}
</script>

<template>
  <wd-upload :file-list="filesList" image-mode="aspectFill" :action="actionUrl" :limit="limit" :multiple="multiple && limit > 1" @success="handleSuccessChange" @remove="handleRemove" />
</template>

<style lang="scss" scoped>
:deep() {
  .wd-upload__evoke, .wd-upload__preview {
    margin-bottom: 0 !important;
  }
}
</style>
