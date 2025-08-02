<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Input, Button, message, Steps } from 'ant-design-vue'
import { MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'
import { sendCode } from '@/api/userManagement'

const router = useRouter()

// 当前步骤
const currentStep = ref(0)

// 表单数据
const formData = reactive<API.SendCodeRequest>({
  email: '',
  purpose: 'reset_password'
})

// 表单状态
const loading = ref(false)
const countdown = ref(0)
const timer = ref<number | null>(null)

// 表单验证规则
const rules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' as const },
    { type: 'email' as const, message: '请输入有效的邮箱地址', trigger: 'blur' as const }
  ]
}

// 发送验证码
const handleSendCode = async () => {
  try {
    loading.value = true

    const response = await sendCode(formData) as unknown as API.BaseResponseBoolean

    if (response.data) {
      message.success('验证码已发送到您的邮箱，请查收')

      // 开始倒计时
      startCountdown()

      // 跳转到重置密码页面
      router.push({
        path: '/auth/reset-password',
        query: { email: formData.email }
      })
    } else {
      message.error(response.message || '发送验证码失败')
    }
  } catch (error: any) {
    console.error('Send code error:', error)
    message.error(error.message || '发送验证码失败，请检查网络连接')
  } finally {
    loading.value = false
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
      <h2 class="text-2xl font-bold text-gray-900 mb-2">忘记密码</h2>
      <p class="text-gray-600">请输入您的邮箱地址，我们将发送重置密码的验证码</p>
    </div>

    <!-- 步骤指示器 -->
    <Steps :current="currentStep" class="mb-8">
      <Steps.Step title="验证邮箱" description="输入您的邮箱地址" />
      <Steps.Step title="验证身份" description="输入验证码" />
      <Steps.Step title="重置密码" description="设置新密码" />
    </Steps>

    <!-- 邮箱验证表单 -->
    <Form
      :model="formData"
      :rules="rules"
      @finish="handleSendCode"
      layout="vertical"
      class="space-y-4"
    >
      <Form.Item name="email" label="邮箱地址">
        <Input
          v-model:value="formData.email"
          size="large"
          placeholder="请输入您注册时使用的邮箱地址"
        >
          <template #prefix>
            <MailOutlined class="text-gray-400" />
          </template>
        </Input>
      </Form.Item>

      <!-- 发送验证码按钮 -->
      <Form.Item>
        <Button
          type="primary"
          html-type="submit"
          size="large"
          :loading="loading"
          :disabled="countdown > 0"
          class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0"
        >
          <template v-if="countdown > 0">
            {{ countdown }}s 后可重新发送
          </template>
          <template v-else>
            {{ loading ? '发送中...' : '发送验证码' }}
          </template>
        </Button>
      </Form.Item>
    </Form>

    <!-- 返回登录 -->
    <div class="text-center">
      <Button
        type="link"
        class="text-blue-600 hover:text-blue-700"
        @click="goToLogin"
      >
        ← 返回登录
      </Button>
    </div>

    <!-- 温馨提示 -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <h4 class="font-medium text-amber-800 mb-2">
        <SafetyCertificateOutlined class="mr-2" />
        安全提示
      </h4>
      <ul class="text-amber-700 text-sm space-y-1">
        <li>• 验证码有效期为 10 分钟，请及时使用</li>
        <li>• 如果没有收到邮件，请检查垃圾邮件文件夹</li>
        <li>• 确保输入的邮箱地址与注册时一致</li>
        <li>• 如有问题，请联系客服获取帮助</li>
      </ul>
    </div>

    <!-- 联系支持 -->
    <div class="text-center text-sm text-gray-500">
      <p>无法访问邮箱？</p>
      <Button type="link" class="text-blue-600 hover:text-blue-700 text-sm p-0">
        联系技术支持
      </Button>
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
  border-color: #f97316;
}

:deep(.ant-input-affix-wrapper-focused) {
  border-color: #f97316;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
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
  background-color: #f97316;
  border-color: #f97316;
}
</style>
