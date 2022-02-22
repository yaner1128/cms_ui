import request from '@/utils/request'

export function getUserList (data: any) {
  return request({
    url: 'api/userList',
    method: 'post'
  })
}

export function getAllRoleList (params: any) {
  return request({
    url: 'api/allRoleList',
    method: 'post',
    data: params
  })
}

export function getRoleList (data: any) {
  return request({
    url: 'api/roleList?id=' + data.id,
    method: 'post'
  })
}
