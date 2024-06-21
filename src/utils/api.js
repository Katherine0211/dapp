import axios from 'axios' // 导入axios
import { useRouter } from 'vue-router' // 导入路由
import { useUserstore } from '@/store/user' // 导入用户数据存储管理状态
const router = useRouter() // 实例化路由

/**
 * 创建api实例
 * @param {String} baseURL 请求接口路径
 * @param {*} timeout 超时时间
 *
 */
const api = axios.create({
  baseURL: 'http://127.0.0.1:9000',
  timeout: 3000,
  headers: {}
})

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    const userStore = useUserstore()
    // 如果在store里有token, 发送请求的时候 就要带上token
    if (userStore.token) {
      config.headers['authorization'] = userStore.token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    const userStore = useUserstore()
    // 返回码401：Token 无效 清除存储的token 并跳转到login页面
    if (response.data.code == 401) {
      
      userStore.token = null
      router.push('/login')
    } else {
      // 刷新token
      if (response.data.token && userStore.token !== response.data.token) {
        userStore.token = response.data.token
      }
      return response.data
    }
  },
  (error) => {
    // 对响应错误做点什么

    if (process.env.NODE_ENV === 'development') {
      console.log(error.response)
    }
    return Promise.reject(error)
  }
)

/**
 * 登录
 * url /users/backend/login
 *
 * @returns 返回token和用户信息
 */
const Login = (data) => api.post('/users/backend/login', data)

/**
 * 退出注销
 * url /users/backend/logout
 * @param {*} id 管理员id
 * @returns
 */
const Logout = (id) => api.get(`/users/backend/logout?id=${id}`)

/**
 * 获取登录验证码
 * url /users/backend/code
 *
 *
 * @returns
 */
const getCode = () => api.get('/users/backend/code')

/**
 * 获取用户列表
 * url /users/backend/list
 * @param {*} id 管理员id
 * @returns
 */

const getUserList = (id) => api.get(`/users/backend/list?id=${id}`)

/**
 * 查询用户数据
 * url /users/backend/search
 * @param {*} id 管理员id
 *  @param {*} str 搜索关键字
 *
 * @returns
 */
const getUserSearch = (id, str) =>
  api.get(`/users/backend/search?id=${id}&searchStr=${str}`)

/**
 * 获取用户信息
 * url /users/info
 * @param {*} data
 * @returns
 */
const getUserInfo = (data) => api.get('/users/info', data)

/**
 * 禁用/解禁
 * url /users/backend/flag
 *  @param {*} id 管理员id
 *  @param {*} uid 重置用户的id
 *
 * @returns
 */
const updateFlag = (data) => api.post('/users/backend/flag', data)

/**
 * 重置密码
 * url /users/backend/reset
 *  @param {*} id 管理员id
 *  @param {*} uid 重置用户的id
 *
 * @returns
 */
const updatePos = (data) => api.post('/users/backend/reset', data)

/**
 * 删除用户
 * url /users/backend/del
 *  @param {*} id 管理员id
 *  @param {*} uid 重置用户的id
 *
 * @returns
 */
const delUser = (data) => api.post('/users/backend/del', data)

/**
 * 轮播图列表
 * url /carousel/list
 *
 * @returns
 */
const getCarouselList = () => api.get('/carousel/list')

/**
 * 删除轮播图
 * url /carousel/backend/remove
 * @param {Object} data {id: 后台管理员id, imgId: 要删除的轮播图的id标识 }
 * @returns
 */
const delCarousel = (data) => api.post('/carousel/backend/remove', data)

// 导出使用
export default {
  api,
  Login,
  Logout,
  getCode,
  getUserList,
  getUserSearch,
  getUserInfo,
  updateFlag,
  updatePos,
  delUser,
  getCarouselList,
  delCarousel
}
