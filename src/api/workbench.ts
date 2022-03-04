import request from '@/utils/request'

export function getProjectUndoneList (pageData: { currentPage: number, pageSize: number}) {
  return request({
    url: `/ctms-project/getProjectUndoneList?currentPageIndex=${pageData.currentPage}&pageSize=${pageData.pageSize}`,
    method: 'post'
  })
}
// 我的收款情况
export function getAllCollectionPlans (params: any) {
  return request({
    url: '/ctms-project/getAllCollectionPlans',
    method: 'get'
  })
}
// 我的项目情况
export function getListUnfinishedProjects (params: any) {
  return request({
    url: '/ctms-project/getListUnfinishedProjects',
    method: 'post'
  })
}
