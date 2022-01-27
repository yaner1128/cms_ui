import request from '@/utils/request'

export function getUserList () {
  return request({
    url: '/api/userList',
    method: 'get'
  })
}
