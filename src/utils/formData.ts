
function handleFd (params: any) {
  const fd = new FormData()
  for (const key in params) {
    fd.append(key, params[key])
  }
  return fd
}
export default handleFd
