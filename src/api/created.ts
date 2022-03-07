import request from '@/utils/request'

// 行政区划级别
export function getSelectArea () {
  return request({
    url: '/zoning/selectArea',
    method: 'post'
  })
}
// 市级行政区划
export function getSelectParent (data: { parentCode: number | string }) {
  return request({
    url: `/zoning/selectParent?parentCode=${data.parentCode}`,
    method: 'post'
  })
}
// 产品
export function getProducts () {
  return request({
    url: '/prjProducts/getProducts',
    method: 'get'
  })
}
// 责任人
export function getUserList () {
  return request({
    url: '/staff/selectParent',
    method: 'post'
  })
}
// 新增
export function insertBatchSomeColumn (data: string) {
  return request({
    url: '/prjProjects/insertBatchSomeColumn?' + data,
    method: 'post'
  })
}
