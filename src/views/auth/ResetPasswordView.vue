<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Form, Input, Button, message, Steps } from 'ant-design-vue'
import { SafetyCertificateOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import { resetPassword, sendCode } from '@/api/userManagement'
import type { API } from '@/api/typings'

const router = useRouter()
const route = useRoute()

// 当前步骤
const currentStep = ref(1)

// 表单数据
const formData = reactive<API.ResetPasswordRequest & { confirmNewPassword: string }>({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
  confirmNewPassword: ''
})

// 表单状态
const loading = ref(false)
const resendLoading = ref(false)
const countdown = ref(0)
const timer = ref<NodeJS.Timeout | null>(null)

// 表单验证规则
const rules = {
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule: any, value: string) => {
        if (value && value !== formData.newPassword) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
}

// 初始化
onMounted(() => {
  const email = route.query.email as string
  if (email) {
    formData.email = email
  } else {
    message.warning('请先验证邮箱地址')
    router.push('/auth/forgot-password')
  }
})

// 处理重置密码
const handleResetPassword = async () => {
  try {
    loading.value = true

    // 设置确认密码
    formData.confirmPassword = formData.confirmNewPassword

    const response = await resetPassword({
      email: formData.email,
      code: formData.code,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    })

    if (response.success) {
      message.success('密码重置成功！请使用新密码登录')
      currentStep.value = 2

      // 3秒后跳转到登录页面
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } else {
      message.error(response.message || '密码重置失败')
    }
  } catch (error: any) {
    console.error('Reset password error:', error)
    message.error(error.message || '密码重置失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

// 重新发送验证码
const handleResendCode = async () => {
  try {
    resendLoading.value = true

    const response = await sendCode({
      email: formData.email,
      purpose: 'reset_password'
    })

    if (response.success) {
      message.success('验证码已重新发送到您的邮箱')
      startCountdown()
    } else {
      message.error(response.message || '发送验证码失败')
    }
  } catch (error: any) {
    console.error('Resend code error:', error)
    message.error(error.message || '发送验证码失败')
  } finally {
    resendLoading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value!)
      timer.value = null
    }
  }, 1000)
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/auth/login')
}

// 返回上一步
const goBack = () => {
  router.push('/auth/forgot-password')
}

// 清理定时器
const cleanup = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <div class="space-y-6">
    <!-- 标题 -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">重置密码</h2>
      <p class="text-gray-600">
        验证码已发送至
        <span class="font-medium text-blue-600">{{ formData.email }}</span>
      </p>
    </div>

    <!-- 步骤指示器 -->
    <Steps :current="currentStep" class="mb-8">
      <Steps.Step title="验证邮箱" description="输入您的邮箱地址" />
      <Steps.Step title="验证身份" description="输入验证码" />
      <Steps.Step title="重置密码" description="设置新密码" />
    </Steps>

    <!-- 重置密码表单 -->
    <div v-if="currentStep < 2">
      <Form
        :model="formData"
        :rules="rules"
        @finish="handleResetPassword"
        layout="vertical"
        class="space-y-4"
      >
        <Form.Item name="code" label="验证码">
          <div class="flex space-x-3">
            <Input
              v-model:value="formData.code"
              size="large"
              placeholder="请输入6位验证码"
              maxlength="6"
              class="flex-1"
            >
              <template #prefix>
                <SafetyCertificateOutlined class="text-gray-400" />
              </template>
            </Input>
            <Button
              :loading="resendLoading"
              :disabled="countdown > 0"
              @click="handleResendCode"
              class="whitespace-nowrap"
            >
              <template v-if="countdown > 0">
                {{ countdown }}s
              </template>
              <template v-else>
                重发
              </template>
            </Button>
          </div>
        </Form.Item>

        <Form.Item name="newPassword" label="新密码">
          <Input.Password
            v-model:value="formData.newPassword"
            size="large"
            placeholder="请输入新密码（8-20位，包含大小写字母和数字）"
          >
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </Input.Password>
        </Form.Item>

        <Form.Item name="confirmPassword" label="确认新密码">
          <Input.Password
            v-model:value="formData.confirmNewPassword"
            size="large"
            placeholder="请再次输入新密码"
          >
            <template #prefix>
              <LockOutlined class="text-gray-400" />
            </template>
          </Input.Password>
        </Form.Item>

        <!-- 重置密码按钮 -->
        <Form.Item>
          <Button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 border-0"
          >
            {{ loading ? '重置中...' : '重置密码' }}
          </Button>
        </Form.Item>
      </Form>

      <!-- 操作链接 -->
      <div class="flex justify-between text-sm">
        <Button type="link" class="p-0 text-gray-600" @click="goBack">
          ← 返回上一步
        </Button>
        <Button type="link" class="p-0 text-blue-600" @click="goToLogin">
          返回登录 →
        </Button>
      </div>
    </div>

    <!-- 成功页面 -->
    <div v-else class="text-center space-y-6">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">密码重置成功！</h3>
        <p class="text-gray-600">您的密码已成功重置，正在跳转到登录页面...</p>
      </div>

      <Button
        type="primary"
        size="large"
        @click="goToLogin"
        class="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-0"
      >
        立即登录
      </Button>
    </div>

    <!-- 温馨提示 -->
    <div v-if="currentStep < 2" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="font-medium text-blue-800 mb-2">
        <MailOutlined class="mr-2" />
        温馨提示
      </h4>
      <ul class="text-blue-700 text-sm space-y-1">
        <li>• 验证码有效期为 10 分钟</li>
        <li>• 如果没有收到验证码，请检查垃圾邮件文件夹</li>
        <li>• 新密码必须包含大小写字母和数字</li>
        <li>• 为了账户安全，建议使用强密码</li>
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
  border-color: #8b5cf6;
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

:deep(.ant-btn-primary) {
  border-radius: 8px;
  font-weight: 500;
  height: 44px;
}

:deep(.ant-steps-item-finish .ant-steps-item-icon) {
  background-color: #10b981;
  border-color: #10b981;
}

:deep(.ant-steps-item-process .ant-steps-item-icon) {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}
</style>
