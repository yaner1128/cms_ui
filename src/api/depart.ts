import request from '@/utils/request'
// 查询部门
export function getAllDepartmentsPage (params: any) {
  return request({
    url: '/departments/getAllDepartmentsPage',
    method: 'post',
    params
  })
}
// 新增
export function addDepart (data: any) {
  return request({
    url: '/departments/add',
    method: 'post',
    data
  })
}
