<script setup lang="ts">
import { ref, computed } from 'vue'
import { Drawer, Descriptions, Tag, Tooltip, Button } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { useLayoutStore } from '@/stores/layout'
import type { ThemeType } from '@/stores/layout'

const layoutStore = useLayoutStore()
const visible = ref(false)
const customColor = ref(layoutStore.layoutSetting.colorPrimary)

// 主题风格选项
const themeStyles = [
  { label: '亮色主题', value: 'light' as ThemeType },
  { label: '暗色主题', value: 'dark' as ThemeType },
  { label: '暗黑主题', value: 'realDark' as ThemeType },
]

// 预设主题色
const themeColors = [
  { title: '拂晓蓝', value: '#1890ff' },
  { title: '薄暮', value: '#722ed1' },
  { title: '火山', value: '#fa541c' },
  { title: '日暮', value: '#faad14' },
  { title: '明青', value: '#13c2c2' },
  { title: '极光绿', value: '#52c41a' },
  { title: '极客蓝', value: '#2f54eb' },
  { title: '酱紫', value: '#eb2f96' },
]



// 计算属性
const colorPickerStyle = computed((): any => ({
  '--custom-color': customColor.value,
  opacity: 0,
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  cursor: 'pointer',
}))

// 方法
const showDrawer = () => {
  visible.value = true
}

const setNavTheme = (theme: ThemeType) => {
  layoutStore.updateLayoutSetting({ navTheme: theme })
}



const setThemeColor = (color: string) => {
  layoutStore.updateLayoutSetting({ colorPrimary: color })
  customColor.value = color
}

const getThemeColorVisible = (color: string) =>
  layoutStore.layoutSetting.colorPrimary === color ? 'visible' : 'hidden'

const resetSettings = () => {
  layoutStore.resetSetting()
  customColor.value = layoutStore.layoutSetting.colorPrimary
}
</script>

<template>
  <Tooltip title="主题设置" placement="bottom">
    <div class="theme-setting-trigger" @click="showDrawer">
      <SettingOutlined />
    </div>
  </Tooltip>

  <Drawer v-model:open="visible" title="主题设置" placement="right" :width="320" :closable="true">
    <!-- 整体风格 -->
    <Descriptions title="整体风格" :column="1" size="small">
      <Descriptions.Item v-for="theme in themeStyles" :key="theme.value">
        <div class="setting-item" @click="setNavTheme(theme.value)">
          <span class="setting-label">{{ theme.label }}</span>
          <div
            class="theme-preview"
            :class="{
              'theme-preview-light': theme.value === 'light',
              'theme-preview-dark': theme.value === 'dark' || theme.value === 'realDark',
              active: layoutStore.layoutSetting.navTheme === theme.value,
            }"
          >
            <div class="theme-preview-sider"></div>
            <div class="theme-preview-content">
              <div class="theme-preview-header"></div>
              <div class="theme-preview-body"></div>
            </div>
          </div>
        </div>
      </Descriptions.Item>
    </Descriptions>

    <!-- 主题色 -->
    <Descriptions title="主题色" :column="4" size="small">
      <Descriptions.Item v-for="item in themeColors" :key="item.value">
        <Tooltip :title="item.title">
          <Tag :color="item.value" class="color-tag" @click="setThemeColor(item.value)">
            <span :style="{ visibility: getThemeColorVisible(item.value) }">✔</span>
          </Tag>
        </Tooltip>
      </Descriptions.Item>

      <!-- 自定义颜色 -->
      <Descriptions.Item key="custom">
        <Tooltip title="自定义颜色">
          <div class="color-tag custom-color" :style="{ backgroundColor: customColor }">
            <input
              v-model="customColor"
              type="color"
              :style="colorPickerStyle"
              @input="setThemeColor(customColor)"
            />
            <span :style="{ visibility: getThemeColorVisible(customColor) }">✔</span>
          </div>
        </Tooltip>
      </Descriptions.Item>
    </Descriptions>



    <!-- 重置按钮 -->
    <div class="setting-actions">
      <Button type="primary" danger @click="resetSettings"> 重置设置 </Button>
    </div>
  </Drawer>
</template>

<style scoped>
.theme-setting-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.theme-setting-trigger:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.setting-item:hover {
  background-color: #f5f5f5;
}

.setting-label {
  font-size: 14px;
}

.theme-preview {
  width: 60px;
  height: 40px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  transition: all 0.3s ease;
  position: relative;
}

.theme-preview.active {
  border-color: var(--app-primary-color, #1890ff);
}

.theme-preview.active::after {
  content: '✓';
  position: absolute;
  top: 2px;
  right: 4px;
  color: var(--app-primary-color, #1890ff);
  font-size: 12px;
  font-weight: bold;
}

.theme-preview-light {
  background-color: #fff;
}

.theme-preview-dark {
  background-color: #001529;
}

.theme-preview-sider {
  width: 16px;
  background-color: rgba(255, 255, 255, 0.1);
}

.theme-preview-light .theme-preview-sider {
  background-color: #001529;
}

.theme-preview-content {
  flex: 1;
  padding: 4px;
}

.theme-preview-header {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  margin-bottom: 4px;
  border-radius: 2px;
}

.theme-preview-light .theme-preview-header {
  background-color: #f0f0f0;
}

.theme-preview-body {
  height: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.theme-preview-light .theme-preview-body {
  background-color: #fafafa;
}



.color-tag {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.color-tag:hover {
  transform: scale(1.1);
}

.custom-color {
  position: relative;
  overflow: hidden;
}



.setting-actions {
  margin-top: 24px;
  text-align: center;
}

/* Ant Design 样式覆盖 */
:deep(.ant-descriptions-title) {
  margin-bottom: 12px !important;
  color: #333;
  font-weight: 600;
}

:deep(.ant-descriptions-item) {
  padding-bottom: 8px !important;
}
</style>
