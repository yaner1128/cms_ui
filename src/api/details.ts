import request from '@/utils/request'

export function getDetails (data: any) {
  return request({
    url: 'api/details',
    method: 'post',
    data: data
  })
}
