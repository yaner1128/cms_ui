import request from '@/utils/request'

export function getProjectList (data: any) {
  return request({
    url: `ctms-project/getProjectsList?currentPageIndex=${data.currentPage}&pageSize=${data.pageSize}`,
    method: 'get',
    data: data
  })
}
