import request from '@/utils/request'
// 查询部门
export function getAllDepartmentsPage (params: any) {
  return request({
    url: '/ctms-user/departments/getAllDepartmentsPage',
    method: 'post',
    params
  })
}
// 新增
export function addDepart (data: any) {
  return request({
    url: '/ctms-user/departments/add',
    method: 'post',
    data
  })
}
// 修改
export function updateDepart (data: any) {
  return request({
    url: '/ctms-user/departments/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteDepart (depId: number) {
  return request({
    url: '/ctms-user/departments/delete?depId=' + depId,
    method: 'post'
  })
}
