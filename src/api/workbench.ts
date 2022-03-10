import request from '@/utils/request'
// 工作台列表
export function getProjectUndoneList (params: { currentPageIndex: number, pageSize: number}) {
  return request({
    url: '/prjProjects/getProjectUndoneList',
    method: 'post',
    params
  })
}
// 我的收款情况
export function getAllCollectionPlans () {
  return request({
    url: '/prjPaymentPlan/getAllCollectionPlans',
    method: 'get'
  })
}
// 我的项目情况
export function getListUnfinishedProjects () {
  return request({
    url: '/prjProjects/getListUnfinishedProjects',
    method: 'post'
  })
}
