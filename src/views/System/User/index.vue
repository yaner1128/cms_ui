<template>
  <div class='userBox'>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.employeeName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">搜索</el-button>
        <el-button type="success" @click="resetClick">重置</el-button>
        <el-button type="warning" @click="addUser">新增用户</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column fixed prop="employeeName" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="employeeDate" label="入职时间" />
      <el-table-column prop="basDepartmentsVOList[0].depName" label="所属部门" />
      <el-table-column prop="positionsVOList[0].positionName" label="职位" width="350" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleAddRole(scope.row)">添加角色</el-button>
          <el-popconfirm title="确认删除本条数据吗？"  @confirm="deleteUser(scope.row.employeeId)">
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
    <!-- 新增/编辑弹出框 -->
    <el-dialog v-model="userDialog" :title="createdUserTitle" width="500px">
      <el-form :model="userForm" :rules="rules" label-width="80px">
        <el-form-item label="用户姓名" prop="employeeName">
          <el-input v-model="userForm.employeeName" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userForm.gender" placeholder="请选择性别" clearable>
            <el-option label="男" value='男'></el-option>
            <el-option label="女" value='女'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="userForm.age" clearable></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="employeeDate">
          <el-date-picker v-model="userForm.employeeDate" type="date" @change="changeClick" placeholder="请选择入职时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="所属部门" prop="depName">
          <el-select v-model="userForm.depId" placeholder="请选择部门" clearable @change="changeDepart($event)">
            <el-option v-for="item in allDepartment" :key="item" :label="item.depName" :value="item.depId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="positionLevel">
          <el-select v-model="userForm.positionId" placeholder="请选择职位" clearable :disabled="!userForm.depId">
            <el-option v-for="item in allJobData" :key="item" :label="item.positionName" :value="item.positionId"></el-option>
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
              <el-popconfirm title="确认删除本条数据吗？" @confirm="deleteClick(scope.row)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
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
import { userInformationQuery, addUserInformation, updataUserInfo, deleteUserInformation, queryAllDepartmentNames, getJobByDepartId, getRoleList, getAllRoleList } from '@/api/userList'
import { page } from '@/utils/page'
import { format } from '@/utils/dateFormat'
import { ElMessage } from 'element-plus'

const rules = reactive({
  employeeName: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
  // employeeDate: [
  //   { required: true, message: '请选择入职时间', trigger: 'change' }
  // ]
  // positionLevel: [
  //   { required: true, message: '请选择职位', trigger: 'change' }
  // ],
  // depName: [
  //   { required: true, message: '请选择所属部门', trigger: 'change' }
  // ]
})
interface userDataType {
  positionLevel: string;
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
    const { pageData } = page()
    // 表单
    const formInline = ref<{employeeName: string}>({ employeeName: '' })
    // 查询用户数据
    const data = reactive({
      loading: false, // 表格加载
      userDialog: false, // 新增用户弹窗
      createdUserTitle: '新增', // 弹框标题
      outerVisible: false, // 新增角色弹框
      innerVisible: false,
      createdRole: '', // 当前选中的角色
      resetClick: () => { // 重置
        formInline.value.employeeName = ''
        getData()
      },
      changeDepart: (val: any) => { // 部门列表改变事件
        userForm.value.positionId = ''
        getJobByDepartId(Number(val)).then(res => {
          allJobData.value = res.data.data
        })
      },
      changeClick: (val: any) => { // 日期改变事件
        userForm.value.employeeDate = format(new Date(val), 'yyyy-MM-dd')
      },
      addUser: () => { // 新增点击
        data.createdUserTitle = '新增'
        data.userDialog = true
        userForm.value = { employeeId: '', employeeName: '', gender: '', age: '', depId: '', positionId: '', employeeDate: '' }
      },
      editClick: (row: any) => { // 编辑
        for (var k in userForm.value) {
          userForm.value[k] = row[k]
        }
        userForm.value.depId = row.basDepartmentsVOList[0]?.depId
        if (userForm.value.depId) {
          data.changeDepart(userForm.value.depId)
        }
        userForm.value.positionId = row.positionsVOList[0]?.positionId
        data.createdUserTitle = '编辑'
        data.userDialog = true
      },
      deleteUser: (employeeId: number) => { // 删除用户
        deleteUserInformation(employeeId).then(res => {
          getData()
        })
      },
      handleCurrentChange: (val: number) => {
        pageData.currentPage.value = val
        getData()
      },
      handleSizeChange: (val: number) => {
        pageData.pageSize.value = val
        pageData.currentPage.value = 1
        getData()
      }
    })
    const resData = toRefs(data)
    // 表格数据
    const tableData = ref<userDataType[]>([])
    // 部门下拉列表数据
    const allDepartment = ref<any[]>([])
    const getDepart = (() => {
      queryAllDepartmentNames().then(res => {
        allDepartment.value = res.data.data
      })
    })()
    // 职位下拉列表数据
    const allJobData = ref<any[]>([])
    // 点击查询
    const getData = () => {
      data.loading = true
      const page = { currentPageIndex: pageData.currentPage.value, pageSize: pageData.pageSize.value }
      const params = Object.assign({ employeeName: formInline.value.employeeName }, page)
      userInformationQuery(params).then(res => {
        data.loading = false
        tableData.value = res.data.data.records
        pageData.total.value = res.data.data.total
      })
    }
    getData()

    // 用户表单
    const userForm = ref<any>({ employeeId: '', employeeName: '', gender: '', age: '', depId: '', positionId: '', employeeDate: '' })
    // 新增/编辑 提交
    const handleAddUser = () => {
      data.userDialog = false
      if (data.createdUserTitle === '新增') {
        // var params1 = Object.assign({ createTime: format(new Date(), 'yyyy-MM-dd') }, userForm.value)
        var params1 = Object.assign({}, userForm.value)
        addUserInformation(params1).then((res) => {
          ElMessage.success('新增用户成功')
          getData()
        })
      } else {
        var params = Object.assign({}, userForm.value)
        for (var k in params) {
          if (!params[k] || k === 'depId') {
            delete params[k]
          }
        }
        updataUserInfo(params).then((res:any) => {
          if (res.data.code === 200) {
            ElMessage.success('编辑用户信息成功')
            getData()
          } else {
            ElMessage.success(res.data.data)
          }
        })
      }
    }
    // 获取所有角色
    const roleList = ref<roleListType[]>([])
    getAllRoleList({}).then(res => {
      roleList.value = res.data[0].data.data
    })
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
    }
    // 删除
    const deleteClick = (row: userDataType) => {
      console.log(row)
    }

    return {
      rules, ...resData, formInline, tableData, getData, userForm, handleAddUser, handleAddRole, curRoleData, roleList, selectRole, deleteClick, addRoleClick, ...pageData, allDepartment, allJobData
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
