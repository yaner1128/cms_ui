import request from '@/utils/request'

export function getAttLibrary (pageData: {currentPage: number, pageSize: number}) {
  return request({
    url: `/enclosure/detail?currentPageIndex=${pageData.currentPage}&pageSize=${pageData.pageSize}`,
    method: 'get'
  })
}
