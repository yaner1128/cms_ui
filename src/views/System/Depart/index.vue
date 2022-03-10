<template>
  <div class='departBox'>
    <div class="handleClickBox">
      <div class="buttonBox">
        <el-button type="primary" @click="add">+ 添加</el-button>
      </div>
      <div class="formBox">
        <el-input v-model="depName" placeholder="请输入名称"></el-input>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" border
      row-key="depId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" />
      <el-table-column fixed prop="depName" label="名称" />
      <!-- <el-table-column prop="parentId" label="上级部门" /> -->
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除本条数据吗?">
            <template #reference>
              <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="上级部门">
          <el-select v-model="form.region" placeholder="请选择上级部门">
            <el-option v-for="item in tableData" :key="item" :label="item.depName" :value="item.depId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.depName" autocomplete="off"></el-input>
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
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { getAllDepartmentsPage, addDepart } from '@/api/depart'

export default defineComponent({
  name: 'depart',
  components: {},
  setup () {
    const data = reactive({
      depName: '',
      dialogFormVisible: false,
      curTitle: '新增',
      onSubmit: () => { // 查询
        getData()
      }
    })
    const form = ref({
      depName: '',
      region: ''
    })
    const resData = toRefs(data)
    // 表格数据
    const tableData = ref<any[]>([])
    const allDepart = ref<any[]>([])
    const getData = () => {
      const params = { depName: data.depName }
      getAllDepartmentsPage(params).then((res:any) => {
        console.log(res.data)
        tableData.value = res.data.data
        function getDepart (arr: any) {
          // eslint-disable-next-line no-debugger
          debugger
          if (arr.children) {
            getDepart(arr.children)
          } else {
            allDepart.value.push()
          }
        }
        getDepart(tableData.value)
      })
    }
    getData()
    // 新增
    const add = (row: any) => {
      data.dialogFormVisible = true
      data.curTitle = '新增'
      console.log(row)
      addDepart(row).then(res => {
        console.log(res)
      })
    }
    // 编辑
    const editClick = (row: any) => {
      data.dialogFormVisible = true
      data.curTitle = '编辑'
    }
    // 删除
    const deleteClick = (row: any) => {
      console.log(row)
    }
    // 取消
    const cancelClick = () => {
      data.dialogFormVisible = false
      form.value = { depName: '', region: '' }
    }
    // 提交
    const commitClick = () => {
      data.dialogFormVisible = false
      // 提交
      form.value = { depName: '', region: '' }
    }

    return {
      ...resData, form, add, tableData, editClick, deleteClick, cancelClick, commitClick
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
