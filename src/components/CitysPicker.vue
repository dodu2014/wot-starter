<script setup lang="ts">
import type { ColPickerColumnChangeOption } from 'wot-design-uni/components/wd-col-picker/types'

defineOptions({ name: 'CitysPicker' })

// eslint-disable-next-line unused-imports/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  label: '行政区域',
  labelWidth: '75px',
  required: false,
  markerSide: 'after',
})

const emit = defineEmits<{
  confirm: [value: string[], labels: string[]]
}>()

const model = defineModel<string[]>('value', { default: () => [] })
const modelLabels = defineModel<string[]>('labels', { default: () => [] })

interface Props {
  label?: string
  labelWidth?: string
  required?: boolean
  markerSide?: 'before' | 'after'
  prop?: string
}
const { colPickerData, findChildrenByCode } = useColPickerData()
const columns = ref<any[]>([
  colPickerData.map(item => ({ value: item.value, label: item.text })),
])
function columnChange({ selectedItem, resolve, finish }: ColPickerColumnChangeOption) {
  console.log(selectedItem, resolve, finish)
  const areaData = findChildrenByCode(colPickerData, selectedItem.value)
  if (areaData && areaData.length) {
    resolve(areaData.map(item => ({ value: item.value, label: item.text })))
  }
  else {
    finish()
  }
}

/**
 * 最后一列选项选中时触发
 *
 * @param e - 事件对象
 * @param e.value - 选项值数组
 * @param e.selectedItems - 选项数组 ({ value, label })
 */
function handleConfirm(e: { value: string[], selectedItems: { value: string, label: string }[] }): void {
  const { selectedItems } = e
  modelLabels.value = selectedItems.map(item => item.label)
  emit('confirm', model.value, modelLabels.value)
}
</script>

<template>
  <wd-col-picker
    v-model="model"
    :label="label"
    :label-width="labelWidth"
    :prop="prop"
    :required="required"
    :marker-side="markerSide"
    :columns="columns"
    :column-change="columnChange"
    auto-complete
    @confirm="handleConfirm"
  />
</template>
