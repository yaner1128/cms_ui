import request from '@/utils/request'

export function getWorkList (data: any) {
  return request({
    url: 'api/workList?id=' + data.id,
    method: 'post'
  })
}

export function getPieData (params: any) {
  return request({
    url: 'api/workList',
    method: 'post',
    data: params
  })
}
