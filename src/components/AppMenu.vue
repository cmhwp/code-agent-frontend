<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu } from 'ant-design-vue'
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CodeOutlined,
} from '@ant-design/icons-vue'

interface Props {
  collapsed?: boolean
  theme?: 'light' | 'dark' | 'realDark'
  mode?: 'inline' | 'horizontal'
}

interface MenuItem {
  key: string
  icon: any
  label: string
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  theme: 'dark',
  mode: 'inline',
})

const emit = defineEmits<{
  menuClick: [{ key: string }]
}>()

const route = useRoute()
const router = useRouter()

// 菜单数据 - 基于路由配置
const menuItems: MenuItem[] = [
  {
    key: '/admin/dashboard',
    icon: DashboardOutlined,
    label: '仪表盘',
    title: '仪表盘',
  },
  {
    key: '/admin/apps',
    icon: AppstoreOutlined,
    label: '应用管理',
    title: '应用管理',
  },
  {
    key: '/admin/code-generator',
    icon: CodeOutlined,
    label: '代码生成',
    title: '代码生成',
  },
  {
    key: '/admin/users',
    icon: UserOutlined,
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/settings',
    icon: SettingOutlined,
    label: '系统设置',
    title: '系统设置',
  },
]

// 当前选中的菜单
const selectedKeys = computed(() => [route.path])

// 为Ant Design Menu组件转换主题
const menuTheme = computed(() => {
  return props.theme === 'light' ? 'light' : 'dark'
})

// 处理菜单点击
const handleMenuClick = (info: { key: string | number }) => {
  emit('menuClick', { key: info.key as string })
}
</script>

<template>
  <div class="app-menu">
    <Menu
      :theme="menuTheme"
      :mode="mode"
      :selected-keys="selectedKeys"
      @click="handleMenuClick"
      class="menu-container"
      :inline-collapsed="collapsed && mode === 'inline'"
    >
      <Menu.Item v-for="item in menuItems" :key="item.key" class="menu-item">
        <template #icon>
          <component :is="item.icon" />
        </template>
        <span class="menu-label">{{ item.label }}</span>
      </Menu.Item>
    </Menu>
  </div>
</template>

<style scoped>
.app-menu {
  width: 100%;
  overflow: auto;
}

.app-menu::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.menu-container {
  border-right: none;
  background: transparent;
}

.menu-item {
  margin: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.menu-item.ant-menu-item-selected {
  background-color: #1890ff !important;
}

.menu-label {
  margin-left: 8px;
}

/* 自定义 ant-design-vue 样式 */
:deep(.ant-menu-inline-collapsed) .menu-label {
  display: none;
}

:deep(.ant-menu-inline-collapsed) .ant-menu-item {
  padding-left: 24px !important;
}
</style>
