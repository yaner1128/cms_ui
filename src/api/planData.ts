import request from '@/utils/request'

// 新增
export function AddPaymentPlan (data: any) {
  return request({
    url: '/ctms-project/prjPaymentPlan/AddPaymentPlan',
    method: 'post',
    data
  })
}
// 修改
export function modifyPaymentPlan (data: any) {
  return request({
    url: '/ctms-project/prjPaymentPlan/modifyPaymentPlan',
    method: 'post',
    data
  })
}
// 删除
export function deletePaymentPlan (paymentPlanId: number) {
  return request({
    url: '/ctms-project/prjPaymentPlan/deletePaymentPlan?paymentPlanId=' + paymentPlanId,
    method: 'post'
  })
}
