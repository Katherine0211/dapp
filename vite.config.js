import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    hmr: true, // 热重载(保存后页面自动刷新)
    open: true, // 是否自动打开浏览器
    host: '0.0.0.0', // 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址。
    port: 8090, // 端口号
    proxy: {
      // 使用 proxy 实例
    }
  }
})
