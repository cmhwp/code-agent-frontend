<script setup lang="ts">
import { Card } from 'ant-design-vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full transform rotate-12"></div>
      <div class="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-indigo-100/30 to-pink-100/30 rounded-full transform -rotate-12"></div>
    </div>

    <!-- 主要内容容器 -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo 区域 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">代码生成助手</h1>
        <p class="text-gray-600 text-sm">AI 驱动的智能代码生成平台</p>
      </div>

      <!-- 登录/注册卡片 -->
      <Card
        class="shadow-xl border-0 backdrop-blur-sm bg-white/90"
        :body-style="{ padding: '32px' }"
      >
      <router-view />
      </Card>

      <!-- 底部信息 -->
      <div class="text-center mt-8 text-gray-500 text-xs">
        <p>© 2024 代码生成助手. 保留所有权利.</p>
        <div class="flex items-center justify-center space-x-4 mt-2">
          <a href="#" class="hover:text-blue-500 transition-colors">服务条款</a>
          <span>•</span>
          <a href="#" class="hover:text-blue-500 transition-colors">隐私政策</a>
          <span>•</span>
          <a href="#" class="hover:text-blue-500 transition-colors">帮助中心</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义动画效果 */
.card-enter-active {
  transition: all 0.3s ease-out;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
