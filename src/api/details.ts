import request from '@/utils/request'
// 采购合同
export function getContractsByStatus (data:{ projectId:number }) {
  return request({
    url: '/ctms-project/prjContracts/getContractsByStatus',
    method: 'post',
    data: data
  })
}
// 销售合同
export function getSalesContract (data:{ projectId: number }) {
  return request({
    url: `/ctms-project/prjContracts/getSalesContract?projectId=${data.projectId}`,
    method: 'post'
  })
}
// 付款计划
export function getSelectContractId (data:{ projectId: number }) {
  return request({
    url: `/ctms-project/prjPaymentPlan/selectContractId?projectId=${data.projectId}`,
    method: 'post'
  })
}
// 获取项目详情
export function getDetails (params: { id: number}) {
  return request({
    url: '/ctms-project/prjProjects/selectdDtails?projectId=' + params.id,
    method: 'get'
  })
}
// 编辑项目详情
export function updateDetails (data: any) {
  return request({
    url: '/ctms-project/prjProjects/updateProjectsById',
    method: 'post',
    data
  })
}
// 步骤条数据
export function getProjectOverview (data: { id: number}) {
  return request({
    url: '/ctms-project/prjProjects/getProjectOverview?projectId=' + data.id,
    method: 'post',
    data
  })
}
