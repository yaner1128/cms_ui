import request from '@/utils/request'

export function getProjectList (data: any) {
  return request({
    url: 'api/projectList',
    method: 'post',
    data: data
  })
}
