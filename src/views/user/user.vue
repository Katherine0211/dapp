<script setup>
  import { reactive, ref, getCurrentInstance } from 'vue'
  import { useUserstore } from '@/store/user' // 导入用户状态管理数据
  import { layer } from '@layui/layui-vue' // 导入layui的弹窗组件
  const { proxy } = getCurrentInstance() // 获取vue全局的自定义属性

  // 获取当前用户信息
  const userStore = useUserstore()

  // 定义搜索关键字form表单 username: 关键字
  const search = reactive({
    username: ''
  })

  // 表格加载数据的等待效果
  const loading = ref(false)

  // 选中的数据
  const selectedKeys = ref([])
  // 分页器的page信息 current: 当前页码 limit: 每页多少条 total: 数据总条数据
  const page = reactive({ current: 1, limit: 10, total: 0 })

  /* 配置layui表格的每一列数据 */
  const columns = ref([
    { title: '选项', width: '55px', type: 'checkbox', fixed: 'left' },
    {
      title: '序号',
      width: '120px',
      key: 'id',
      fixed: 'left',
      sort: 'desc',
      align: 'center'
    },
    { title: '用户名', width: '80px', key: 'username', align: 'center' },
    { title: '年龄', width: '80px', key: 'age', sort: 'desc', align: 'center' },
    { title: '性别', width: '80px', key: 'gender', align: 'center' },
    { title: '昵称', width: '80px', key: 'nickname', align: 'center' },
    { title: '角色', width: '80px', key: 'role', align: 'center' },
    {
      title: '禁用解禁',
      width: '80px',
      key: 'flag',
      customSlot: 'flag',
      align: 'center'
    },
    {
      title: '操作',
      width: '150px',
      customSlot: 'operator',
      key: 'operator',
      fixed: 'right',
      ignoreExport: true,
      align: 'center'
    }
  ])

  // 用户列表总数据
  const listData = ref([])
  /* layui表格的数据源 */
  const dataSource = ref([])

  // 页面变化
  const change = (page) => {
    loading.value = true
    setTimeout(() => {
      // if (search.username) {
      //   getList()
      // } else {
      //   searchList()
      // }
      dataSource.value = loadDataSource(page.current, page.limit)
      loading.value = false
    }, 1000)
  }

  // 排序变化
  const sortChange = (key, sort) => {
    layer.msg(`字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`)
  }
  /* 用户列表接口 */
  const getList = async () => {
    // 开始发送请求
    let { list } = await proxy.$api.getUserList(userStore.user.id)
    // 给table数据赋值
    listData.value = list
    page.total = list.length
    dataSource.value = loadDataSource(page.current, page.limit)
  }
  /* 直接调用请求数据 */
  getList()

  /* 查询数据接口 */
  const searchList = async () => {
    // 开始发送请求
    let { list } = await proxy.$api.getUserSearch(
      userStore.user.id,
      search.username
    )
    listData.value = list
    page.total = list.length
    dataSource.value = loadDataSource(page.current, page.limit)
  }

  /* 查询事件 */
  const searchClick = () => {
    // 如果有关键字 就请求查询接口 没有就请求用户列表

    search.username ? searchList() : getList()
  }

  /* 禁用/解禁 */
  const restFlag = async (row) => {
    // 传给接口的数据, 管理员id 重置用户id
    let params = {
      id: userStore.user.id,
      uid: row.id
    }
    // 开始发送请求
    let { message, code } = await proxy.$api.updateFlag(params)
    // code == 1 操作成功
    if (code == 1) {
      layer.msg(message, { time: 1000, icon: 6 })
      search.username ? searchList() : getList()
    }
  }

  /* 重置密码 */
  const restPs = async (row) => {
    // 传给接口的数据, 管理员id 重置用户id
    let params = {
      id: userStore.user.id,
      uid: row.id
    }
    // 开始发送请求
    let { message, code } = await proxy.$api.updatePos(params)
    // code == 1 操作成功
    if (code == 1) {
      layer.msg(message, { time: 1000, icon: 6 })
    }
  }

  /* 删除用户 */
  const userDel = async (row) => {
    // 传给接口的数据, 管理员id 重置用户id
    let params = {
      id: userStore.user.id,
      uid: row.id
    }
    let { message, code } = await proxy.$api.delUser(params)
    // code == 1 操作成功
    if (code == 1) {
      layer.msg(message, { time: 1000, icon: 6 })
      search.username ? searchList() : getList()
    }
  }
  /* 分页处理 */
  const loadDataSource = (page, pageSize) => {

    let response = [] // 分页处理数据
    let startIndex = (page - 1) * pageSize // 每一页数据开始的index
    let endIndex = page * pageSize - 1 // 每一页数据结束的index
    // 如果每一页数据结束index >= 数据的length,说明数据到了最后一页 让endIndx 直接 等于数据length-1
    // 否则就给endIndex复原
    if (endIndex >= listData.value.length - 1) {
      endIndex = listData.value.length - 1
    } else {
      endIndex = page * pageSize - 1
    }
    for (let i = startIndex; i <= endIndex; i++) {
      response.push(listData.value[i])
    }
    return response
  }
</script>

<template>
  <lay-container>
    <div class="user_page">
      <div class="top">
        <lay-form :model="search">
          <lay-form-item label="用户名:" prop="username" mode="inline">
            <lay-input v-model="search.username"></lay-input>
          </lay-form-item>
          <lay-form-item mode="inline">
            <lay-button type="primary" @click="searchClick">搜索</lay-button>
          </lay-form-item>
        </lay-form>
      </div>
      <div class="table">
        <lay-table :page="page" :resize="true" height="600px" :columns="columns" :loading="loading"
          :default-toolbar="true" :data-source="dataSource" v-model:selected-keys="selectedKeys" @change="change"
          @sortChange="sortChange">
          <template #flag="{ row }">
            <lay-button size="xs" type="warm" v-if="row.flag" @click="restFlag(row)">
              禁用
            </lay-button>
            <lay-button v-else size="xs" type="primary" @click="restFlag(row)">解禁</lay-button>
          </template>
          <template v-slot:toolbar>
            <span class="table_title">用户列表</span>
          </template>
          <template v-slot:operator="{ row }">
            <lay-button size="xs" type="primary" @click="restPs(row)">重置密码</lay-button>
            <lay-button size="xs" type="danger" prefix-icon="layui-icon-delete" @click="userDel(row)">
              删除
            </lay-button>
          </template>
        </lay-table>
      </div>
    </div>
  </lay-container>
</template>

<style lang="scss" scoped>
  .layui-container {
    padding: 0;
  }

  .user_page {
    .top {
      padding-top: 20px;
    }

    .table {
      .table_title {
        font-size: 18px;
        font-weight: 700;
      }
    }
  }
</style>