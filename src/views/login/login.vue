<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { layer } from '@layui/layer-vue'  // 导入layui的弹窗组件
import { useRouter } from 'vue-router' // 导入路由
import { useUserstore } from '@/store/user' // 导入用户状态管理数据

const { proxy } = getCurrentInstance() // 获取vue全局的自定义属性
// 路由信息
const router = useRouter() // 实例化路由
const userStore = useUserstore() // 实例化用户状态管理器

let svgData = ref() // 接口返回的图片验证码数据
let captcahCode = ref() // 接口返回的验证码
/* 提交的表单数据 */
const form = reactive({
  username: '', // 用户名
  password: '', // 密码
  code: '' // 输入的验证码
})

/* 获取登录验证码 */
const getCaptcha = async () => {
  // 开始发送请求
  const {data, code, msg} = await proxy.$api.getCode()
  svgData.value = data.data
  captcahCode.value = data.text.toLowerCase()
}
/* 直接调用 */
getCaptcha()

/* 提交登陆表单 */
const submit1 = async () => {
  // 验证码为空判断
  if (!form.code) return layer.msg('验证码不能为空', { time: 1000, icon: 5 })
  // 验证码输入错误
  if (form.code && form.code != captcahCode.value)
    return layer.msg('验证码错误,请重试', { time: 1000, icon: 5 })
  // 发送请求
  const {code, message, user, token} = await proxy.$api.Login({
    username: form.username,
    password: form.password
  })
  // code == 1 登录成功
  if (code === 1) {
    // 存储登录状态
    userStore.login(user, token)
    // 并转到首页
    router.push('/home')
  } else {
    // 登录失败
    return layer.msg(`${message}`, { time: 1000, icon: 5 })
  }
}
</script>

<template>
  <lay-container>
    <div class="login_box">
      <div class="center-box">
        <h2>管理登录-登录</h2>
        <div class="center-form">
          <lay-input
            v-model="form.username"
            type=""
            placeholder="用户名"
            :max="10"
            :min="6"
          ></lay-input>
          <lay-input
            v-model="form.password"
            type="password"
            password
            placeholder="密码"
            :max="10"
            :min="6"
          ></lay-input>
          <lay-input v-model="form.code" placeholder="验证码" :max="4" :min="4">
            <template #suffix>
              <div class="sufimg" v-html="svgData"></div>
            </template>
          </lay-input>
          <lay-button type="primary" @click="submit1" fluid>登录</lay-button>
        </div>
      </div>
    </div>
  </lay-container>
</template>
<style scoped lang="scss">
.layui-container {
  padding: 0;
}
.login_box {
  width: 100vw;
  height: 100vh;
  background: url(../../assets/banner_login.jpg) no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  .center-box {
    width: 20vw;
    padding: 0 0 20px;
    // height: 40vh;
    background: rgba(29, 30, 32, 0.6);
    box-shadow: 0 0 #000;
    border-radius: 10px;
    margin: 0 auto;
    color: #fff;
    h2 {
      text-align: center;
      padding: 20px 0;
    }

    .center-form {
      padding: 0 20px;

      .layui-input + .layui-input {
        margin-top: 20px;
      }
      .sufimg {
        width: 80px;
      }
      .layui-btn {
        margin-top: 20px;
      }
    }
  }
}
</style>
