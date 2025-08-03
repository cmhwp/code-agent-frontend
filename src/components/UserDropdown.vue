<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { Dropdown, Avatar, Menu, Space, Badge } from 'ant-design-vue'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  QuestionCircleOutlined,
  BellOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 用户信息相关计算属性
const userDisplayName = computed(() => userStore.getDisplayName())
const userAvatarSrc = computed(() => userStore.userAvatar)
const userRole = computed(() => userStore.user?.userRole || 'user')

// 用户角色显示
const roleConfig = computed(() => {
  switch (userRole.value) {
    case 'admin':
      return {
        label: '系统管理员',
        color: '#ff4d4f',
        icon: CrownOutlined,
      }
    case 'user':
      return {
        label: '普通用户',
        color: '#52c41a',
        icon: SafetyCertificateOutlined,
      }
    default:
      return {
        label: '用户',
        color: '#1890ff',
        icon: UserOutlined,
      }
  }
})

// 用户下拉菜单
const userMenuItems = [
  {
    key: 'profile',
    label: '个人中心',
    icon: UserOutlined,
    description: '查看和编辑个人信息',
  },
  {
    key: 'settings',
    label: '账户设置',
    icon: SettingOutlined,
    description: '修改密码、安全设置',
  },
  {
    key: 'notifications',
    label: '消息通知',
    icon: BellOutlined,
    description: '查看系统通知',
    badge: 3,
  },
  {
    key: 'help',
    label: '帮助中心',
    icon: QuestionCircleOutlined,
    description: '使用帮助和常见问题',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: LogoutOutlined,
    danger: true,
    description: '安全退出系统',
  },
]

// 处理用户菜单点击
const handleUserMenuClick = (info: { key: string | number }) => {
  const key = info.key as string
  switch (key) {
    case 'profile':
      router.push('/admin/profile')
      break
    case 'settings':
      router.push('/admin/account-settings')
      break
    case 'notifications':
      router.push('/admin/notifications')
      break
    case 'help':
      router.push('/admin/help')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出登录',
    content: '您确定要退出当前账户吗？退出后需要重新登录。',
    icon: () => h(ExclamationCircleOutlined),
    okText: '确定退出',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        await userStore.logout()
        message.success('退出登录成功')
        router.push('/auth/login')
      } catch (error) {
        console.error('Logout error:', error)
        message.error('退出登录失败，请重试')
      }
    },
  })
}
</script>

<template>
  <Dropdown placement="bottomRight" :trigger="['click']" class="user-dropdown">
    <div class="user-info">
      <Avatar :size="32" :src="userAvatarSrc" class="user-avatar">
        <template v-if="!userAvatarSrc">
          <UserOutlined />
        </template>
      </Avatar>
      <div class="user-details">
        <span class="user-name">{{ userDisplayName }}</span>
        <div class="user-role">
          <component :is="roleConfig.icon" class="role-icon" />
          <span class="role-text" :style="{ color: roleConfig.color }">
            {{ roleConfig.label }}
          </span>
        </div>
      </div>
    </div>
    <template #overlay>
      <div class="user-menu-wrapper">
        <!-- 用户信息头部 -->
        <div class="user-menu-header">
          <div class="user-header-info">
            <Avatar :size="48" :src="userAvatarSrc" class="user-header-avatar">
              <template v-if="!userAvatarSrc">
                <UserOutlined />
              </template>
            </Avatar>
            <div class="user-header-details">
              <div class="user-header-name">{{ userDisplayName }}</div>
              <div class="user-header-role">
                <component :is="roleConfig.icon" class="role-icon" />
                <span :style="{ color: roleConfig.color }">{{ roleConfig.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 菜单项 -->
        <Menu @click="handleUserMenuClick" class="user-menu" :selectable="false">
          <template v-for="item in userMenuItems" :key="item.key">
            <Menu.Divider v-if="item.type === 'divider'" />
            <Menu.Item v-else :danger="item.danger" class="user-menu-item">
              <div class="menu-item-content">
                <div class="menu-item-main">
                  <Badge :count="item.badge" :size="'small'" :offset="[8, 0]">
                    <component :is="item.icon" class="menu-item-icon" />
                  </Badge>
                  <span class="menu-item-label">{{ item.label }}</span>
                </div>
                <div v-if="item.description" class="menu-item-description">
                  {{ item.description }}
                </div>
              </div>
            </Menu.Item>
          </template>
        </Menu>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped>
.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 0;
}

.user-info:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.user-avatar {
  flex-shrink: 0;
  border: 2px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  color: #333;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.user-role {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.role-icon {
  font-size: 10px;
}

.role-text {
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

/* 用户菜单样式 */
.user-menu-wrapper {
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.user-menu-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.user-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-header-avatar {
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-header-details {
  flex: 1;
  min-width: 0;
}

.user-header-name {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 4px;
  color: white;
}

.user-header-role {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.9;
}

.user-header-role .role-icon {
  font-size: 12px;
}

.user-header-role span {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9) !important;
}

.user-menu {
  border: none;
  background: transparent;
  padding: 8px 0;
}

.user-menu-item {
  padding: 0 !important;
  margin: 0 8px 4px 8px !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.user-menu-item:hover {
  background-color: #f8f9fa !important;
}

.user-menu-item.ant-menu-item-danger:hover {
  background-color: #fff2f0 !important;
}

.menu-item-content {
  padding: 12px 16px;
  width: 100%;
}

.menu-item-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-item-icon {
  font-size: 16px;
  color: #666;
  transition: color 0.3s ease;
}

.user-menu-item:hover .menu-item-icon {
  color: #1890ff;
}

.user-menu-item.ant-menu-item-danger .menu-item-icon {
  color: #ff4d4f;
}

.menu-item-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.user-menu-item.ant-menu-item-danger .menu-item-label {
  color: #ff4d4f;
}

.menu-item-description {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-details {
    display: none;
  }

  .user-menu-wrapper {
    width: 260px;
  }

  .user-menu-header {
    padding: 16px;
  }

  .user-header-name {
    font-size: 14px;
  }
}

/* Ant Design 样式覆盖 */
:deep(.ant-dropdown) {
  padding: 0;
}

:deep(.ant-menu-item) {
  height: auto !important;
  line-height: normal !important;
}

:deep(.ant-menu-item-divider) {
  margin: 8px 16px !important;
  background-color: #f0f0f0;
}

:deep(.ant-badge-count) {
  box-shadow: 0 0 0 1px white;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 10px;
}
</style>
