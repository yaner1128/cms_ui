import request from '@/utils/request'
// 采购合同
export function getContractsByStatus (data:{ inStatus: number, projectId:number }) {
  return request({
    url: '/ctms-project/prjcontracts/getContractsByStatus',
    method: 'post',
    data: data
  })
}
// 销售合同
export function getSalesContract (data:{ projectId: number }) {
  return request({
    url: `/ctms-project/prjcontracts/getSalesContract?projectId=${data.projectId}`,
    method: 'post'
  })
}
// 付款计划
export function getSelectContractId (data:{ projectId: number }) {
  return request({
    url: `/ctms-project/payment/selectContractId?contractId=${data.projectId}`,
    method: 'post'
  })
}
// 获取项目详情
export function getDetails (params: { id: number}) {
  return request({
    url: '/ctms-project/project/detail?projectId=' + params.id,
    method: 'get'
  })
}

export function getContractDetails (params: any) {
  return request({
    url: 'api/contractDetails?id=' + params.id,
    method: 'post'
  })
}
