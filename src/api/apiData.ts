import request from '@/utils/request'

// 查询全部接口
export function queryResourceAddress () {
  return request({
    url: '/resources/queryResourceAddress',
    method: 'post'
  })
}
// 新增
export function addInterface (params: any) {
  return request({
    url: '/resources/addInterface',
    method: 'post',
    params
  })
}
// 修改信息
export function updateInterface (params: any) {
  return request({
    url: '/resources/modifyApiResourceInformation',
    method: 'post',
    params
  })
}
// 删除
export function deleteInterface (apiId: number) {
  return request({
    url: '/resources/deleteApiResourceInformation?apiId=' + apiId,
    method: 'post'
  })
}
