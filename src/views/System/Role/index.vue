<template>
  <div class='role'>
    <div class="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.name" placeholder="输入名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">搜索</el-button>
          <el-button type="success" @click="createClick">新增</el-button>
        </el-form-item>
      </el-form>
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :small="small"
        :disabled="disabled"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="roleBox">
      <div class="title">角色列表</div>
      <div class="box">
        <el-table v-loading="loading" :data="roleData">
          <el-table-column prop="positionName" label="名称"  />
          <el-table-column prop="positionLevel" label="值级"  />
          <el-table-column prop="depId" label="所属部门" />
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="warning" size="small" @click="permissionClick(scope.row)">权限控制</el-button>
              <el-popconfirm title="确认删除本条数据吗？"  @confirm="deleteUser(scope.row.positionId)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="500px">
      <el-form :model="createForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="positionName">
          <el-input v-model="createForm.positionName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="depId">
          <el-select v-model="createForm.depId" placeholder="请选择数据范围">
            <el-option v-for="item in departAll" :key="item" :label="item.depName" :value="item.depId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色值级" prop="positionLevel">
          <el-input v-model="createForm.positionLevel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="commitClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 权限控制 -->
    <el-dialog v-model="permissionBox" title="权限设置" width="60%">
      <div class="permissionBox">
        <div class="left">
          <div class="title">
            <span>菜单权限</span>
            <el-button type="primary" size="small" @click="saveClick">保存</el-button>
          </div>
          <div class="box">
            <el-tree
              ref="menuRef"
              @check="isMeueSave=true"
              :default-expand-all="true"
              :data="treeData"
              :default-checked-keys="defaultKey"
              :props="{
                children: 'children',
                label: 'permissionName',
                value: 'permissionId'
              }"
              show-checkbox
              node-key="permissionId"/>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <span>接口权限</span>
            <el-button type="primary" size="small" @click="saveClick2">保存</el-button>
          </div>
          <div class="box">
            <el-tree
              ref="apiRef"
              @check="isMeueSave=true"
              :default-expand-all="false"
              :data="treeData2"
              :default-checked-keys="apiIdDefaultKey"
              :props="{
                children: 'children',
                label: 'apiDesc',
                value: 'apiId'
              }"
              show-checkbox
              node-key="apiId"/>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { queryAllDepartmentNames } from '@/api/userList'
import { positionsAll, positionsAdd, positionsUpdate, positionsRemove, permissionsById, assignedByPositionApi } from '@/api/role'
import { getAllMenuList } from '@/api/menu'
import { queryResourceAddress } from '@/api/apiData'
import { page } from '@/utils/page'
import { ElMessage } from 'element-plus'

const rules = reactive({
  positionName: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' }
  ],
  depId: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  positionLevel: [
    { required: true, message: '请输入岗位值级', trigger: 'blur' }
  ]
})
export default defineComponent({
  name: 'System',
  components: {},
  setup () {
    const { pageData } = page()

    const data = reactive({
      loading: false, // 表格加载
      isSave: false, // 是否显示保存按钮
      isMeueSave: false,
      positionId: ref<any>(''),
      curTitle: '新增',
      dialogFormVisible: false,
      permissionBox: false,
      handleCurrentChange: (val: number) => {
        pageData.currentPage.value = val
        getData()
      },
      handleSizeChange: (val: number) => {
        pageData.pageSize.value = val
        pageData.currentPage.value = 1
        getData()
      },
      searchData: () => {
        console.log(formInline.value)
        getData()
      },
      createClick: () => {
        data.dialogFormVisible = true
        data.curTitle = '新增'
        createForm.value = { positionName: '', positionLevel: '', permission: '', level: 0, desc: '', createDate: '' }
      },
      // 编辑
      editClick: (row: any) => {
        data.dialogFormVisible = true
        data.curTitle = '编辑'
        createForm.value = row
      },
      deleteUser: (positionId: number) => {
        console.log(positionId)
        positionsRemove(positionId).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('删除操作成功')
            getData()
          }
        })
      },
      commitClick: () => { // 提交
        data.dialogFormVisible = false
        if (data.curTitle === '新增') {
          positionsAdd(createForm.value).then(res => {
            if (res.data.code === 200) {
              ElMessage.success('新增成功')
              getData()
            }
          })
        } else {
          positionsUpdate(createForm.value).then(res => {
            if (res.data.code === 200) {
              ElMessage.success('编辑成功')
              getData()
            }
          })
        }
      }
    })
    const resData = toRefs(data)

    // 查询表单
    const formInline = ref({
      name: ''
    })
    // 查询表格数据
    const roleData = ref<any[]>([])
    const getData = () => {
      data.loading = true
      const params = { currentPageIndex: pageData.currentPage.value, pageSize: pageData.pageSize.value }
      positionsAll(params).then(res => {
        roleData.value = res.data.data.records
        pageData.total.value = res.data.data.total
        data.loading = false
      })
    }
    getData()
    // 获取全部部门信息
    const departAll = ref<any[]>([])
    queryAllDepartmentNames().then(res => {
      console.log(res.data)
      departAll.value = res.data.data
    })
    // 权限菜单数据
    const treeData = ref<unknown[]>([])
    getAllMenuList('').then(res => {
      treeData.value = res.data.data
    })
    // 接口权限数据
    const treeData2 = ref<unknown[]>([])
    queryResourceAddress().then(res => {
      treeData2.value = res.data.data
    })
    // 编辑新增表单
    const createForm = ref<any>({ positionName: '', positionLevel: '', permission: '', level: 0, desc: '', createDate: '' })
    // 权限设置
    const permissionClick = (row: any) => {
      defaultKey.value = []
      apiIdDefaultKey.value = []
      console.log(row)
      treeData.value = [...treeData.value]
      data.permissionBox = true
      data.positionId = row.positionId
      row.permissions.forEach((item: { permissionId: string }) => {
        defaultKey.value.push(item.permissionId)
      })
      row.apis.forEach((item: { apiId: string }) => {
        apiIdDefaultKey.value.push(item.apiId)
      })
      console.log(defaultKey.value)
      console.log(apiIdDefaultKey.value)
    }
    // 菜单默认选择的项
    const defaultKey = ref([''])
    // 菜单权限保存
    const menuRef = ref()
    const saveClick = () => {
      const params: any = []
      menuRef.value!.getCheckedKeys(false).forEach((item: any) => {
        const obj = { permissionId: item, posId: data.positionId }
        params.push(obj)
      })
      permissionsById({ basPosPermissionList: params }).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('编辑成功')
        }
      })
    }
    const apiIdDefaultKey = ref([''])
    const apiRef = ref()
    const saveClick2 = () => {
      const params: any = []
      apiRef.value!.getCheckedKeys(false).forEach((item: any) => {
        const obj = { apiId: item, posId: data.positionId }
        params.push(obj)
      })
      assignedByPositionApi({ basPosApisList: params }).then(res => {
        if (res.data.code === 200) {
          ElMessage.success('编辑成功')
        }
      })
    }
    // 接口权限
    return {
      ...pageData, rules, ...resData, roleData, formInline, departAll, createForm, defaultKey, apiIdDefaultKey, treeData, treeData2, saveClick, menuRef, permissionClick, saveClick2, apiRef
    }
  }
})
</script>
<style lang="scss" scoped>
.form{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.roleBox{
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 140px);
  background-color: #fff;
  border: 1px solid #eee;
  width: 100%;
  .title{
    height: 50px;
    border-bottom: 1px solid #eee;
    line-height: 50px;
    padding: 0 10px;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.box{
  padding: 0 10px;
}
.permissionBox{
  width: 100%;
  min-height: 500px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  .left{
    margin-right: 30px;
    box-sizing: border-box;
  }
  .left,.right{
    flex: 0 1 50%;
    border: 1px solid #e0e0e0;
    .box{
      height: 560px;
      overflow: auto;
    }
    .title{
      height: 50px;
      border-bottom: 1px solid #eee;
      line-height: 50px;
      padding: 0 10px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
