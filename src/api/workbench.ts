import request from '@/utils/request'
// 工作台列表
export function getProjectUndoneList (pageData: { currentPage: number, pageSize: number}) {
  return request({
    url: `/prjProjects/getProjectUndoneList?currentPageIndex=${pageData.currentPage}&pageSize=${pageData.pageSize}`,
    method: 'post'
  })
}
// 我的收款情况
export function getAllCollectionPlans (params: any) {
  return request({
    url: '/prjPaymentPlan/getAllCollectionPlans',
    method: 'get'
  })
}
// 我的项目情况
export function getListUnfinishedProjects (params: any) {
  return request({
    url: '/prjProjects/getListUnfinishedProjects',
    method: 'post'
  })
}
