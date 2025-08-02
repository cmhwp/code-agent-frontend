<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 应用初始化
onMounted(() => {
  // 尝试从 localStorage 恢复用户登录状态
  userStore.restoreUser()
})
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* 全局样式 */
#app {
  min-height: 100vh;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ant Design 全局样式调整 */
.ant-message {
  z-index: 9999;
}

.ant-notification {
  z-index: 9999;
}

/* 响应式字体大小 */
@media (max-width: 640px) {
  html {
    font-size: 14px;
  }
}
</style>
