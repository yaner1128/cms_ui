<template>
  <div class='departBox'>
    <div class="handleClickBox">
      <div class="buttonBox">
        <el-button type="primary" @click="add">+ 添加</el-button>
      </div>
      <div class="formBox">
        <el-input v-model="selectName" placeholder="请输入名称"></el-input>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" border
      row-key="id"
      default-expand-all
    >
      <el-table-column type="selection" />
      <el-table-column fixed prop="name" label="名称" />
      <el-table-column prop="parentId" label="职位编码" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="createDate" label="创建时间" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除本条数据吗？">
            <template #reference>
              <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="所属部门">
          <el-select v-model="form.region" placeholder="请选择部门">
            <el-option label="Zone No.1" value="shanghai"></el-option>
            <el-option label="Zone No.2" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="commitClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive } from 'vue'
import { toRef, toRefs } from 'vue-demi'

export default defineComponent({
  name: 'depart',
  components: {},
  setup () {
    const data = reactive({
      selectName: '',
      dialogFormVisible: false,
      curTitle: '新增'
    })
    const form = ref({
      name: '',
      region: ''
    })
    const resData = toRefs(data)
    // 新增
    const add = (row: any) => {
      data.dialogFormVisible = true
      data.curTitle = '新增'
      console.log(row)
    }
    // 表格数据
    const tableData = ref<any[]>([
      { name: 111 }
    ])
    // 查询
    const onSubmit = () => {
      console.log('查询', data.selectName)
    }
    // 编辑
    const editClick = (row: any) => {
      data.dialogFormVisible = true
      data.curTitle = '编辑'
      console.log(row)
    }
    // 删除
    const deleteClick = (row: any) => {
      console.log(row)
    }
    // 取消
    const cancelClick = () => {
      data.dialogFormVisible = false
      form.value = { name: '', region: '' }
    }
    // 提交
    const commitClick = () => {
      data.dialogFormVisible = false
      // 提交

      form.value = { name: '', region: '' }
    }
    const page = reactive({
      currentPage: 1,
      pageSize: 10,
      small: false,
      background: true,
      disabled: false,
      total: 10
    })
    const pageData = toRefs(page)

    const handleSizeChange = (val: number) => {
      console.log(`${val} items per page`)
    }
    const handleCurrentChange = (val: number) => {
      console.log(`current page: ${val}`)
    }

    return {
      ...resData, form, add, tableData, onSubmit, editClick, deleteClick, cancelClick, commitClick, ...pageData, handleSizeChange, handleCurrentChange
    }
  }
})
</script>
<style lang="scss" scoped>
.handleClickBox{
  display: flex;
  padding-bottom: 10px;
}
.buttonBox{
  flex: 1 0 300px;
}
.formBox{
  display: flex;
  .el-input{
    margin-right: 20px;
  }
}
.el-pagination{
  text-align: center;
  padding-top: 30px;
  margin: 0 auto;
}
</style>
