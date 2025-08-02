<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Button,
  Drawer
} from 'ant-design-vue'
import {
  UserOutlined,
  MenuOutlined,
  HomeOutlined,
  CodeOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

const { Header, Content, Footer } = Layout

const router = useRouter()
const route = useRoute()

// 响应式状态
const mobileMenuVisible = ref(false)
const isMobile = ref(window.innerWidth < 768)

// 监听窗口大小变化
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    mobileMenuVisible.value = false
  }
})

// 导航菜单数据
const navItems = ref([
  {
    key: '/user/dashboard',
    label: '首页',
    icon: HomeOutlined
  },
  {
    key: '/user/code-generator',
    label: '代码生成',
    icon: CodeOutlined
  },
  {
    key: '/user/my-apps',
    label: '我的应用',
    icon: AppstoreOutlined
  },
  {
    key: '/user/docs',
    label: '使用文档',
    icon: FileTextOutlined
  }
])

// 当前选中的菜单
const selectedKeys = computed(() => [route.path])

// 用户下拉菜单
const userMenuItems = [
  {
    key: 'profile',
    label: '个人中心',
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

// 处理导航点击
const handleNavClick = ({ key }: { key: string | number }) => {
  router.push(key as string)
  mobileMenuVisible.value = false
}

// 处理用户菜单点击
const handleUserMenuClick = ({ key }: { key: string | number }) => {
  switch (key as string) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'settings':
      router.push('/user/settings')
      break
    case 'logout':
      // 处理退出登录逻辑
      console.log('退出登录')
      router.push('/login')
      break
  }
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}
</script>

<template>
  <Layout class="min-h-screen bg-white">
    <!-- 顶部导航栏 -->
    <Header class="bg-white shadow-sm border-b border-gray-100 px-4 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和导航 -->
        <div class="flex items-center">
          <!-- Logo -->
          <router-link to="/user/dashboard" class="flex items-center space-x-3 mr-8">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CodeOutlined class="text-white text-lg" />
            </div>
            <span class="text-xl font-bold text-gray-800 hidden sm:inline">代码助手</span>
          </router-link>

          <!-- 桌面端导航菜单 -->
          <Menu
            v-if="!isMobile"
            mode="horizontal"
            :selected-keys="selectedKeys"
            @click="handleNavClick"
            class="border-b-0 bg-transparent flex-1"
          >
            <Menu.Item v-for="item in navItems" :key="item.key" class="px-4">
              <component :is="item.icon" class="mr-2" />
              {{ item.label }}
            </Menu.Item>
          </Menu>
        </div>

        <!-- 右侧用户区域 -->
        <div class="flex items-center space-x-4">
          <!-- 移动端菜单按钮 -->
          <Button
            v-if="isMobile"
            type="text"
            @click="toggleMobileMenu"
            class="flex items-center justify-center w-10 h-10"
          >
            <MenuOutlined />
          </Button>

          <!-- 用户头像下拉菜单 -->
          <Dropdown placement="bottomRight" :trigger="['click']">
            <div class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
              <Avatar size="small" :style="{ backgroundColor: '#52c41a' }">
                <UserOutlined />
              </Avatar>
              <span class="hidden sm:inline text-gray-700 font-medium">用户名</span>
            </div>
            <template #overlay>
              <Menu @click="handleUserMenuClick">
                <Menu.Item
                  v-for="item in userMenuItems"
                  :key="item.key"
                  :danger="item.danger"
                >
                  <component :is="item.icon" v-if="item.icon" class="mr-2" />
                  {{ item.label }}
                </Menu.Item>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div>
    </Header>

    <!-- 移动端导航抽屉 -->
    <Drawer
      v-if="isMobile"
      v-model:open="mobileMenuVisible"
      placement="left"
      title="导航菜单"
      :width="280"
    >
      <Menu
        mode="inline"
        :selected-keys="selectedKeys"
        @click="handleNavClick"
        class="border-r-0"
      >
        <Menu.Item v-for="item in navItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </Menu.Item>
      </Menu>
    </Drawer>

    <!-- 主要内容区域 -->
    <Content class="flex-1 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </Content>

    <!-- 底部版权信息 -->
    <Footer class="bg-white border-t border-gray-100 text-center py-6">
      <div class="max-w-7xl mx-auto px-4">
        <!-- 主要版权信息 -->
        <div class="text-gray-600 mb-3">
          <p class="font-medium">© 2024 代码生成助手 - AI 驱动的智能代码生成平台</p>
        </div>

        <!-- 链接区域 -->
        <div class="flex flex-wrap items-center justify-center space-x-6 text-sm text-gray-500 mb-3">
          <a href="#" class="hover:text-blue-500 transition-colors">关于我们</a>
          <a href="#" class="hover:text-blue-500 transition-colors">服务条款</a>
          <a href="#" class="hover:text-blue-500 transition-colors">隐私政策</a>
          <a href="#" class="hover:text-blue-500 transition-colors">帮助中心</a>
          <a href="#" class="hover:text-blue-500 transition-colors">联系我们</a>
        </div>

        <!-- 技术信息 -->
        <div class="text-xs text-gray-400">
          <p>基于 Vue 3 + Ant Design Vue 构建 | 服务器时间: {{ new Date().toLocaleString('zh-CN') }}</p>
        </div>
      </div>
    </Footer>
  </Layout>
</template>

<style scoped>
/* 自定义样式 */
:deep(.ant-menu-horizontal) {
  line-height: 64px;
}

:deep(.ant-menu-horizontal .ant-menu-item) {
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

:deep(.ant-menu-horizontal .ant-menu-item:hover) {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

:deep(.ant-menu-horizontal .ant-menu-item-selected) {
  color: #1890ff;
  border-bottom-color: #1890ff;
  background-color: transparent;
}

/* 移动端适配 */
@media (max-width: 768px) {
  :deep(.ant-layout-header) {
    padding: 0 16px;
  }
}

/* Footer 链接样式 */
footer a {
  position: relative;
  text-decoration: none;
}

footer a:hover {
  text-decoration: none;
}

footer a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 50%;
  background-color: #1890ff;
  transition: all 0.3s ease;
}

footer a:hover::after {
  width: 100%;
  left: 0;
}
</style>
