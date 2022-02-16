import request from '@/utils/request'

export function getOwnerList () {
  return request({
    url: 'api/getOwnerList',
    method: 'post'
  })
}
export function regionList () {
  return request({
    url: 'api/regionList',
    method: 'post'
  })
}
export function getProductList () {
  return request({
    url: 'api/productList',
    method: 'post'
  })
}
