import request from '@/utils/request'

// 查询全部岗位信息
export function positionsAll (params: { currentPageIndex: number, pageSize: number }) {
  return request({
    url: '/ctms-user/positions/all',
    method: 'get',
    params
  })
}
// 新增
export function positionsAdd (data: any) {
  return request({
    url: '/ctms-user/positions/add',
    method: 'post',
    data
  })
}
// 修改岗位信息
export function positionsUpdate (data: any) {
  return request({
    url: '/ctms-user/positions/update',
    method: 'post',
    data
  })
}
// 删除
export function positionsRemove (positionId: number) {
  return request({
    url: '/ctms-user/positions/remove?positionId=' + positionId,
    method: 'post'
  })
}
export function permissionsById (data: any) {
  return request({
    url: '/ctms-user/basPosPermission/permissionsById',
    method: 'post',
    data
  })
}
