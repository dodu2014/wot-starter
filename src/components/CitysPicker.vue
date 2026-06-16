<script setup lang="ts">
import type { CellAsteriskPosition } from '@wot-ui/ui/components/wd-cell/types'

defineOptions({ name: 'CitysPicker' })

// eslint-disable-next-line unused-imports/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  title: '行政区域',
  titleWidth: '75px',
})

const emit = defineEmits<{
  confirm: [value: string[], labels: string[]]
}>()

interface Props {
  title?: string
  titleWidth?: string | number
  /** 表单域 model 字段名 */
  prop?: string
  required?: boolean
  asteriskPosition?: CellAsteriskPosition
  hideAsterisk?: boolean
  ellipsis?: boolean
}

const { colPickerData } = useColPickerData()

const model = defineModel<string[]>('value', { default: () => [] })
const modelLabels = defineModel<string[]>('labels', { default: () => [] })

/**
 * 最后一列选项选中时触发
 *
 * @param e - 事件对象
 * @param e.value - 选项值数组
 * @param e.selectedItems - 选项数组 ({ value, label })
 */
function handleConfirm(e: { value: string[], selectedItems: { value: string, text: string }[] }): void {
  const { selectedItems } = e
  modelLabels.value = selectedItems.map(item => item.text)
  emit('confirm', model.value, modelLabels.value)
}

const showPicker = ref(false)
function togglePicker(): void {
  showPicker.value = !showPicker.value
}

const result: string[] = []
function getChildren(data?: CascaderOption[]) {
  if (!data || !data.length)
    return
  result.push(data[0]!.value)
  getChildren(data[0]?.children)
}

onMounted(() => {
  if (!model.value || !model.value.length) {
    getChildren(colPickerData)
    model.value = [...result]
  }
})
</script>

<template>
  <wd-form-item
    :title="title"
    :title-width="titleWidth"
    :required="required"
    :asterisk-position="asteriskPosition"
    :hide-asterisk="hideAsterisk"
    :ellipsis="ellipsis"
    :prop="prop"
    is-link
    @click="togglePicker"
  >
    <view v-if="modelLabels && modelLabels.length">
      {{ modelLabels.join('/') }}
    </view>
    <wd-text v-else text="请选择……" />
  </wd-form-item>
  <wd-picker
    v-model="model"
    v-model:visible="showPicker"
    :columns="colPickerData"
    label-key="text"
    value-key="value"
    children-key="children"
    cascade
    auto-complete
    @confirm="handleConfirm"
  />
</template>
