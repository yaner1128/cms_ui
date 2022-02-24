<template>
  <div class='userBox'>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button type="success" @click="resetClick">重置</el-button>
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
          <el-select v-model="userForm.sex" placeholder="请选择性别">
            <el-option label="男" :value='0'></el-option>
            <el-option label="女" :value='1'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="userForm.depart" placeholder="请选择部门">
            <el-option label="总经办" value="总经办"></el-option>
            <el-option label="行政部" value="行政部"></el-option>
            <el-option label="业务部" value="业务部"></el-option>
            <el-option label="研发部" value="研发部"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialog = false">取消</el-button>
          <el-button type="primary" @click="handleAddUser">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column fixed prop="code" label="证件号码" width="350" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <span>{{ scope == 1 ? '女' : '男'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="depart" label="部门" />
      <el-table-column prop="date" label="入职时间" />
      <el-table-column prop="status" label="状态" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleAddRole(scope.row)">添加角色</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="outerVisible" title="角色列表">
      <template #default>
        <el-button type="primary" @click="selectRole">新增角色</el-button>
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
              :key="item.name"
              :label="item.name"
              :value="item.name"
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
import { defineComponent, ref } from 'vue'
import { getUserList, getRoleList, getAllRoleList } from '@/api/userList'

interface userDataType {
  code: string,
  name: string,
  sex: number,
  depart: string,
  date: string,
  status: string
}
interface roleListType {
  code: string,
  name: string,
  permission: string,
  level: string|number,
  desc: string,
  createDate: string,
}

export default defineComponent({
  name: 'System',
  components: {},
  setup () {
    // 表单
    const formInline = ref({ name: '' })
    // 查询用户数据
    const loading = ref(false)
    const tableData = ref<userDataType[]>([])
    const getData = () => {
      loading.value = true
      getUserList(formInline.value).then(res => {
        tableData.value = res.data[0].data.data
        loading.value = false
      })
    }
    getData()
    // 查询
    const onSubmit = () => {
      console.log(formInline.value)
      getData()
    }
    // 重置
    const resetClick = () => {
      formInline.value.name = ''
    }
    // 新增用户
    const userDialog = ref(false)
    const createdUserTitle = ref('新增')
    const userForm = ref({
      code: '',
      name: '',
      sex: 0,
      depart: '',
      date: '',
      status: ''
    })
    const addUser = () => {
      createdUserTitle.value = '新增'
      userDialog.value = true
      userForm.value = { code: '', name: '', sex: 0, depart: '', date: '', status: '' }
    }
    const handleAddUser = () => {
      userDialog.value = false
      console.log(userForm.value)
      if (createdUserTitle.value === '新增') {
        console.log('新增提交')
      } else {
        console.log('编辑提交')
      }
    }
    // 编辑
    const editClick = (row: any) => {
      userForm.value = row
      createdUserTitle.value = '编辑'
      userDialog.value = true
    }
    // 新增角色
    const outerVisible = ref(false)
    const innerVisible = ref(false)
    const curRoleData = ref<any[]>([])
    const handleAddRole = (row: any) => {
      outerVisible.value = true
      // 获取当前用户角色列表
      getRoleList({ id: row.id }).then(res => {
        curRoleData.value = res.data[0].data.data
      })
    }
    const selectRole = () => {
      innerVisible.value = true
    }
    const roleList = ref<roleListType[]>([])
    // 获取所有角色
    getAllRoleList({}).then(res => {
      roleList.value = res.data[0].data.data
    })
    const createdRole = ref('')
    // 点击提交新增角色
    const addRoleClick = () => {
      innerVisible.value = false
      createdRole.value = ''
      console.log('提交新增的角色' + createdRole.value)
    }

    // 删除
    const deleteClick = (row: any) => {
      console.log(row)
    }

    return {
      loading, formInline, onSubmit, resetClick, tableData, createdUserTitle, addUser, userDialog, userForm, editClick, handleAddUser, outerVisible, innerVisible, handleAddRole, curRoleData, roleList, selectRole, deleteClick, createdRole, addRoleClick
    }
  }
})
</script>
