<script setup lang="ts">
defineOptions({
  name: 'AppEmpty',
})

withDefaults(
  defineProps<{
    image?: ImageType
    tip?: string
  }>(),
  {
    image: 'network',
  },
)

type ImageType = 'search' | 'network' | 'content' | 'collect' | 'comment' | 'halo' | 'message'

const baseUrl = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <wd-status-tip :url-prefix="`${baseUrl}/images/default/`" custom-class="!op-65" :image="image" :tip="tip" />
</template>
