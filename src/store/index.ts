import { createStore } from 'vuex'
import { login } from '@/api/login'
import { getToken, removeToken, setUserInfo, removeUserInfo } from '@/utils/token'

export default createStore({
  state: {
    token: getToken(),
    userInfo: {
      id: '',
      username: ''
    },
    active: 0
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, userInfo) => {
      state.token = userInfo
    },
    SET_SETUP: (state, active) => {
      state.active = active
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      const username = userInfo.username
      const password = userInfo.password
      const rememberMe = userInfo.rememberMe
      return new Promise<void>((resolve, reject) => {
        login({ username, password, rememberMe }).then((res) => {
          setUserInfo(JSON.stringify(userInfo))
          localStorage.setItem('permission', JSON.stringify([username]))
          commit('SET_TOKEN', res.data[0].data.token)
          resolve()
        }).catch((error: string) => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut ({ commit }) {
      localStorage.setItem('permission', '')
      commit('SET_TOKEN', '')
      removeUserInfo()
      // removeToken()
    }
  },
  modules: {
  }
})
