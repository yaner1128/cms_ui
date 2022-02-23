import request from '@/utils/request'

export function login (data: { username: string, password: string, rememberMe: boolean }) {
  return request({
    url: 'api/login',
    method: 'post',
    data: data
  })
}
