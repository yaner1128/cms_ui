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
          <el-popconfirm title="确认删除本条数据吗？"  @confirm="deleteClick(scope.row.depId)">
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="上级部门">
          <!-- <el-select v-model="form.parentId" placeholder="请选择上级部门" clearable @change="departChange($event)">
            <el-option v-for="item in allDepartment" :key="item" :label="item.depName" :value="item.depId"></el-option>
          </el-select> -->
          <el-cascader v-model="depId"
            @change="changeDep($event)"
            :options="selectData"
            :props="{ checkStrictly: true, label: 'depName', value: 'depId' }" placeholder="请选择父级菜单"></el-cascader>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.depName" autocomplete="off" clearable></el-input>
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
import { getAllDepartmentsPage, addDepart, updateDepart, deleteDepart } from '@/api/depart'
import { queryAllDepartmentNames } from '@/api/userList'
import { format } from '@/utils/dateFormat'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'depart',
  components: {},
  setup () {
    const data = reactive({
      depId: ref<any[]>([]),
      depName: '',
      dialogFormVisible: false,
      curTitle: '新增',
      onSubmit: () => { // 查询
        getData()
      },
      // getAll: () => {
      //   queryAllDepartmentNames().then(res => {
      //     allDepartment.value = res.data.data
      //   })
      // },
      // 新增
      add: () => {
        // data.getAll()
        data.dialogFormVisible = true
        data.curTitle = '新增'
        form.value = {}
        data.depId = []
      },
      // 编辑
      editClick: (row: any) => {
        console.log(row)
        data.dialogFormVisible = true
        data.curTitle = '编辑'

        row.parentId = Number(row.parentId)
        data.depId = [row.parentId]
        form.value = JSON.parse(JSON.stringify(row))
      },
      changeDep: (val: any) => {
        console.log(val)
        form.value.depLevel = val.length - 1
        form.value.parentId = val.slice(-1)[0]
      }
    })
    const form = ref<any>({
      parentId: 0,
      depName: '',
      depLevel: 0
    })
    const resData = toRefs(data)
    // 表格数据
    const tableData = ref<any[]>([])
    const selectData = ref<any[]>([])
    const allDepartment = ref<any[]>([])
    const getData = () => {
      const params = { depName: data.depName }
      getAllDepartmentsPage(params).then((res:any) => {
        console.log(res.data)
        tableData.value = res.data.data
        selectData.value = JSON.parse(JSON.stringify(tableData.value))
        selectData.value.unshift({ depId: 0, depName: '无父级' })
      })
    }
    getData()
    // data.getAll()
    // 新增/编辑提交
    const commitClick = () => {
      data.dialogFormVisible = false
      // 提交
      if (data.curTitle === '新增') {
        const params = Object.assign({
          createTime: format(new Date(), 'yyyy-MM-dd')
        }, form.value)
        addDepart(params).then(res => {
          console.log(res)
          ElMessage.success('新增成功')
          getData()
        })
      } else {
        const params = Object.assign({
          updateTime: format(new Date(), 'yyyy-MM-dd')
        }, form.value)
        console.log(params)
        updateDepart(params).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('编辑成功')
            getData()
          }
        })
      }
    }
    // 删除
    const deleteClick = (depId: number) => {
      deleteDepart(depId).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('删除成功')
          getData()
        }
      })
    }

    return {
      ...resData, form, tableData, deleteClick, commitClick, selectData
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
