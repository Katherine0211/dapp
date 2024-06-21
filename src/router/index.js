import { createRouter, createWebHistory } from 'vue-router' // 导入router
import { useUserstore } from '@/store/user' // 导入用户状态管理器

const Login = () => import('../views/login/login.vue') // 登录组件
const Home = () => import('../views/home/home.vue') // 首页组件


/**
 * routes 路由表集合 是个数组
 * @param {*} path 页面访问路径
 * @param {*} name 页面路由名称
 * @param {*} component 页面路由组件
 * @param {*} meta 路由元信息
 * @param {*} title 路由菜单名称
 * 
 * 
 */
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/home',
    component: Home,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '系统管理',
          isShow: true,
          icon: 'layui-icon-set-sm',
          requiresAuth: true
        },
        component: () => import('@/views/workspace/workspace.vue')
      },
      {
        path: '/home/users',
        name: 'users',
        meta: {
          title: '用户管理',
          isShow: true,
          icon: 'layui-icon-user',
          requiresAuth: true
        },
        component: () => import('@/views/user/user.vue')
      },
      {
        path: '/carousel/list',
        name: 'list',
        meta: {
          title: '轮播图列表',
          isShow: true,
          icon: 'layui-icon-user',
          requiresAuth: true
        },
        component: () => import('@/views/carousel/list.vue')
      },
      {
        path: '/carousel/add',
        name: 'add',
        meta: {
          title: '添加轮播图',
          isShow: true,
          icon: 'layui-icon-user',
          requiresAuth: true
        },
        component: () => import('@/views/carousel/add.vue')
      }
    ]
  }
]


// 实例化路由
const router = createRouter({
  history: createWebHistory(), // 路由模式 url不带#号
  routes, // `routes: routes` 的缩写
  scrollBehavior: () => ({
    y: 0
  })
})

// 路由导航守卫
router.beforeEach(async (to, from) => {
  const userStore = useUserstore()
  // 检查用户是否已登录
  if (to.meta.requiresAuth && !userStore.token) {
    // 将用户重定向到登录页面
    return { path: '/login' }
  }
})


export default router // 导出全局使用
