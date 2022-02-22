import request from '@/utils/request'

export function getAttLibrary () {
  return request({
    url: 'api/attLibrary',
    method: 'post'
  })
}
