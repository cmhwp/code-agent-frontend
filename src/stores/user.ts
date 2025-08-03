import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getLoginUser, userLogout } from '@/api/userManagement'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const user = ref<API.LoginUserVO | null>(null)

  // 是否已登录
  const isLoggedIn = computed(() => !!user.value)

  // 是否为管理员
  const isAdmin = computed(() => user.value?.userRole === 'admin')

  // 是否为普通用户
  const isUser = computed(() => user.value?.userRole === 'user')

  // 用户昵称
  const userName = computed(() => user.value?.userName || '用户')

  // 用户头像
  const userAvatar = computed(() => user.value?.userAvatar || '')

  // 设置用户信息
  const setUser = (userData: API.LoginUserVO) => {
    user.value = userData

    // 保存 token 到 localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token)
    }

    // 保存用户信息到 localStorage
    localStorage.setItem('userInfo', JSON.stringify(userData))
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 从 localStorage 恢复用户信息
  const restoreUser = () => {
    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')

    if (token && userInfo) {
      try {
        const userData = JSON.parse(userInfo)
        user.value = userData
        return true
      } catch (error) {
        console.error('Failed to parse user info from localStorage:', error)
        clearUser()
        return false
      }
    }
    return false
  }

  // 获取当前登录用户信息
  const fetchUser = async () => {
    try {
      const response = (await getLoginUser()) as API.BaseResponseLoginUserVO
      if (response.success && response.data) {
        setUser(response.data)
        return response.data
      } else {
        clearUser()
        throw new Error(response.message || '获取用户信息失败')
      }
    } catch (error) {
      clearUser()
      throw error
    }
  }

  // 用户登出
  const logout = async () => {
    try {
      await userLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearUser()
    }
  }

  // 检查用户权限
  const hasRole = (role: string) => {
    return user.value?.userRole === role
  }

  // 检查用户状态
  const isActive = computed(() => user.value?.userStatus === 0)

  // 获取用户显示名称
  const getDisplayName = () => {
    if (user.value?.userName) {
      return user.value.userName
    }
    if (user.value?.userAccount) {
      return user.value.userAccount
    }
    return '用户'
  }

  return {
    // 状态
    user,

    // 计算属性
    isLoggedIn,
    isAdmin,
    isUser,
    userName,
    userAvatar,
    isActive,

    // 方法
    setUser,
    clearUser,
    restoreUser,
    fetchUser,
    logout,
    hasRole,
    getDisplayName,
  }
})
