<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { layer } from '@layui/layui-vue'
const { proxy } = getCurrentInstance() // 获取vue全局的自定义属性
import { useUserstore } from '@/store/user' // 导入用户状态管理数据


const userStore = useUserstore() // 获取当前用户信息
const listData = ref([]) // 轮播图列表数据

/* 获取轮播图列表 */
const getList = async () => {
  let { code, list } = await proxy.$api.getCarouselList()
  if (code == 1) {
    listData.value = list
  }
}
/* 直接调用 */
getList()


/* 删除轮播图 */
const delCar = async (row) => {
  // 传给接口的数据, 管理员id 轮播图id
  let params = {
    id: userStore.user.id,
    imgId: row
  }
  let { code, message } = await proxy.$api.delCarousel(params)
  if (code == 1) {
    layer.msg(message, { time: 1000, icon: 6 })
    getList()
  }
}
</script>

<template>
  <lay-container fluid>
    <div class="list_page">
      <lay-row space="30">
        <lay-col
          md="8"
          sm="12"
          xs="24"
          v-for="(item, index) in listData"
          :key="index"
        >
          <div class="img_box">
            <lay-icon type="layui-icon-close-fill" class="close_btn" @click="delCar(item.id)"></lay-icon>
            <img :src="haveDomain(item.name)" alt="" />
          </div>
        </lay-col>
      </lay-row>
    </div>
  </lay-container>
</template>

<style lang="scss" scoped>
.list_page {
  padding: 20px;
  height: calc(100vh - 100px);
  overflow-y: auto;
}
.img_box {
  position: relative;
  .close_btn {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
    font-size: 40px;
    color: rgba(255,255,255, .6);
  }
  .close_btn:hover {
    color: rgb(255, 87, 34, .6);
  }
  img {
    width: 100%;
    border-radius: 20px;
    height: 200px;
  }
}
</style>
