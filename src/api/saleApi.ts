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
export function updateSale (data: any) {
  return request({
    url: '/ctms-project/prjContracts/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteSale (contractId: number) {
  return request({
    url: '/ctms-project/prjContracts/delete?id=' + contractId,
    method: 'post'
  })
}
