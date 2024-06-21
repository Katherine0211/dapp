<script setup>
import { ref } from 'vue'
import { useUserstore } from '@/store/user' // 导入用户状态管理数据
import { layer } from '@layui/layui-vue' // 导入layui的弹窗组件

const userStore = useUserstore() // 获取当前用户信息

const fileData = ref([]) // 上传组件绑定的file数据

/* 上传组件 */
const uploadRef = ref(null)

/* table组件的每一列的数据配置 */
const columns4 = [
  {
    title: '文件名',
    width: '280px',
    key: 'name',
    fixed: 'left'
  },
  {
    title: '大小',
    width: '80px',
    key: 'size'
  },
  { 
    title: '上传进度',
    width: '150px',
    key: 'progress',
    customSlot: 'progress'
  },
  {
    title: '操作',
    width: '90px',
    key: 'motto',
    customSlot: 'oprate'
  }
]
const dataSource4 = ref([]) // table的数据源
// 上传-选择文件后回调
const changeUpload = (e) => {
  let fileArr = e.target.files
  dataSource4.value.push({
    id: fileArr.length,
    name: fileArr[0].name,
    size: (fileArr[0].size / 1024).toFixed(1) + 'kb',
    progress: 0,
    ...fileArr[0]
  })
}
/* 手动上传 */
const handleUpload = () => {
  uploadRef.value.submit()
}

/* 上传完毕回调 */
const uploadDone = (event) => {
  let {code, data, message} = JSON.parse(event.data)
  if (code == 1) {
    layer.msg(message, { time: 1000, icon: 6 })
    let length = dataSource4.value.length - 1
    dataSource4.value[length].progress = 100
  }
}
/* 删除未上传的数据 */
const delUpload = (row) => {
  dataSource4.value = dataSource4.value.slice(1,row)
  
}

</script>

<template>
  <lay-container>
    <div class="add_page">
      <lay-upload
        ref="uploadRef"
        url="http://127.0.0.1:9000/carousel/backend/add"
        v-model="fileData"
        field="carousel"
        :data="{id: userStore.user.id}"
        :headers="{authorization: userStore.token}"
        :auto="false"
        @change="changeUpload"
        @done="uploadDone"
      >
        <lay-button type="normal">选择上传的文件</lay-button>
      </lay-upload>
      <div class="add_body">
        <lay-table :columns="columns4" :data-source="dataSource4">
          <template #name="{ row }">
            <lay-input v-model="row.name" />
          </template>
          <template #progress="{ row }">
            <div style="width: 80%">
              <lay-progress :percent="row.progress"></lay-progress>
            </div>
          </template>
          <template #oprate="{ row }">
            <template v-if="row.progress == 0">
              <lay-button
                size="xs"
                type="danger"
                @click="delUpload(row)"
              >
                删除
              </lay-button>
            </template>
            <template v-else>
            </template>
          </template>
        </lay-table>
      </div>
      <div class="up_box">
        <lay-button type="primary" @click="handleUpload">开始上传</lay-button>
      </div>
    </div>
  </lay-container>
</template>

<style lang="scss" scoped>
.layui-container {
  padding: 0;
}
.add_page {
  padding: 20px;

  .add_body {
    margin: 20px 0;
  }
}
</style>
