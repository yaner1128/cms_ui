import request from '@/utils/request'

export function getAttLibrary (data: any) {
  return request({
    url: 'api/attLibrary',
    method: 'post',
    data: data
  })
}
