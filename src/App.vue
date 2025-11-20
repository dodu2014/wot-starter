<script setup lang="ts">
onLaunch(() => {
  // #ifdef MP-WEIXIN
  checkMiniProgramUpdate()
  // #endif
})
</script>

<style lang="scss">
.page-wraper {
  min-height: calc(100vh - var(--window-top));
  box-sizing: border-box;
  background: #f9f9f9;

  display: flex;
  flex-direction: column;
}

.wot-theme-dark.page-wraper {
  background: #222;
}
</style>
