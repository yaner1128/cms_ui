import request from '@/utils/request'

export function login (params: any) {
  return request({
    url: '/ctms-auth/oauth/token',
    method: 'post',
    params
  })
}
