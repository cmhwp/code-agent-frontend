<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Breadcrumb } from 'ant-design-vue'

const route = useRoute()

// 菜单映射 - 用于获取标题
const menuTitleMap: Record<string, string> = {
  '/admin/dashboard': '仪表盘',
  '/admin/apps': '应用管理',
  '/admin/code-generator': '代码生成',
  '/admin/users': '用户管理',
  '/admin/settings': '系统设置',
}

// 面包屑数据
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = [{ title: '管理后台', path: '/admin/dashboard' }]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    if (index > 0) {
      // 跳过 'admin'
      const title = menuTitleMap[currentPath] || segment
      items.push({
        title,
        path: currentPath,
      })
    }
  })

  return items
})
</script>

<template>
  <Breadcrumb class="app-breadcrumb">
    <Breadcrumb.Item v-for="(item, index) in breadcrumbItems" :key="item.path">
      <router-link
        v-if="index < breadcrumbItems.length - 1"
        :to="item.path"
        class="breadcrumb-link"
      >
        {{ item.title }}
      </router-link>
      <span v-else class="breadcrumb-current">{{ item.title }}</span>
    </Breadcrumb.Item>
  </Breadcrumb>
</template>

<style scoped>
.app-breadcrumb {
  margin-left: 8px;
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #1890ff;
}

.breadcrumb-current {
  color: #333;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-breadcrumb {
    display: none;
  }
}

/* 自定义 ant-design-vue 样式 */
:deep(.ant-breadcrumb-separator) {
  color: #ccc;
}
</style>
