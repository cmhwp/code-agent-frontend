# 布局组件使用指南

这个目录包含了三套布局组件，用于不同的页面场景：

## 1. LoginLayout - 登录注册布局

**特点：**
- 居中卡片式布局
- 渐变背景设计
- 无导航栏
- 响应式设计
- 包含 Logo 和底部链接

**使用场景：** 登录、注册、忘记密码等认证页面

**示例路由配置：**
```typescript
{
  path: '/auth',
  component: () => import('@/layouts/LoginLayout.vue'),
  children: [
    {
      path: 'login',
      component: () => import('@/views/auth/Login.vue')
    },
    {
      path: 'register',
      component: () => import('@/views/auth/Register.vue')
    }
  ]
}
```

## 2. AdminLayout - 管理员布局

**特点：**
- 顶部导航栏 + 侧边菜单
- 面包屑导航
- 用户头像下拉菜单
- 通知图标
- 响应式设计（桌面端侧边栏，移动端抽屉菜单）
- 深色主题侧边栏

**适用路径：** `/admin/*` (所有管理员页面)

**示例路由配置：**
```typescript
{
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/admin/Dashboard.vue')
    },
    {
      path: 'users',
      component: () => import('@/views/admin/Users.vue')
    },
    {
      path: 'apps',
      component: () => import('@/views/admin/Apps.vue')
    }
  ]
}
```

## 3. UserLayout - 普通用户布局

**特点：**
- 简洁顶部导航
- 水平菜单栏
- 用户头像下拉菜单
- 移动端抽屉菜单
- 底部版权信息
- 简洁明快的设计风格

**适用路径：** `/user/*` (所有用户页面)

**示例路由配置：**
```typescript
{
  path: '/user',
  component: () => import('@/layouts/UserLayout.vue'),
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/user/Dashboard.vue')
    },
    {
      path: 'code-generator',
      component: () => import('@/views/user/CodeGenerator.vue')
    },
    {
      path: 'my-apps',
      component: () => import('@/views/user/MyApps.vue')
    }
  ]
}
```

## 完整路由示例

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { LoginLayout, AdminLayout, UserLayout } from '@/layouts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 认证相关路由
    {
      path: '/auth',
      component: LoginLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/Login.vue')
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/auth/Register.vue')
        }
      ]
    },
    
    // 管理员路由
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('@/views/admin/Dashboard.vue')
        },
        {
          path: 'users',
          name: 'UserManagement',
          component: () => import('@/views/admin/Users.vue')
        }
      ]
    },
    
    // 用户路由
    {
      path: '/user',
      component: UserLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'UserDashboard',
          component: () => import('@/views/user/Dashboard.vue')
        },
        {
          path: 'code-generator',
          name: 'CodeGenerator',
          component: () => import('@/views/user/CodeGenerator.vue')
        }
      ]
    },
    
    // 默认重定向
    {
      path: '/',
      redirect: '/user/dashboard'
    }
  ]
})

export default router
```

## 技术栈

- **Vue 3** - 前端框架
- **TypeScript** - 类型安全
- **Ant Design Vue 4.x** - UI 组件库
- **Tailwind CSS** - 样式框架
- **Vue Router** - 路由管理

## 自定义说明

每个布局组件都支持通过 slot 传入自定义内容，你可以根据具体需求进行调整：

- 修改菜单项数据
- 调整颜色主题
- 添加新的功能组件
- 自定义用户信息显示

所有布局都已经考虑了响应式设计，在不同设备上都有良好的显示效果。