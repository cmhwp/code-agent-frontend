import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ThemeType = 'light' | 'dark' | 'realDark'

export interface LayoutSetting {
  navTheme: ThemeType
  colorPrimary: string
}

const defaultSetting: LayoutSetting = {
  navTheme: 'dark',
  colorPrimary: '#1677FF',
}

export const useLayoutStore = defineStore('layout', () => {
  // 布局设置
  const layoutSetting = ref<LayoutSetting>({ ...defaultSetting })

  // 计算属性
  const isDarkTheme = computed(
    () => layoutSetting.value.navTheme === 'dark' || layoutSetting.value.navTheme === 'realDark',
  )

  // 更新布局设置
  const updateLayoutSetting = (setting: Partial<LayoutSetting>) => {
    layoutSetting.value = { ...layoutSetting.value, ...setting }
    // 保存到 localStorage
    localStorage.setItem('layoutSetting', JSON.stringify(layoutSetting.value))

    // 更新CSS变量
    if (setting.colorPrimary) {
      updateThemeColor(setting.colorPrimary)
    }

    // 更新主题模式
    if (setting.navTheme) {
      updateThemeMode(setting.navTheme)
    }
  }

  // 更新主题色
  const updateThemeColor = (color: string) => {
    document.documentElement.style.setProperty('--app-primary-color', color)
    // 同时更新 Ant Design 的主题色
    document.documentElement.style.setProperty('--ant-primary-color', color)
    document.documentElement.style.setProperty('--ant-primary-color-hover', lightenColor(color, 10))
    document.documentElement.style.setProperty('--ant-primary-color-active', darkenColor(color, 10))
  }

  // 更新主题模式
  const updateThemeMode = (theme: ThemeType) => {
    // 移除所有主题类
    document.documentElement.removeAttribute('data-theme')

    // 根据主题设置对应的 data-theme 属性
    if (theme === 'realDark') {
      document.documentElement.setAttribute('data-theme', 'realDark')
    }
  }

  // 颜色处理函数 - 基于#1677FF优化
  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = ((num >> 8) & 0x00ff) + amt
    const B = (num & 0x0000ff) + amt
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    )
  }

  const darkenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) - amt
    const G = ((num >> 8) & 0x00ff) - amt
    const B = (num & 0x0000ff) - amt
    return (
      '#' +
      (
        0x1000000 +
        (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
        (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
        (B > 255 ? 255 : B < 0 ? 0 : B)
      )
        .toString(16)
        .slice(1)
    )
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme: ThemeType = layoutSetting.value.navTheme === 'light' ? 'dark' : 'light'
    updateLayoutSetting({ navTheme: newTheme })
  }

  // 重置设置
  const resetSetting = () => {
    layoutSetting.value = { ...defaultSetting }
    localStorage.removeItem('layoutSetting')
    updateThemeColor(defaultSetting.colorPrimary)
  }

  // 从 localStorage 恢复设置
  const restoreSetting = () => {
    const saved = localStorage.getItem('layoutSetting')
    if (saved) {
      try {
        const parsedSetting = JSON.parse(saved)
        layoutSetting.value = { ...defaultSetting, ...parsedSetting }
        updateThemeColor(layoutSetting.value.colorPrimary)
        updateThemeMode(layoutSetting.value.navTheme)
      } catch (error) {
        console.error('Failed to parse layout setting:', error)
        resetSetting()
      }
    } else {
      updateThemeColor(defaultSetting.colorPrimary)
      updateThemeMode(defaultSetting.navTheme)
    }
  }

  return {
    // 状态
    layoutSetting,

    // 计算属性
    isDarkTheme,

    // 方法
    updateLayoutSetting,
    updateThemeColor,
    updateThemeMode,
    toggleTheme,
    resetSetting,
    restoreSetting,
  }
})
