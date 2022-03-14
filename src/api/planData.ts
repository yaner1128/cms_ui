import request from '@/utils/request'

// 新增
export function AddPaymentPlan (params: any) {
  return request({
    url: '/prjPaymentPlan/AddPaymentPlan',
    method: 'post',
    params
  })
}
// 修改岗位信息
export function modifyPaymentPlan (params: any) {
  return request({
    url: '/prjPaymentPlan/modifyPaymentPlan',
    method: 'post',
    params
  })
}
// 删除
export function deletePaymentPlan (paymentPlanId: number) {
  return request({
    url: '/prjPaymentPlan/deletePaymentPlan?paymentPlanId=' + paymentPlanId,
    method: 'post'
  })
}
