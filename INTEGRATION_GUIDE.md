# 库集成指南

本项目已成功集成以下库，可以直接使用：

## 🎨 Tailwind CSS v4.0 Beta

- **版本**: v4.0 Beta (下一代架构)
- **配置方式**: 使用 Vite 插件 `@tailwindcss/vite`
- **样式文件**: `src/style.css` (使用 `@import "tailwindcss";`)
- **使用方法**: 直接在模板中使用 Tailwind 类名

```vue
<div class="bg-blue-500 text-white p-4 rounded-lg">
  这是一个蓝色背景的卡片
</div>
```

**v4 新特性**:

- 使用原生 CSS 变量进行主题配置
- 高性能的新引擎
- 更简化的配置方式
- 原生 CSS 层级支持

## 🐜 Ant Design Vue 4.x

- **版本**: 4.x
- **全局引入**: 已在 `main.ts` 中全局注册
- **样式**: 自动引入重置样式
- **使用方法**: 直接在组件中使用

```vue
<script setup>
import { Button, Card, Input } from 'ant-design-vue'
</script>

<template>
  <Card title="卡片标题">
    <Input placeholder="请输入内容" />
    <Button type="primary">提交</Button>
  </Card>
</template>
```

## 🌐 Axios

- **配置文件**: `src/utils/axios.ts`
- **功能**: 请求/响应拦截器、错误处理、超时设置
- **使用方法**:

```typescript
import api from '@/utils/axios'

// GET 请求
const data = await api.get('/api/users')

// POST 请求
const result = await api.post('/api/users', { name: '张三' })
```

## 📝 Markdown

- **库**: markdown-it
- **配置文件**: `src/utils/markdown.ts`
- **功能**: Markdown 转 HTML、HTML 清理
- **使用方法**:

```typescript
import { renderMarkdown, markdownToText } from '@/utils/markdown'

// 渲染为 HTML
const html = renderMarkdown('# 标题\n**粗体文本**')

// 转换为纯文本
const text = markdownToText('# 标题\n**粗体文本**')
```

## 🛠️ 环境变量配置

在根目录创建 `.env` 文件配置 API 基础地址：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📦 已安装的包

### 生产依赖

- `ant-design-vue@^4.0.0` - UI 组件库
- `axios` - HTTP 请求库
- `markdown-it` - Markdown 处理库

### 开发依赖

- `tailwindcss@latest` - CSS 框架
- `postcss@latest` - CSS 后处理器
- `autoprefixer@latest` - CSS 自动前缀
- `@types/markdown-it` - TypeScript 类型定义

## 🚀 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

## 💡 使用建议

1. **样式优先级**: Tailwind CSS 和 Ant Design 可以很好地配合使用，Tailwind 用于布局和自定义样式，Ant Design 提供组件
2. **API 请求**: 统一使用 `src/utils/axios.ts` 中配置的实例，便于统一管理认证和错误处理
3. **Markdown 渲染**: 在显示用户生成内容时，注意 XSS 安全问题，考虑使用内容过滤
4. **TypeScript**: 所有工具函数都有完整的类型定义，享受类型安全的开发体验

## 📄 示例代码

查看 `src/App.vue` 文件，其中包含了所有库的使用示例。
