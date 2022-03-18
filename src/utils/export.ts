function exportClick (attachUrl: string) {
  const url = `/ctms-user/file/downloadFile?savePath=${attachUrl}`
  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
}
export default exportClick
