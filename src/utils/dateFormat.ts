// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function format (date: Date, fmt: string) {
  const ss = new Map([
    [/(M+)/, date.getMonth() + 1],
    [/(d+)/, date.getDate()],
    [/(H+)/, date.getHours()],
    [/(h+)/, date.getHours() % 12],
    [/(m+)/, date.getMinutes()],
    [/(s+)/, date.getSeconds()],
    [/(q+)/, Math.floor((date.getMonth() + 3) / 3)],
    [/(S)/, date.getMilliseconds()]
  ])
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, date.getFullYear().toString().substr(4 - RegExp.$1.length))
  }
  ss.forEach((val, key) => {
    if (key.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? val.toString() : ((`00${val}`).substr(val.toString().length)))
    }
  })
  return fmt
}
