import request from '@/utils/request'
// 查询菜单
export function getAllMenuList (permissionName: string) {
  return request({
    url: '/permission/getAllMenuList?permissionName=' + permissionName,
    method: 'post'
  })
}
// 新增
export function permissionAdd (params: any) {
  return request({
    url: '/permission/add',
    method: 'post',
    params
  })
}
// 编辑
export function permissionUpdate (params: any) {
  return request({
    url: '/permission/update',
    method: 'post',
    params
  })
}
// 删除
// 编辑
export function permissionDelete (permissionId: number) {
  return request({
    url: '/permission/delete?permissionId=' + permissionId,
    method: 'post'
  })
}
