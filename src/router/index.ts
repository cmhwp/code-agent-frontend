import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { LoginLayout, AdminLayout, UserLayout } from '@/layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 认证相关路由
    {
      path: '/auth',
      component: LoginLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { title: '用户登录' }
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('@/views/auth/RegisterView.vue'),
          meta: { title: '用户注册' }
        },
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          component: () => import('@/views/auth/ForgotPasswordView.vue'),
          meta: { title: '忘记密码' }
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          component: () => import('@/views/auth/ResetPasswordView.vue'),
          meta: { title: '重置密码' }
        }
      ]
    },

    // 管理员路由
    {
      path: '/admin',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
        requiredRole: 'admin',
        title: '管理后台'
      },
      // children: [
      //   {
      //     path: 'dashboard',
      //     name: 'AdminDashboard',
      //     component: () => import('@/views/admin/Dashboard.vue'),
      //     meta: { title: '仪表盘' }
      //   },
      //   {
      //     path: 'users',
      //     name: 'UserManagement',
      //     component: () => import('@/views/admin/UserManagement.vue'),
      //     meta: { title: '用户管理' }
      //   },
      //   {
      //     path: 'apps',
      //     name: 'AppManagement',
      //     component: () => import('@/views/admin/AppManagement.vue'),
      //     meta: { title: '应用管理' }
      //   },
      //   {
      //     path: 'code-generator',
      //     name: 'AdminCodeGenerator',
      //     component: () => import('@/views/admin/CodeGenerator.vue'),
      //     meta: { title: '代码生成' }
      //   },
      //   {
      //     path: 'settings',
      //     name: 'SystemSettings',
      //     component: () => import('@/views/admin/Settings.vue'),
      //     meta: { title: '系统设置' }
      //   }
      // ]
    },

    // 用户路由
    {
      path: '/user',
      component: UserLayout,
      meta: {
        requiresAuth: true,
        title: '用户中心'
      },
      // children: [
      //   {
      //     path: 'dashboard',
      //     name: 'UserDashboard',
      //     component: () => import('@/views/user/Dashboard.vue'),
      //     meta: { title: '我的首页' }
      //   },
      //   {
      //     path: 'code-generator',
      //     name: 'UserCodeGenerator',
      //     component: () => import('@/views/user/CodeGenerator.vue'),
      //     meta: { title: '代码生成' }
      //   },
      //   {
      //     path: 'my-apps',
      //     name: 'MyApps',
      //     component: () => import('@/views/user/MyApps.vue'),
      //     meta: { title: '我的应用' }
      //   },
      //   {
      //     path: 'docs',
      //     name: 'Docs',
      //     component: () => import('@/views/user/Docs.vue'),
      //     meta: { title: '使用文档' }
      //   },
      //   {
      //     path: 'profile',
      //     name: 'UserProfile',
      //     component: () => import('@/views/user/Profile.vue'),
      //     meta: { title: '个人中心' }
      //   },
      //   {
      //     path: 'settings',
      //     name: 'UserSettings',
      //     component: () => import('@/views/user/Settings.vue'),
      //     meta: { title: '账户设置' }
      //   }
      // ]
    },

    // 默认重定向
    {
      path: '/',
      redirect: '/user/dashboard'
    },

    // 登录重定向
    {
      path: '/login',
      redirect: '/auth/login'
    },

    // 注册重定向
    {
      path: '/register',
      redirect: '/auth/register'
    },

    // 404 页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: { title: '页面不存在' }
    }
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 代码生成助手`
  } else {
    document.title = '代码生成助手'
  }

  // 如果路由不需要认证，直接通过
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // 尝试从 localStorage 恢复用户信息
  if (!userStore.isLoggedIn) {
    const restored = userStore.restoreUser()
    if (!restored) {
      message.warning('请先登录')
      next('/auth/login')
      return
    }
  }

  // 检查用户状态
  if (!userStore.isActive) {
    message.error('您的账户已被禁用，请联系管理员')
    userStore.logout()
    next('/auth/login')
    return
  }

  // 检查角色权限
  if (to.meta.requiredRole && !userStore.hasRole(to.meta.requiredRole)) {
    message.error('您没有权限访问该页面')

    // 根据用户角色重定向到合适的页面
    if (userStore.isAdmin) {
      next('/admin/dashboard')
    } else {
      next('/user/dashboard')
    }
    return
  }

  next()
})

export default router
