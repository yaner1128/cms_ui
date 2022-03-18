import request from '@/utils/request'
// 查询
export function userInformationQuery (params: any) {
  return request({
    url: '/ctms-user/staff/userInformationQuery',
    method: 'post',
    params
  })
}
// 新增
export function addUserInformation (params: any) {
  return request({
    url: '/ctms-user/staff/addUserInformation',
    method: 'post',
    params
  })
}
// 修改
export function updataUserInfo (params: any) {
  return request({
    url: '/ctms-user/staff/updateInformation',
    method: 'post',
    params
  })
}
// 删除
export function deleteUserInformation (employeeId: number) {
  return request({
    url: `/ctms-user/staff/deleteUserById?employeeId=${employeeId}`,
    method: 'post'
  })
}
// 部门列表
export function queryAllDepartmentNames () {
  return request({
    url: '/ctms-user/departments/queryAllDepartmentNames',
    method: 'post'
  })
}
// 获取职位
export function getJobByDepartId (depId: number) {
  return request({
    url: '/ctms-user/positions/queryByPositionId?depId=' + depId,
    method: 'post'
  })
}
