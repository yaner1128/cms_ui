<template>
  <div class='user'>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button type="success">重置</el-button>
        <el-button type="primary" @click="addUser">新增用户</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="userDialog" :title="createdUserTitle" width="30%">
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="用户名称">
          <el-input v-model="userForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input v-model="userForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="userForm.depart" placeholder="请选择性别">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="userForm.depart" placeholder="请选择部门">
            <el-option label="Zone No.1" value="shanghai"></el-option>
            <el-option label="Zone No.2" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialog = false">取消</el-button>
          <el-button type="primary" @click="userDialog = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="code" label="证件号码" />
      <el-table-column prop="name" label="姓名"  />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="depart" label="部门" />
      <el-table-column prop="date" label="入职时间" />
      <el-table-column prop="status" label="状态" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleClick(scope.row)">添加角色</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="outerVisible" title="角色列表">
      <template #default>
        <el-button type="primary" @click="innerVisible = true">新增角色</el-button>
        <el-table :data="curRoleData">
          <el-table-column property="name" label="角色"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog v-model="innerVisible" width="30%" title="新增角色" append-to-body>
          <el-select v-model="createdRole" placeholder="请选择新增角色">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <template #footer>
            <el-button type="primary" @click="addRoleClick">确定</el-button>
          </template>
        </el-dialog>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive } from 'vue'

interface userDataType {
  code?: string,
  name?: string,
  sex?: number,
  depart?: string,
  date?: string,
  status?: string
}

export default defineComponent({
  name: 'System',
  components: {},
  setup () {
    const formInline = ref({ name: '' })
    const onSubmit = () => {
      console.log(formInline.value)
    }
    const userDialog = ref(false)
    const userForm = ref({
      code: '',
      name: '',
      sex: 0,
      depart: '',
      date: '',
      status: ''
    })
    const createdUserTitle = ref('新增')
    const addUser = () => {
      createdUserTitle.value = '新增'
      userDialog.value = true
    }
    const outerVisible = ref(false)
    const innerVisible = ref(false)

    const tableData: userDataType[] = reactive([{ name: '122' }])
    const editClick = (row: any) => {
      userForm.value = row
      createdUserTitle.value = '编辑'
      userDialog.value = true
    }
    const handleClick = (row: any) => {
      outerVisible.value = true
      console.log(row)
    }
    const curRoleData = ref([{ name: '普通用户' }])

    const deleteClick = (row: any) => {
      console.log(row)
    }

    const roleList = ref([
      { label: '超级管理员', value: '超级管理员' },
      { label: '管理员', value: '管理员' },
      { label: '普通用户', value: '普通用户' },
      { label: '行政', value: '行政' },
      { label: '财务', value: '财务' }
    ])
    const createdRole = ref('')
    const addRoleClick = () => {
      innerVisible.value = false
      createdRole.value = ''
    }

    return {
      formInline, onSubmit, addUser, outerVisible, innerVisible, tableData, editClick, handleClick, deleteClick, curRoleData, roleList, createdRole, addRoleClick, userDialog, userForm, createdUserTitle
    }
  }
})
</script>
