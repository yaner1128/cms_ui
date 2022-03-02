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
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column fixed prop="employeeName" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别">
        <template #default="scope">
          <span>{{ scope.row.gender == '1' ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="employeeDate" label="入职时间" />
      <el-table-column prop="depName" label="所属部门" />
      <el-table-column prop="job" label="职位" width="350" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleAddRole(scope.row)">添加角色</el-button>
          <el-popconfirm title="确认删除本条数据吗？">
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-model="userDialog" :title="createdUserTitle" width="500px">
      <el-form :model="userForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名称" prop="employeeName">
          <el-input v-model="userForm.employeeName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userForm.gender" placeholder="请选择性别">
            <el-option label="男" :value='1'></el-option>
            <el-option label="女" :value='0'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="userForm.age"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="employeeDate">
          <el-date-picker v-model="userForm.employeeDate" type="date" @change="changeClick" placeholder="请选择入职时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="所属部门" prop="depName">
          <el-select v-model="userForm.depName" placeholder="请选择部门">
            <el-option label="总经办" value="总经办"></el-option>
            <el-option label="行政部" value="行政部"></el-option>
            <el-option label="业务部" value="业务部"></el-option>
            <el-option label="研发部" value="研发部"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="job">
          <!-- <el-input v-model="userForm.job"></el-input> -->
          <el-select v-model="userForm.job" placeholder="请选择部门">
            <el-option label="总经理" value="总经理"></el-option>
            <el-option label="副总经理" value="副总经理"></el-option>
            <el-option label="总经理助理" value="总经理助理"></el-option>
            <el-option label="行政" value="行政"></el-option>
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
    <el-dialog v-model="outerVisible" title="角色列表">
      <template #default>
        <el-button type="primary" @click="selectRole">新增角色</el-button>
        <el-table :data="curRoleData">
          <el-table-column property="name" label="角色"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <el-popconfirm title="确认删除本条数据吗？">
                <template #reference>
                  <el-button type="danger" size="small" @click="deleteClick(scope.row)">删除</el-button>
                </template>
              </el-popconfirm>
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
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { getUserList, getRoleList, getAllRoleList } from '@/api/userList'
import { page } from '@/utils/page'
import { format } from '@/utils/dateFormat'

const rules = reactive({
  job: [
    { required: true, message: '请选择职位', trigger: 'change' }
  ],
  employeeName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  employeeDate: [
    { required: true, message: '请选择入职时间', trigger: 'change' }
  ],
  depName: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ]
})
interface userDataType {
  job: string;
  employeeName: string;
  gender: string;
  age: string;
  employeeDate: string;
  depName: string;
  [propname: string]: any;
}
interface roleListType {
  code: string,
  name: string,
  level: string|number,
  desc: string,
  createDate: string,
}

export default defineComponent({
  name: 'User',
  components: {},
  setup () {
    const { pageData, handleSizeChange, handleCurrentChange } = page()
    // 获取所有角色
    const roleList = ref<roleListType[]>([])
    getAllRoleList({}).then(res => {
      roleList.value = res.data[0].data.data
    })
    // 表单
    const formInline = ref({ name: '' })
    // 查询用户数据
    const data = reactive({
      loading: false, // 表格加载
      userDialog: false, // 新增用户弹窗
      createdUserTitle: '新增', // 弹框标题
      outerVisible: false, // 新增角色弹框
      innerVisible: false,
      createdRole: '', // 当前选中的角色
      resetClick: () => { // 重置
        formInline.value.name = ''
      }
    })
    const resData = toRefs(data)
    // 表格数据
    const tableData = ref<userDataType[]>([])
    const getData = () => {
      data.loading = true
      getUserList({ currentPage: pageData.currentPage.value, pageSize: pageData.pageSize.value }).then(res => {
        console.log('*****', res)
        tableData.value = res.data[0].data.data
        data.loading = false
      })
    }
    getData()
    // 查询
    const onSubmit = () => {
      console.log(formInline.value)
      getData()
    }
    // 新增用户
    const userForm = ref<userDataType>({ job: '', employeeName: '', gender: '', age: '', employeeDate: '', depName: '' })
    const changeClick = (val: any) => {
      userForm.value.employeeDate = format(new Date(val), 'yyyy-MM-dd')
    }
    // 点击新增
    const addUser = () => {
      data.createdUserTitle = '新增'
      data.userDialog = true
      userForm.value = { job: '', employeeName: '', gender: '', age: '', employeeDate: '', depName: '' }
    }
    // 确认新增提交
    const handleAddUser = () => {
      console.log('************', userForm.value)
      data.userDialog = false
      if (data.createdUserTitle === '新增') {
        console.log('新增提交')
      } else {
        console.log('编辑提交')
      }
    }
    // 编辑
    const editClick = (row: userDataType) => {
      userForm.value = row
      data.createdUserTitle = '编辑'
      data.userDialog = true
    }
    // 新增角色
    const curRoleData = ref<roleListType[]>([])
    const handleAddRole = (row: userDataType) => {
      data.outerVisible = true
      // 获取当前用户角色列表
      getRoleList({ id: row.id }).then(res => {
        curRoleData.value = res.data[0].data.data
      })
    }
    const selectRole = () => {
      data.innerVisible = true
    }
    // 点击提交新增角色
    const addRoleClick = () => {
      data.innerVisible = false
      curRoleData.value.push({
        code: '01101',
        name: data.createdRole,
        level: 1,
        desc: '',
        createDate: format(new Date(), 'yyyy-MM-dd')
      })
      data.createdRole = ''
      console.log('提交新增的角色', curRoleData.value)
    }
    // 删除
    const deleteClick = (row: userDataType) => {
      console.log(row)
    }

    return {
      rules, ...resData, formInline, onSubmit, tableData, addUser, userForm, changeClick, editClick, handleAddUser, handleAddRole, curRoleData, roleList, selectRole, deleteClick, addRoleClick, ...pageData, handleSizeChange, handleCurrentChange
    }
  }
})
</script>
<style lang="scss" scoped>
/deep/ .el-dialog .el-input{
  width: 260px;
}
.el-pagination{
  padding-top: 30px;
}
</style>
