
function handleFd (params: any) {
  const fd = new FormData()
  for (const key in params) {
    if (key === 'file') {
      for (let i = 0; i < params[key].length; i++) {
        fd.append('file', params[key][i])
      }
    } else if (params[key] || params[key] === 0) {
      fd.append(key, params[key])
    }
  }
  return fd
}
export default handleFd
