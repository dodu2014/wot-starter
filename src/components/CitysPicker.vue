<script setup lang="ts">
import type { CellProps } from '@wot-ui/ui/components/wd-cell/types'

defineOptions({ name: 'CitysPicker' })

// eslint-disable-next-line unused-imports/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  title: '行政区域',
  labelWidth: '75px',
})

const emit = defineEmits<{
  confirm: [value: string[], labels: string[]]
}>()

const model = defineModel<string[]>('value', { default: () => [] })
const modelLabels = defineModel<string[]>('labels', { default: () => [] })

interface Props extends CellProps {
}
const { colPickerData } = useColPickerData()
const columns = ref<any[]>([
  colPickerData.map(item => ({ value: item.value, label: item.text })),
])

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
  <wd-cell :title="title" :title-width="labelWidth" :required="required" :asterisk-position="asteriskPosition" :hide-asterisk="hideAsterisk" :ellipsis="ellipsis" :value="value" is-link />
  <wd-picker
    v-model="model"
    :columns="columns"
    cascade
    auto-complete
    @confirm="handleConfirm"
  />
</template>
