<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useUserstore } from '@/store/user' // 导入用户状态管理数据
import { useRouter } from 'vue-router' // 导入路由
import { layer } from '@layui/layer-vue' // 导入layui的弹窗组件
import MenuBar from './components/MenuBar.vue' // 导入左边菜单栏组件

const { proxy } = getCurrentInstance() // 获取vue全局的自定义属性

const userStore = useUserstore() // 实例化用户状态管理器
const router = useRouter() // 实例化路由

/* 管理员name */
const username = userStore.user.username

/* 退出注销 */
const logout = async () => {
  let { code, message } = await proxy.$api.Logout(userStore.user.id)
  if (code == 1) {
    router.push('/login')
    userStore.logout()
  } else {
    layer.msg(message, { time: 1000, icon: 5 })
  }
}
</script>

<template>
  <lay-layout class="home-page">
    <lay-header>
      <div class="left">后台管理系统</div>
      <div class="right">
        <lay-dropdown updateAtScroll>
          <div class="admin_info">
            <span>{{ username }}</span>
            <lay-icon type="layui-icon-down"></lay-icon>
          </div>

          <template #content>
            <lay-dropdown-menu>
              <lay-dropdown-menu-item @click="logout">
                退出注销
              </lay-dropdown-menu-item>
            </lay-dropdown-menu>
          </template>
        </lay-dropdown>
      </div>
    </lay-header>
    <lay-layout>
      <lay-side>
        <MenuBar></MenuBar>
      </lay-side>
      <lay-body>
        <router-view></router-view>
      </lay-body>
    </lay-layout>
  </lay-layout>
</template>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  .layui-footer,
  .layui-header {
    line-height: 60px;
    text-align: center;
    background: #22292e;
    padding: 0 20px;
    color: white;
    display: flex;
    justify-content: space-between;

    .left {
      padding: 0 20px;
      font-size: 18px;
      color: #08a9ab;
    }
    .right {
      cursor: pointer;
      .admin_info {
        display: flex;
        align-items: center;
        .layui-icon {
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }
  }

  .layui-side {
    background: #393d49;
    color: white;
  }

  .layui-body {
    background: #fff;
  }
}
</style>
