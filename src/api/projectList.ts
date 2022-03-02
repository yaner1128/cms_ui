import request from '@/utils/request'

export function getProjectList (data: any, pageData: {currentPage: number, pageSize: number}) {
  return request({
    url: `/ctms-project/getProjectsList?currentPageIndex=${pageData.currentPage}&pageSize=${pageData.pageSize}`,
    method: 'post',
    data: data
  })
}
