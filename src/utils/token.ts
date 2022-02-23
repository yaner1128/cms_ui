import Cookies from 'js-cookie'

const TokenKey = 'tokenKey'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token: string, rememberMe: boolean) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: 1 })
  } else return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 获取用户信息
export function getUserInfo () {
  return Cookies.get('userInfo')
}
// 保存用户信息
export function setUserInfo (userInfo: string) {
  return Cookies.set('userInfo', userInfo, { expires: 1 })
}
// 移除用户信息
export function removeUserInfo () {
  return Cookies.remove('userInfo')
}
