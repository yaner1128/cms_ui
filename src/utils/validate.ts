import { Ref, unref } from 'vue'

/**
 * 表单校验
 * @param ref 节点
 * @param isGetError 是否获取错误项
 */
export async function validate (ref: Ref|any, isGetError = false):Promise<boolean | {valid: boolean, object: any}> {
  // eslint-disable-next-line no-debugger
  debugger
  const validateFn = unref(ref).validate
  return new Promise(resolve => validateFn((valid:boolean, object: any) => isGetError ? resolve({ valid, object }) : resolve(valid)))
}
