import request from '@/utils/request'
// 查询部门
export function selectCompanys () {
  return request({
    url: '/ctms-user/companys/selectCompanys',
    method: 'post'
  })
}
