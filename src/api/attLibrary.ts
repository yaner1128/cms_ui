import request from '@/utils/request'
// 查询列表
export function getAttLibrary (data: string) {
  return request({
    url: '/ctms-user/enclosure/SearchBoxQuery?' + data,
    method: 'post'
  })
}
// 新增或修改
export function addEnclosure (data: string) {
  return request({
    url: '/ctms-user/enclosure/submit?' + data,
    method: 'post'
  })
}
// 删除
export function deleteEnclosure (attachmentId: number) {
  return request({
    url: `/ctms-user/enclosure/remove?attachmentId=${attachmentId}`,
    method: 'post'
  })
}
