import request from '@/utils/request'
import qs from 'qs'

// 行政区划级别
export function getSelectArea () {
  return request({
    url: '/ctms-user/zoning/selectArea',
    method: 'post'
  })
}
// 市级行政区划
export function getSelectParent (data: { parentCode: number | string }) {
  return request({
    url: `/ctms-user/zoning/selectParent?parentCode=${data.parentCode}`,
    method: 'post'
  })
}
// 产品
export function getProducts () {
  return request({
    url: '/ctms-project/prjProducts/getProducts',
    method: 'post'
  })
}
// 责任人
export function getUserList () {
  return request({
    url: '/ctms-user/staff/selectParent',
    method: 'post'
  })
}
// 新增
export function insertBatchSomeColumn (data: any) {
  return request({
    url: '/ctms-project/prjProjects/insertBatchSomeColumn',
    method: 'post',
    data: data
  })
}
