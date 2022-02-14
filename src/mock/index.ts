/* eslint-disable no-debugger */
import Mock from 'mockjs'

Mock.setup({
  timeout: '1000'
})

let configArray: any[] = []

// 使用webpack的require.context()遍历所有mock文件
const files = require.context('.', true, /\.ts$/)
files.keys().forEach((key) => {
  if (key === './index.ts') return
  configArray = configArray.concat(files(key).default)
})
debugger
configArray.forEach((item) => {
  console.log(item)
  for (const [path, target] of Object.entries(item)) {
    const protocol = path.split('|')
    Mock.mock(new RegExp('^' + protocol[1]), protocol[0], target)
  }
})
