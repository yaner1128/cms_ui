import request from '@/utils/request'

export function getDetails (params: any) {
  return request({
    url: 'api/detail?id=' + params.id,
    method: 'post'
  })
}

export function getContractDetails (params: any) {
  return request({
    url: 'api/contractDetails?id=' + params.id,
    method: 'post'
  })
}
