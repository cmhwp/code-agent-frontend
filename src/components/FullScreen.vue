<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Tooltip } from 'ant-design-vue'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'

const isFullscreen = ref(false)

// 计算标题
const title = computed(() => (isFullscreen.value ? '退出全屏' : '全屏显示'))

// 全屏切换
const toggle = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  // 初始化状态
  isFullscreen.value = !!document.fullscreenElement
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <Tooltip :title="title" placement="bottom">
    <div class="fullscreen-trigger" @click="toggle">
      <FullscreenExitOutlined v-if="isFullscreen" />
      <FullscreenOutlined v-else />
    </div>
  </Tooltip>
</template>

<style scoped>
.fullscreen-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.fullscreen-trigger:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
