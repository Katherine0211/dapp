import { createApp } from 'vue'
import pinia from './store/index' // 全局导入状态管理器

import router from './router' // 全局导入路由
import Layui from '@layui/layui-vue' // 导入layui组件库
import '@layui/layui-vue/lib/index.css' // 导入layui的样式表
import './styles/default.css' // 导入自定义初始化样式表

import api from './utils/api' // 全局导入请求api
import { haveDomain } from './utils/utils' // 全局导入图片域名处理工具函数
import VueSmoothScroll from 'vue3-smooth-scroll' // 引入插件

import App from './App.vue'

const app = createApp(App) // 实例化vue
app.use(router) // 使用路由
app.use(pinia) // 使用状态管理器
app.use(Layui) // 使用layui组件库
app.use(VueSmoothScroll) //调用插件
app.mount('#app') // 挂载
app.config.globalProperties.$api = api // 定义全局的api
app.config.globalProperties.haveDomain = haveDomain // 定义全局的域名判断函数

export default app
