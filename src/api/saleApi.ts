import request from '@/utils/request'

// 新增
export function addSale (data: any) {
  return request({
    url: '/ctms-project/prjContracts/add',
    method: 'post',
    data
  })
}
// 修改
export function updateSale (params: any) {
  return request({
    url: '/ctms-project/prjContracts/update',
    method: 'post',
    params
  })
}
