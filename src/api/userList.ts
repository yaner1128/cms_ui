import request from '@/utils/request'

export function getList () {
  return request({
    url: 'api/userList',
    method: 'get'
  })
}
