import { defineStore } from 'pinia'

/**
 * 存储用户信息
 */
export const useUserstore = defineStore({
  id: 'user',
  state: () => ({
    user: null,
    token: null
  }),
  actions: {
    login(user, token) {
      this.user = user
      this.token = token
    },
    logout() {
      this.user = null
      this.token = null
    }
  },

  persist: {
    storage: localStorage,
    paths: ['user', 'token'],
    beforeRestore: (ctx) => {},
    afterRestore: async (ctx) => {}
  }
})
