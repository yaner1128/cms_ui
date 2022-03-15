import { createStore } from 'vuex'
import { login } from '@/api/login'
import { getToken, setToken, removeToken, setUserInfo, removeUserInfo } from '@/utils/token'

export default createStore({
  state: {
    token: getToken(),
    userInfo: {
      id: '',
      username: ''
    },
    active: 0,
    isSale: false
  },
  mutations: {
    SET_TOKEN: (state, tokenData) => {
      state.token = tokenData.token
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
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      console.log('params', userInfo)
      const params = Object.assign({
        client_id: 'ctms-web',
        client_secret: '123456',
        grant_type: 'password',
        username: userInfo.username,
        password: userInfo.password
      }, {})
      return new Promise<void>((resolve, reject) => {
        login(params).then((res) => {
          console.log('****res****', res)
          setUserInfo(JSON.stringify(userInfo))
          localStorage.setItem('permission', JSON.stringify([userInfo.username]))
          commit('SET_TOKEN', res.data.data)
          localStorage.setItem('takenData', JSON.stringify(res.data.data))
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
