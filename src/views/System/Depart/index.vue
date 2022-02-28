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
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" />
      <el-table-column fixed prop="name" label="名称" />
      <el-table-column prop="parentId" label="父节点" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="createDate" label="创建时间" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" title="Shipping address">
      <el-form :model="form">
        <el-form-item label="父节点">
          <el-select v-model="form.region" placeholder="请选择父节点">
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
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive } from 'vue'
import { toRefs } from 'vue-demi'

export default defineComponent({
  name: 'depart',
  components: {},
  setup () {
    const data = reactive({
      selectName: '',
      dialogFormVisible: false,
      form: {
        name: '',
        region: ''
      }
    })
    const resData = toRefs(data)
    const add = (row: any) => {
      console.log(row)
    }
    const deleteClick = (row: any) => {
      console.log(row)
    }
    // 表格数据
    const tableData = ref<any[]>([
      { name: 111 }
    ])
    const handleClick = (row: any) => {
      console.log(row)
    }
    const onSubmit = () => {
      console.log('查询', data.selectName)
    }
    return {
      ...resData, add, tableData, handleClick, deleteClick, onSubmit
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
</style>
