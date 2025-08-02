<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button, Result } from 'ant-design-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <Result
        status="404"
        title="404"
        sub-title="抱歉，您访问的页面不存在"
      >
        <template #extra>
          <div class="space-x-4">
            <Button type="primary" @click="goHome">
              返回首页
            </Button>
            <Button @click="goBack">
              返回上页
            </Button>
          </div>
        </template>
      </Result>
    </div>
  </div>
</template>
