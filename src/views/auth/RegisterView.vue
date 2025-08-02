<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Input, Button, message, Divider } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { userRegister } from '@/api/userManagement'
import type { API } from '@/api/typings'

const router = useRouter()

// 表单数据
const formData = reactive<API.UserRegisterRequest & { confirmPassword: string }>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
  confirmPassword: '',
  userName: '',
  userEmail: ''
})

// 表单状态
const loading = ref(false)

// 表单验证规则
const rules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' as const },
    { min: 4, max: 16, message: '账号长度为4-16位', trigger: 'blur' as const },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '账号只能包含字母、数字和下划线', trigger: 'blur' as const }
  ],
  userName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' as const },
    { min: 2, max: 20, message: '昵称长度为2-20位', trigger: 'blur' as const }
  ],
  userEmail: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' as const },
    { type: 'email' as const, message: '请输入有效的邮箱地址', trigger: 'blur' as const }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' as const },
    { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' as const },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/, message: '密码必须包含大小写字母和数字', trigger: 'blur' as const }
  ],
  checkPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' as const },
    {
      validator: (_rule: any, value: string) => {
        if (value && value !== formData.userPassword) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur' as const
    }
  ]
}

// 处理注册
const handleRegister = async () => {
  try {
    loading.value = true

    // 设置确认密码
    formData.checkPassword = formData.confirmPassword

    const response = await userRegister({
      userAccount: formData.userAccount,
      userPassword: formData.userPassword,
      checkPassword: formData.checkPassword,
      userName: formData.userName,
      userEmail: formData.userEmail
    }) as API.BaseResponseLong

    if (response.success) {
      message.success('注册成功！请登录您的账户')
      router.push('/auth/login')
    } else {
      message.error(response.message || '注册失败')
    }
  } catch (error: any) {
    console.error('Register error:', error)
    message.error(error.message || '注册失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">创建账户</h2>
      <p class="text-gray-600">加入我们，开始您的代码生成之旅</p>
    </div>

    <!-- 注册表单 -->
    <Form
      :model="formData"
      :rules="rules"
      @finish="handleRegister"
      layout="vertical"
      class="space-y-4"
    >
      <Form.Item name="userAccount" label="账号">
        <Input
          v-model:value="formData.userAccount"
          size="large"
          placeholder="请输入账号（4-16位字母数字）"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400" />
          </template>
        </Input>
      </Form.Item>

      <Form.Item name="userName" label="用户昵称">
        <Input
          v-model:value="formData.userName"
          size="large"
          placeholder="请输入您的昵称"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400" />
          </template>
        </Input>
      </Form.Item>

      <Form.Item name="userEmail" label="邮箱地址">
        <Input
          v-model:value="formData.userEmail"
          size="large"
          placeholder="请输入您的邮箱地址"
        >
          <template #prefix>
            <MailOutlined class="text-gray-400" />
          </template>
        </Input>
      </Form.Item>

      <Form.Item name="userPassword" label="密码">
        <Input.Password
          v-model:value="formData.userPassword"
          size="large"
          placeholder="请输入密码（8-20位，包含大小写字母和数字）"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </Input.Password>
      </Form.Item>

      <Form.Item name="checkPassword" label="确认密码">
        <Input.Password
          v-model:value="formData.confirmPassword"
          size="large"
          placeholder="请再次输入密码"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </Input.Password>
      </Form.Item>

      <!-- 注册按钮 -->
      <Form.Item>
        <Button
          type="primary"
          html-type="submit"
          size="large"
          :loading="loading"
          class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-0"
        >
          {{ loading ? '注册中...' : '立即注册' }}
        </Button>
      </Form.Item>
    </Form>

    <!-- 分隔线 -->
    <Divider class="my-6">
      <span class="text-gray-500 text-sm">或者</span>
    </Divider>

    <!-- 登录链接 -->
    <div class="text-center">
      <span class="text-gray-600">已有账户？</span>
      <Button
        type="link"
        class="p-0 ml-1 text-blue-600 hover:text-blue-700 font-medium"
        @click="goToLogin"
      >
        立即登录
      </Button>
    </div>

    <!-- 注册须知 -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="font-medium text-green-800 mb-2">🎉 注册即享受以下服务：</h4>
      <ul class="text-green-700 text-sm space-y-1">
        <li>• 免费使用 AI 代码生成功能</li>
        <li>• 创建和管理您的应用项目</li>
        <li>• 获得最新功能更新通知</li>
        <li>• 24/7 技术支持服务</li>
      </ul>
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
  border-color: #10b981;
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

:deep(.ant-btn-primary) {
  border-radius: 8px;
  font-weight: 500;
  height: 44px;
}
</style>
