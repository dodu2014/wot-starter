<script setup lang="ts">
defineOptions({
  name: 'WdEmpty',
  inheritAttrs: true,
})
const baseUrl = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <wd-status-tip :url-prefix="`${baseUrl}/images/default/`" />
</template>

<style lang="scss" scoped>
:deep() {
  .wd-status-tip__image {
    opacity: 0.15;
  }
}
</style>
