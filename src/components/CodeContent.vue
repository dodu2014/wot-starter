<script setup lang="ts">
defineOptions({ name: 'CodeContent' })

defineProps({
  // 是否显示 icon
  showIcon: {
    type: Boolean,
    default: true,
  },
})

// 改为使用 defineSlots 定义插槽，说明参考：https://code.ifrontend.net/archives/1058
const slots = defineSlots<Slots>()
type SlotFn = (props?: Record<string, unknown>) => any
interface Slots {
  /**
   * Slot
   *
   * The default content of the components
   */
  default?: SlotFn
  /**
   * Slot
   *
   * The pre html element of the components
   */
  pre?: SlotFn
}
const hasPre = computed(() => Boolean(slots.pre))

const { success, warning } = useGlobalToast()

// 复制代码到剪贴板
function copy() {
  const defaultSlots = slots.default?.() || []
  const preSlots = slots.pre?.() || []
  const data = hasPre.value ? preSlots.map((slot: any) => slot.children).join('') : defaultSlots.map((slot: any) => slot.children).join('')
  if (!data) {
    warning({ msg: '没有找到代码内容' })
    return
  }
  uni.setClipboardData({
    data,
    showToast: false,
    success: () => {
      uni.hideToast()
      success({ msg: '代码已复制到剪贴板' })
    },
  })
}
</script>

<template>
  <view
    class="border border-gray-200 rounded-2 bg-gray-50 p-3 dark:border-[var(--wot-dark-border)] dark:bg-[var(--wot-dark-background3)]"
    @click="copy"
  >
    <view class="flex items-center justify-between">
      <text class="text-3 text-gray-700 dark:text-[var(--wot-dark-color)]" :class="{ 'font-bold': hasPre }">
        <slot />
      </text>
      <wd-icon v-if="showIcon" name="file-copy" size="16px" color="#666" />
    </view>
    <view v-if="hasPre" class="mt-2 max-h-60 overflow-y-auto">
      <pre class="whitespace-pre-wrap text-2.5 text-gray-600 leading-relaxed font-mono !indent-0 dark:text-[var(--wot-dark-color2)]"><slot name="pre" /></pre>
    </view>
  </view>
</template>
