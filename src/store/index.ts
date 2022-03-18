import { createStore } from 'vuex'
import { login } from '@/api/login'
import { getToken, setToken, removeToken, removeUserInfo } from '@/utils/token'

export default createStore({
  state: {
    token: getToken(),
    userInfo: {},
    active: 0,
    isSale: false,
    menu: [],
    temp: []
  },
  mutations: {
    SET_TOKEN: (state, tokenData) => {
      state.token = tokenData.token
      localStorage.setItem('token', tokenData.token)
      setToken(tokenData)
    },
    SET_USER: (state, userInfo) => {
      state.token = userInfo
    },
    SET_SETUP: (state, active) => {
      state.active = active
    },
    changeSale: (state, isSale) => {
      if (Array.isArray(isSale) && isSale.length > 0) {
        state.isSale = true
      }
    },
    setUser: (state, userInfo) => {
      state.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    getUser: (state) => {
      if (JSON.stringify(state.userInfo) === '{}') {
        state.userInfo = JSON.parse(localStorage.getItem('userInfo') || '')
      }
    },
    setMenu: (state, menu: never[]) => {
      if (Array.isArray(menu) && menu.length > 0) {
        state.menu = menu
      } else {
        state.menu = JSON.parse(localStorage.getItem('menu') || '')
      }
    },
    setTemp: (state, temp) => {
      state.temp = temp
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      const params = Object.assign({
        client_id: 'ctms-web',
        client_secret: '123456',
        grant_type: 'password',
        username: userInfo.username,
        password: userInfo.password
      }, {})
      return new Promise<void>((resolve, reject) => {
        login(params).then((res) => {
          localStorage.setItem('permission', JSON.stringify([userInfo.username]))
          commit('SET_TOKEN', res.data.data)
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
      removeToken()
    }
  },
  modules: {
  }
})
