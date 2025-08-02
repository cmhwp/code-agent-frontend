<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Input, Button, message, Checkbox, Divider } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { userLogin } from '@/api/userManagement'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const formData = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: ''
})

// 表单状态
const loading = ref(false)
const rememberMe = ref(false)

// 表单验证规则
const rules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' as const },
    { min: 4, max: 16, message: '账号长度为4-16位', trigger: 'blur' as const }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' as const },
    { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' as const }
  ]
}

// 处理登录
const handleLogin = async () => {
  try {
    loading.value = true

        const response = await userLogin(formData) as API.BaseResponseLoginUserVO

    if (response.success && response.data) {
      message.success('登录成功！')

      // 保存用户信息到 store
      userStore.setUser(response.data)

      // 根据用户角色跳转到不同页面
      if (response.data.userRole === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } else {
      message.error(response.message || '登录失败')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    message.error(error.message || '登录失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/auth/register')
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push('/auth/forgot-password')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h2>
      <p class="text-gray-600">请登录您的账户</p>
    </div>

    <!-- 登录表单 -->
    <Form
      :model="formData"
      :rules="rules"
      @finish="handleLogin"
      layout="vertical"
      class="space-y-4"
    >
      <Form.Item name="userAccount" label="账号">
        <Input
          v-model:value="formData.userAccount"
          size="large"
          placeholder="请输入您的账号"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400" />
          </template>
        </Input>
      </Form.Item>

      <Form.Item name="userPassword" label="密码">
        <Input.Password
          v-model:value="formData.userPassword"
          size="large"
          placeholder="请输入您的密码"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </Input.Password>
      </Form.Item>

      <!-- 记住我 & 忘记密码 -->
      <div class="flex items-center justify-between">
        <Checkbox v-model:checked="rememberMe">
          记住我
        </Checkbox>
        <Button
          type="link"
          class="p-0 h-auto text-blue-600 hover:text-blue-700"
          @click="goToForgotPassword"
        >
          忘记密码？
        </Button>
      </div>

      <!-- 登录按钮 -->
      <Form.Item>
        <Button
          type="primary"
          html-type="submit"
          size="large"
          :loading="loading"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0"
        >
          {{ loading ? '登录中...' : '登录' }}
        </Button>
      </Form.Item>
    </Form>

    <!-- 分隔线 -->
    <Divider class="my-6">
      <span class="text-gray-500 text-sm">或者</span>
    </Divider>

    <!-- 注册链接 -->
    <div class="text-center">
      <span class="text-gray-600">还没有账户？</span>
      <Button
        type="link"
        class="p-0 ml-1 text-blue-600 hover:text-blue-700 font-medium"
        @click="goToRegister"
      >
        立即注册
      </Button>
    </div>

    <!-- 快速登录提示 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
      <p class="text-blue-700 text-sm">
        💡 <strong>体验提示：</strong> 首次使用请先注册账户
      </p>
    </div>
  </div>
</template>

<style scoped>
:deep(.ant-form-item-label > label) {
  color: #374151;
  font-weight: 500;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  border-color: #d1d5db;
  transition: all 0.3s ease;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: #3b82f6;
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

:deep(.ant-btn-primary) {
  border-radius: 8px;
  font-weight: 500;
  height: 44px;
}
</style>
