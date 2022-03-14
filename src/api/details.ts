import request from '@/utils/request'
// 采购合同
export function getContractsByStatus (data:{ projectId:number }) {
  return request({
    url: '/prjContracts/getContractsByStatus',
    method: 'post',
    data: data
  })
}
// 销售合同
export function getSalesContract (data:{ projectId: number }) {
  return request({
    url: `/prjContracts/getSalesContract?projectId=${data.projectId}`,
    method: 'post'
  })
}
// 付款计划
export function getSelectContractId (data:{ projectId: number }) {
  return request({
    url: `/prjPaymentPlan/selectContractId?contractId=${data.projectId}`,
    method: 'post'
  })
}
// 获取项目详情
export function getDetails (params: { id: number}) {
  return request({
    url: '/prjProjects/selectdDtails?projectId=' + params.id,
    method: 'get'
  })
}
// 编辑项目详情
export function updateDetails (data: any) {
  return request({
    url: '/prjProjects/updateProjectsById',
    method: 'post',
    data
  })
}
// 步骤条数据
export function getProjectOverview (data: { id: number}) {
  return request({
    url: '/prjProjects/getProjectOverview?projectId=' + data.id,
    method: 'post',
    data
  })
}

export function getContractDetails (params: any) {
  return request({
    url: 'api/contractDetails?id=' + params.id,
    method: 'post'
  })
}
