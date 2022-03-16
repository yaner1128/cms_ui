import Cookies from 'js-cookie'

const TokenKey = 'ctms-web'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (tokenData: any) {
  return Cookies.set(TokenKey, tokenData.token, { expires: 1 })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 获取用户信息
export function getUserInfo () {
  return localStorage.getItem('userInfo') || {}
}
// 移除用户信息
export function removeUserInfo () {
  return localStorage.removeItem('userInfo')
}
