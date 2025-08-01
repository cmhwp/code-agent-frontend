<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, Input, notification } from 'ant-design-vue'
import api from './utils/axios'
import { renderMarkdown } from './utils/markdown'

const message = ref('Hello from Vue 3 + Ant Design Vue + Tailwind!')
const markdownText = ref(`# 欢迎使用集成环境！

这是一个展示**Markdown**渲染的示例：

- ✅ **Tailwind CSS** - 用于样式和布局
- ✅ **Ant Design Vue 4.x** - UI 组件库
- ✅ **Axios** - HTTP 请求库
- ✅ **Markdown-it** - Markdown 渲染

> 现在你可以开始构建你的应用了！`)

const renderedMarkdown = ref('')

const testAxios = async () => {
  try {
    // 这是一个示例请求，你需要根据实际 API 调整
    const response = await api.get('https://jsonplaceholder.typicode.com/posts/1')
    notification.success({
      message: 'Axios 测试成功',
      description: `获取到数据: ${response.title || JSON.stringify(response)}`
    })
  } catch (error) {
    notification.error({
      message: 'Axios 测试失败',
      description: '请检查网络连接或 API 地址'
    })
  }
}

const renderMd = () => {
  renderedMarkdown.value = renderMarkdown(markdownText.value)
}

// 初始化渲染 markdown
renderMd()
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- 标题 -->
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        Vue 3 集成环境示例
      </h1>

      <!-- Tailwind + Ant Design 组合示例 -->
      <Card class="mb-8" title="库集成展示">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              消息输入 (Ant Design Vue):
            </label>
            <Input v-model:value="message" placeholder="输入一些文字..." />
          </div>
          
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-blue-800">{{ message }}</p>
          </div>

          <div class="flex gap-4">
            <Button type="primary" @click="testAxios">
              测试 Axios 请求
            </Button>
            <Button @click="renderMd">
              重新渲染 Markdown
            </Button>
          </div>
        </div>
      </Card>

      <!-- Markdown 渲染示例 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Markdown 源码">
          <Input.TextArea 
            v-model:value="markdownText" 
            :rows="10"
            @change="renderMd"
          />
        </Card>

        <Card title="渲染结果">
          <div 
            class="prose max-w-none"
            v-html="renderedMarkdown"
          ></div>
        </Card>
      </div>

      <!-- Tailwind 样式示例 -->
      <Card class="mt-8" title="Tailwind CSS 样式示例">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold mb-2">渐变卡片</h3>
            <p class="text-blue-100">使用 Tailwind 的渐变背景</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <h3 class="text-lg font-semibold mb-2 text-gray-800">边框卡片</h3>
            <p class="text-gray-600">带有左边框的卡片样式</p>
          </div>
          
          <div class="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 class="text-lg font-semibold mb-2 text-yellow-800">提醒卡片</h3>
            <p class="text-yellow-700">黄色主题的提醒样式</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* 可以在这里添加自定义样式，它们会与 Tailwind 很好地配合 */
</style>
