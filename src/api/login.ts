import request from '@/utils/request'

export function login (params: any) {
  return request({
    url: '/ctms-auth/oauth/token',
    method: 'post',
    params
  })
}
// 根据用户名获取用户信息
export function loadByUsername () {
  return request({
    url: '/ctms-user/staff/getLoginUserInformation',
    method: 'get'
  })
}
