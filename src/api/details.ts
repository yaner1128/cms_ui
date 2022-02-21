import request from '@/utils/request'

export function getDetails (data: any) {
  return request({
    url: 'api/demo',
    method: 'post',
    data: data
  })
}
