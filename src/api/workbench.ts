import request from '@/utils/request'

export function getWorkList (data: any) {
  return request({
    url: 'api/workList?id=' + data.id,
    method: 'post'
  })
}

// export function getAllRoleList (params: any) {
//   return request({
//     url: 'api/allRoleList',
//     method: 'post',
//     data: params
//   })
// }
