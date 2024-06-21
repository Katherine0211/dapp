import { createPinia } from 'pinia' // 导入状态管理器pinia

import createPersistedState from 'pinia-plugin-persistedstate' // 导入状态管理器永久储存插件

const pinia = createPinia() // 实例化pinia

pinia.use(createPersistedState) // pinia使用永久储存插件


export default pinia // 导出pinia全局使用