import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'

import App from './App.vue'
import router from './router'
import { useLayoutStore } from './stores/layout'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Antd)

// 初始化布局设置
const layoutStore = useLayoutStore()
layoutStore.restoreSetting()

app.mount('#app')
