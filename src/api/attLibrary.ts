import request from '@/utils/request'
// 查询列表
export function getAttLibrary (data: string) {
  return request({
    url: '/ctms-user/enclosure/SearchBoxQuery?' + data,
    method: 'post'
  })
}
// 删除
export function removeEnclosure (attachmentId: number) {
  return request({
    url: `/ctms-user/enclosure/remove?attachmentId=${attachmentId}`,
    method: 'post'
  })
}
export function downloadFile (attachUrl: string) {
  return request({
    url: `/ctms-user/file/downloadFile?savePath=${attachUrl}`,
    method: 'get'
  })
}
