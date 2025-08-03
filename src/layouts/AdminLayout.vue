<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { Layout, Badge, Button, Drawer, Space } from 'ant-design-vue'
import { MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { useLayoutStore } from '@/stores/layout'
import AppLogo from '@/components/AppLogo.vue'
import AppMenu from '@/components/AppMenu.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import ThemeSetting from '@/components/ThemeSetting.vue'
import FullScreen from '@/components/FullScreen.vue'

const { Header, Sider, Content } = Layout

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const layoutStore = useLayoutStore()

// 响应式状态
const collapsed = ref(false)
const mobileDrawerVisible = ref(false)
const isMobile = ref(window.innerWidth < 768)

// 处理窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    mobileDrawerVisible.value = false
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 恢复布局设置
  layoutStore.restoreSetting()
  // 获取最新用户信息
  userStore.fetchUser().catch(() => {
    message.error('获取用户信息失败')
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  const targetPath = key
  if (targetPath !== route.path) {
    router.push(targetPath)
    // 移动端关闭抽屉
    if (isMobile.value) {
      mobileDrawerVisible.value = false
    }
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

// 侧边栏宽度
const siderWidth = computed(() => (collapsed.value ? 80 : 250))

// 主题相关计算属性
const currentTheme = computed(() => layoutStore.layoutSetting.navTheme)
const isDarkTheme = computed(() => layoutStore.isDarkTheme)

// 为Ant Design Sider组件转换主题
const siderTheme = computed(() => {
  return currentTheme.value === 'light' ? 'light' : 'dark'
})
</script>

<template>
  <Layout class="admin-layout">
    <!-- 桌面端侧边栏 -->
    <Sider
      v-if="!isMobile"
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :theme="siderTheme"
      class="layout-sider"
      :width="siderWidth"
      :collapsed-width="80"
    >
      <!-- Logo 区域 -->
      <AppLogo :collapsed="collapsed" :theme="currentTheme" />

      <!-- 菜单 -->
      <AppMenu
        :collapsed="collapsed"
        :theme="currentTheme"
        mode="inline"
        @menu-click="handleMenuClick"
      />
    </Sider>

    <!-- 移动端抽屉菜单 -->
    <Drawer
      v-if="isMobile"
      v-model:open="mobileDrawerVisible"
      placement="left"
      :closable="false"
      :width="250"
      :body-style="{ padding: 0, backgroundColor: '#001529' }"
      class="mobile-drawer"
    >
      <!-- Logo 区域 -->
      <AppLogo :collapsed="false" :theme="currentTheme" />

      <!-- 菜单 -->
      <AppMenu
        :collapsed="false"
        :theme="currentTheme"
        mode="inline"
        @menu-click="handleMenuClick"
      />
    </Drawer>

    <Layout class="layout-main">
      <!-- 顶部导航栏 -->
      <Header class="layout-header">
        <div class="header-left">
          <Space :size="16">
            <!-- 折叠按钮 -->
            <Button
              type="text"
              @click="toggleSider"
              class="trigger-btn"
              :class="{ 'trigger-btn-mobile': isMobile }"
            >
              <MenuUnfoldOutlined v-if="collapsed || isMobile" />
              <MenuFoldOutlined v-else />
            </Button>

            <!-- 面包屑 -->
            <AppBreadcrumb />
          </Space>
        </div>

        <!-- 右侧工具栏 -->
        <div class="header-right">
          <Space :size="16">
            <!-- 通知图标 -->
            <Badge :count="3" size="small" class="header-badge">
              <Button type="text" shape="circle" class="header-icon-btn">
                <BellOutlined />
              </Button>
            </Badge>

            <!-- 全屏切换 -->
            <FullScreen />

            <!-- 主题设置 -->
            <ThemeSetting />

            <!-- 用户头像下拉菜单 -->
            <UserDropdown />
          </Space>
        </div>
      </Header>

      <!-- 主要内容区域 -->
      <Content class="layout-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏样式 */
.layout-sider {
  border-right: none;
  z-index: 100;
}

/* 头部样式 */
.layout-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.header-right {
  flex-shrink: 0;
}

.trigger-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.trigger-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.trigger-btn-mobile {
  background-color: #1890ff;
  color: white;
}

.trigger-btn-mobile:hover {
  background-color: #40a9ff;
  color: white;
}

/* 头部右侧工具栏 */
.header-badge :deep(.ant-badge-count) {
  box-shadow: 0 0 0 1px white;
}

.header-icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.header-icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* 内容区域 */
.layout-content {
  background: #f5f5f5;
  overflow: auto;
}

.content-wrapper {
  padding: 24px;
  min-height: calc(100vh - 64px);
}

/* 移动端抽屉 */
.mobile-drawer :deep(.ant-drawer-body) {
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-header {
    padding: 0 16px;
  }

  .content-wrapper {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .layout-header {
    padding: 0 12px;
  }

  .content-wrapper {
    padding: 12px;
  }
}

/* 自定义 ant-design-vue 样式 */
:deep(.ant-layout-sider-collapsed) .menu-label {
  display: none;
}

:deep(.ant-menu-inline-collapsed) .ant-menu-item {
  padding-left: 24px !important;
}
</style>
