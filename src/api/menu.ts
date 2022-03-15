import request from '@/utils/request'
// 查询菜单
export function getAllMenuList (permissionName: string) {
  return request({
    url: '/ctms-user/permission/getAllMenuList?permissionName=' + permissionName,
    method: 'post'
  })
}
// 新增
export function permissionAdd (params: any) {
  return request({
    url: '/ctms-user/permission/add',
    method: 'post',
    params
  })
}
// 编辑
export function permissionUpdate (params: any) {
  return request({
    url: '/ctms-user/permission/update',
    method: 'post',
    params
  })
}
// 删除
// 编辑
export function permissionDelete (permissionId: number) {
  return request({
    url: '/ctms-user/permission/delete?permissionId=' + permissionId,
    method: 'post'
  })
}
