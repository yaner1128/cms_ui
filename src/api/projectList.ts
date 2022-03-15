import request from '@/utils/request'
// 项目列表查询
export function getProjectList (data: any, pageData: {currentPage: number, pageSize: number}) {
  return request({
    url: `/ctms-project/prjProjects/getProjectsLists?currentPageIndex=${pageData.currentPage}&pageSize=${pageData.pageSize}`,
    method: 'post',
    data
  })
}
