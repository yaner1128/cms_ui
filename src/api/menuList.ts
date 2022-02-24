import request from '@/utils/request'

export function getMenuList (data: any) {
  return request({
    url: 'api/menuList',
    method: 'post',
    data: data
  })
}
