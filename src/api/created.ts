import request from '@/utils/request'

export function getOwnerList () {
  return request({
    url: 'api/ownerList',
    method: 'post'
  })
}
export function getProductList () {
  return request({
    url: 'api/productList',
    method: 'post'
  })
}
export function getRegionList () {
  return request({
    url: 'api/regionList',
    method: 'post'
  })
}
