<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Layout,
  Menu,
  Breadcrumb,
  Dropdown,
  Avatar,
  Badge,
  Button,
  Drawer
} from 'ant-design-vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  CodeOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons-vue'

const { Header, Sider, Content } = Layout

const router = useRouter()
const route = useRoute()

// 响应式状态
const collapsed = ref(false)
const mobileDrawerVisible = ref(false)
const isMobile = ref(window.innerWidth < 768)

// 监听窗口大小变化
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    mobileDrawerVisible.value = false
  }
})

// 菜单数据
const menuItems = ref([
  {
    key: '/admin/dashboard',
    icon: DashboardOutlined,
    label: '仪表盘',
    title: '仪表盘'
  },
  {
    key: '/admin/apps',
    icon: AppstoreOutlined,
    label: '应用管理',
    title: '应用管理'
  },
  {
    key: '/admin/code-generator',
    icon: CodeOutlined,
    label: '代码生成',
    title: '代码生成'
  },
  {
    key: '/admin/users',
    icon: UserOutlined,
    label: '用户管理',
    title: '用户管理'
  },
  {
    key: '/admin/settings',
    icon: SettingOutlined,
    label: '系统设置',
    title: '系统设置'
  }
])

// 当前选中的菜单
const selectedKeys = computed(() => [route.path])

// 面包屑数据
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = [{ title: '首页', path: '/admin' }]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    if (index > 0) { // 跳过 'admin'
      const menuItem = menuItems.value.find(item => item.key === currentPath)
      items.push({
        title: menuItem?.title || segment,
        path: currentPath
      })
    }
  })

  return items
})

// 用户下拉菜单
const userMenuItems = [
  {
    key: 'profile',
    label: '个人信息',
    icon: UserOutlined
  },
  {
    key: 'settings',
    label: '账户设置',
    icon: SettingOutlined
  },
  {
    type: 'divider'
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: LogoutOutlined,
    danger: true
  }
]

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string | number }) => {
  router.push(key as string)
}

// 处理用户菜单点击
const handleUserMenuClick = ({ key }: { key: string | number }) => {
  switch (key as string) {
    case 'profile':
      router.push('/admin/profile')
      break
    case 'settings':
      router.push('/admin/account-settings')
      break
    case 'logout':
      // 处理退出登录逻辑
      console.log('退出登录')
      router.push('/login')
      break
  }
}

// 切换侧边栏
const toggleSider = () => {
  if (isMobile.value) {
    mobileDrawerVisible.value = !mobileDrawerVisible.value
  } else {
    collapsed.value = !collapsed.value
  }
}
</script>

<template>
  <Layout class="min-h-screen">
    <!-- 桌面端侧边栏 -->
    <Sider
      v-if="!isMobile"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="dark"
      class="shadow-lg"
      :width="250"
    >
      <!-- Logo 区域 -->
      <div class="flex items-center justify-center h-16 bg-gray-900">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CodeOutlined class="text-white text-lg" />
          </div>
          <span v-if="!collapsed" class="text-white font-bold text-lg">管理后台</span>
        </div>
      </div>

      <!-- 菜单 -->
      <Menu
        theme="dark"
        mode="inline"
        :selected-keys="selectedKeys"
        @click="handleMenuClick"
        class="border-r-0"
      >
        <Menu.Item v-for="item in menuItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </Menu.Item>
      </Menu>
    </Sider>

    <!-- 移动端抽屉菜单 -->
    <Drawer
      v-if="isMobile"
      v-model:open="mobileDrawerVisible"
      placement="left"
      :closable="false"
      :width="250"
      :body-style="{ padding: 0 }"
    >
      <!-- Logo 区域 -->
      <div class="flex items-center justify-center h-16 bg-gray-900">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CodeOutlined class="text-white text-lg" />
          </div>
          <span class="text-white font-bold text-lg">管理后台</span>
        </div>
      </div>

      <!-- 菜单 -->
      <Menu
        theme="dark"
        mode="inline"
        :selected-keys="selectedKeys"
        @click="handleMenuClick"
        class="border-r-0"
      >
        <Menu.Item v-for="item in menuItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </Menu.Item>
      </Menu>
    </Drawer>

    <Layout>
      <!-- 顶部导航栏 -->
      <Header class="bg-white shadow-sm border-b border-gray-200 px-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <!-- 折叠按钮 -->
          <Button
            type="text"
            @click="toggleSider"
            class="flex items-center justify-center w-10 h-10"
          >
            <MenuUnfoldOutlined v-if="collapsed || isMobile" />
            <MenuFoldOutlined v-else />
          </Button>

          <!-- 面包屑 -->
          <Breadcrumb class="hidden sm:block">
            <Breadcrumb.Item v-for="(item, index) in breadcrumbItems" :key="item.path">
              <router-link
                v-if="index < breadcrumbItems.length - 1"
                :to="item.path"
                class="text-gray-600 hover:text-blue-500 transition-colors"
              >
                {{ item.title }}
              </router-link>
              <span v-else class="text-gray-800 font-medium">{{ item.title }}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <!-- 右侧工具栏 -->
        <div class="flex items-center space-x-4">
          <!-- 通知图标 -->
          <Badge :count="3" size="small">
            <Button type="text" shape="circle" class="flex items-center justify-center">
              <BellOutlined class="text-lg" />
            </Button>
          </Badge>

          <!-- 用户头像下拉菜单 -->
          <Dropdown placement="bottomRight" :trigger="['click']">
            <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
              <Avatar size="small" :style="{ backgroundColor: '#1890ff' }">
                <UserOutlined />
              </Avatar>
              <span class="hidden sm:inline text-gray-700 font-medium">管理员</span>
            </div>
            <template #overlay>
              <Menu @click="handleUserMenuClick">
                <Menu.Item
                  v-for="item in userMenuItems"
                  :key="item.key"
                  :danger="item.danger"
                >
                  <component :is="item.icon" v-if="item.icon" />
                  {{ item.label }}
                </Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </Header>

      <!-- 主要内容区域 -->
      <Content class="bg-gray-50 min-h-full">
        <div class="p-6">
          <slot />
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<style scoped>
/* 自定义样式 */
:deep(.ant-layout-sider-collapsed) .ant-menu-item .anticon {
  font-size: 16px;
  margin-left: 8px;
}

:deep(.ant-layout-sider-collapsed) .ant-menu-item .ant-menu-title-content {
  display: none;
}

:deep(.ant-breadcrumb) .ant-breadcrumb-link {
  color: #666;
}

:deep(.ant-breadcrumb) .ant-breadcrumb-separator {
  color: #ccc;
}
</style>
