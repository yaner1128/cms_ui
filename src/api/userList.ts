import request from '@/utils/request'
// 查询
export function userInformationQuery (params: any) {
  return request({
    url: '/staff/userInformationQuery',
    method: 'post',
    params
  })
}
// 新增
export function addUserInformation (params: any) {
  return request({
    url: '/staff/addUserInformation',
    method: 'post',
    params
  })
}
// 修改
export function updataUserInfo (params: any) {
  return request({
    url: '/staff/modifyBasicUserInformation',
    method: 'post',
    params
  })
}
// 删除
export function deleteUserInformation (employeeId: number) {
  return request({
    url: `/staff/deleteUserInformation?employeeId=${employeeId}`,
    method: 'post'
  })
}
// 部门列表
export function queryAllDepartmentNames () {
  return request({
    url: '/departments/queryAllDepartmentNames',
    method: 'post'
  })
}
// 获取职位
export function getJobByDepartId (depId: number) {
  return request({
    url: '/positions/queryByPositionID?depId=' + depId,
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
