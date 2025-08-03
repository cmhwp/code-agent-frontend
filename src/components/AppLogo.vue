<script setup lang="ts">
import { CodeOutlined } from '@ant-design/icons-vue'

interface Props {
  collapsed?: boolean
  theme?: 'light' | 'dark' | 'realDark'
}

withDefaults(defineProps<Props>(), {
  collapsed: false,
  theme: 'dark',
})
</script>

<template>
  <div class="app-logo" :class="{ 'logo-light': theme === 'light' }">
    <div class="logo-content">
      <div class="logo-icon">
        <CodeOutlined class="logo-icon-svg" />
      </div>
      <Transition name="logo-text">
        <span v-show="!collapsed" class="logo-text">管理后台</span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.app-logo {
  height: 64px;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-light {
  border-bottom: 1px solid #f0f0f0;
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-icon-svg {
  color: white;
  font-size: 18px;
}

.logo-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.logo-light .logo-text {
  color: #333;
}

/* Logo 文字动画 */
.logo-text-enter-active,
.logo-text-leave-active {
  transition: all 0.3s ease;
}

.logo-text-enter-from,
.logo-text-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
