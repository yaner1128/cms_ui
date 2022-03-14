<template>
  <div class='departBox'>
    <div class="handleClickBox">
      <div class="buttonBox">
        <el-button type="primary" @click="add">+ 添加</el-button>
      </div>
      <!-- <div class="formBox">
        <el-input v-model="selectName" placeholder="请输入名称"></el-input>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </div> -->
    </div>
    <el-table :data="tableData" border
      row-key="id"
      default-expand-all
    >
      <el-table-column type="selection" />
      <el-table-column fixed prop="apiDesc" label="名称" />
      <el-table-column prop="apiUrl" label="资源地址" />
      <el-table-column prop="apiCategory" label="资源分类" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除本条数据吗？"  @confirm="deleteClick(scope.row.apiId)">
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
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
    </el-pagination> -->

    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="资源名称">
          <el-input v-model="form.apiDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源地址">
          <el-input v-model="form.apiUrl" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源分类">
          <el-select v-model="form.apiCategory" placeholder="请选择类别">
            <el-option v-for="item in apiCategory" :key="item" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="commitClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { queryResourceAddress, addInterface, updateInterface, deleteInterface } from '@/api/apiData'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'depart',
  components: {},
  setup () {
    const data = reactive({
      apiCategory: [
        { label: '系统管理--权限分配', value: 0 },
        { label: '系统管理--岗位管理', value: 1 },
        { label: '系统管理--产品管理', value: 2 },
        { label: '系统管理--员工管理', value: 3 },
        { label: '项目管理', value: 4 },
        { label: '合同管理', value: 5 },
        { label: '用款计划', value: 6 },
        { label: '附件管理', value: 7 }
      ],
      selectName: '',
      dialogFormVisible: false,
      curTitle: '新增',
      add: () => { // 新增
        data.dialogFormVisible = true
        data.curTitle = '新增'
        form.value = {}
      },
      editClick: (row: any) => { // 编辑
        data.dialogFormVisible = true
        data.curTitle = '编辑'
        form.value = JSON.parse(JSON.stringify(row))
      },
      deleteClick: (apiId: number) => { // 删除
        deleteInterface(apiId).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('删除成功')
            getData()
          }
        })
      }
    })
    const resData = toRefs(data)
    const form = ref<any>({})
    // 查询
    const onSubmit = () => {
      getData()
    }
    // 表格数据
    const tableData = ref<any[]>([])
    const getData = () => {
      queryResourceAddress().then(res => {
        tableData.value = res.data.data
      })
    }
    getData()
    // 提交
    const commitClick = () => {
      data.dialogFormVisible = false
      // 提交
      if (data.curTitle === '新增') {
        addInterface(form.value).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('新增成功')
            getData()
          }
        })
      } else {
        updateInterface(form.value).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('编辑信息成功')
            getData()
          }
        })
      }
    }

    return {
      ...resData, form, tableData, onSubmit, commitClick
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
