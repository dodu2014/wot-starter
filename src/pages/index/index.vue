<script setup lang="ts">
definePage({
  name: 'home',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
  },
})

const swiperList = ref([
  'https://wot-ui.cn/assets/redpanda.jpg',
  'https://wot-ui.cn/assets/capybara.jpg',
  'https://wot-ui.cn/assets/panda.jpg',
  'https://wot-ui.cn/assets/moon.jpg',
  'https://wot-ui.cn/assets/meng.jpg',
])

const textArray = ref([
  '欢迎使用wot design uni',
  '该组件库基于uniapp ->Vue3, ts构建',
  '项目地址：https://github.com/Moonofweisheng/wot-design-uni',
  '我们的目标是打造最强uniapp组件库',
  '诚挚邀请大家共同建设',
  '这是一条消息提示信息，这是一条消息提示信息，这是一条消息提示信息，这是一条消息提示信息，这是一条消息提示信息',
])
</script>

<template>
  <view class="flex-col gap-y-3 p-4">
    <!--  -->
    <wd-swiper :list="swiperList" autoplay :indicator="{ type: 'dots-bar' }" />

    <wd-notice-bar prefix="notification-filled" direction="vertical" :text="textArray" :delay="3" custom-class="space" />

    <view class="flex items-center gap-2">
      <wd-icon name="order-descending" size="18px" />
      <wd-text text="市场排行榜" type="primary" bold size="18px" />
      <wd-text text="TOP 10" type="warning" bold size="12px" class="self-start" />
    </view>

    <wd-tabs animated slidable="auto" custom-class="!rounded-2 overflow-hidden">
      <template v-for="item in ['今日', '本周', '本月']" :key="item">
        <wd-tab :title="`${item}`" :name="item">
          <wd-cell-group class="cell-value-center">
            <wd-cell v-for="(item1, index) in 10" :key="index" :title="`标题文字${item1}`" :value="item1">
              <template #icon>
                <wd-icon name="user-avatar" size="20" class="mr-2 self-center" />
              </template>
            </wd-cell>
          </wd-cell-group>
        </wd-tab>
      </template>
    </wd-tabs>
  </view>
</template>
