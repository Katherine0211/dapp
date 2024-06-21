<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router' // 导入路由
const router = useRouter() // 实例化路由
const isTree = ref(true) // 菜单是否为tree结构
const selectedKey = ref('') // 选中的菜单
const openKeys = ref([]) // 展开的菜单id
const menus = reactive([]) // 菜单路由
/* 获取home的菜单 */
const addRouter = () => {
  let arr = router.options.routes.filter((e) => e.path == '/')
  menus.push(...arr[0].children)
}
addRouter()
/* 选中的菜单 */
const openMenu = (selectMenu, index) => {
  // 跳转对应的页面
  router.push({
    path: selectMenu.path
  })
  // 修改当前选中的菜单状态
  selectedKey.value = index
}
</script>
<template>
  <lay-menu
    v-model:selected-key="selectedKey"
    v-model:open-keys="openKeys"
    v-model:tree="isTree"
    collapse-transition
  >
    <template v-for="(item, index) in menus" :key="index">
      <lay-menu-item  :id="index" @click="openMenu(item, index)">
        <lay-icon :type="item.meta.icon"></lay-icon>
       <span> {{ item.meta.title }}</span>
      </lay-menu-item>
    </template>
  </lay-menu>
</template>

<style lang="scss" scoped>
.layui-nav-tree {
  padding: 0;
}
</style>
