function exportClick (attachUrl: string) {
  const url = `/file/downloadFile?savePath=${attachUrl}`
  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
}
export default exportClick
