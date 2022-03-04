import { reactive, toRefs } from 'vue'

export function page () {
  const page = reactive({
    currentPage: 1,
    pageSize: 10,
    small: false,
    background: true,
    disabled: false,
    total: 1
  })
  const pageData = toRefs(page)

  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
  }
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
  }

  return { pageData, handleSizeChange, handleCurrentChange }
}
