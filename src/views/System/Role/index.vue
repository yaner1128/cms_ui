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
    </div>
    <div class="roleBox">
      <div class="title">角色列表</div>
      <div class="box">
        <el-table v-loading="loading" :data="roleData">
          <el-table-column prop="name" label="名称"  />
          <el-table-column prop="code" label="角色代码"  />
          <el-table-column prop="permission" label="数据权限" />
          <el-table-column prop="level" label="角色级别"  />
          <el-table-column prop="desc" label="描述" />
          <el-table-column prop="createDate" label="创建日期" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" size="small" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="warning" size="small" @click="permissionClick(scope.row)">权限控制</el-button>
              <el-popconfirm title="确认删除本条数据吗？">
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="createForm.name" autocomplete="off" :disabled="curTitle==='编辑'" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="code" v-if="curTitle==='编辑'">
          <el-input v-model="createForm.code" autocomplete="off" :disabled="curTitle==='编辑'"></el-input>
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-input-number v-model="createForm.level" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="数据范围" prop="permission">
          <el-select v-model="createForm.permission" placeholder="请选择数据范围">
            <el-option label="范围1" value="范围1"></el-option>
            <el-option label="范围2" value="范围2"></el-option>
            <el-option label="范围3" value="范围3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息" prop="desc">
          <el-input v-model="createForm.desc" autocomplete="off"></el-input>
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
            <el-button type="primary" v-show="isMeueSave" @click="saveClick">保存</el-button>
          </div>
          <div class="box" v-loading="loading2">
            <el-tree
              ref="menuRef"
              @check="isMeueSave=true"
              :default-expand-all="true"
              :data="treeData"
              :default-checked-keys="defaultKey"
              :props="{
                children: 'children',
                label: 'name',
              }"
              show-checkbox
              node-key="name"/>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <span>接口权限</span>
            <el-button type="primary" v-show="isSave" @click="saveClick">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { getAllRoleList } from '@/api/userList'
import { getMenuList } from '@/api/menuList'
import router from '@/router'

const rules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色代码', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请输入角色级别', trigger: 'blur' }
  ],
  permission: [
    { required: true, message: '请选择数据范围', trigger: 'change' }
  ]
})
interface roleRowType {
  name: string
  code: string
  permission: string
  level: number
  desc:string
  createDate:string
}
export default defineComponent({
  name: 'System',
  components: {},
  setup () {
    const data = reactive({
      loading: false, // 表格加载
      loading2: false, // 菜单加载
      isSave: false, // 是否显示保存按钮
      isMeueSave: false,
      curTitle: '新增',
      dialogFormVisible: false,
      permissionBox: false
    })
    const resData = toRefs(data)

    // 表单
    const formInline = ref({
      name: ''
    })
    // 查询表格数据
    const roleData = ref<roleRowType[]>([])
    const getData = () => {
      data.loading = true
      const params = Object.assign({}, formInline.value)
      getAllRoleList(params).then(res => {
        roleData.value = res.data[0].data.data
        data.loading = false
      })
    }
    getData()
    // 点击查询
    const searchData = () => {
      console.log(formInline.value)
      getData()
    }

    const createForm = ref({ name: '', code: '', permission: '', level: 0, desc: '', createDate: '' })
    // 获取菜单列表
    const list = ref<unknown[]>([])
    const routerList = () => {
      const temp = router.options.routes.filter(item => {
        item.children = item.children?.filter(child => {
          return child.name
        })
        return item.meta?.isShow
      })
      temp.forEach(item => {
        if (!item.name && item.children) {
          item = item.children[0]
        }
        list.value.push(item)
      })
    }
    routerList()
    // 菜单数据
    const treeData = ref<unknown[]>([])
    // 点击新增角色
    const createClick = () => {
      data.dialogFormVisible = true
      data.curTitle = '新增'
      createForm.value = { name: '', code: '', permission: '', level: 0, desc: '', createDate: '' }
    }
    // 编辑
    const editClick = (row: roleRowType) => {
      data.dialogFormVisible = true
      data.curTitle = '编辑'
      createForm.value = row
    }
    // 提交
    const commitClick = () => {
      data.dialogFormVisible = false
      if (data.curTitle === '新增') {
        console.log('新增处理')
      } else {
        console.log('编辑处理')
      }
    }
    // 权限设置
    const permissionClick = async (row: roleRowType) => {
      data.permissionBox = true
      data.loading2 = true
      await getMenuList(row).then(res => {
        console.log(res)
        data.loading2 = false
        treeData.value = [...list.value]
        defaultKey.value = ['工作台', '项目列表']
        console.log('***defaultKey.value***', defaultKey.value)
      })
    }
    // 菜单默认选择的项
    const defaultKey = ref(['工作台'])
    // 菜单权限保存
    const menuRef = ref()
    const saveClick = () => {
      data.loading2 = true
      setTimeout(() => {
        data.loading2 = false
        data.isMeueSave = false
      }, 1000)
      console.log('保存菜单权限', menuRef.value.getCheckedKeys(true))
    }
    // 接口权限
    return {
      rules, ...resData, roleData, formInline, searchData, createForm, createClick, defaultKey, editClick, commitClick, treeData, saveClick, menuRef, permissionClick
    }
  }
})
</script>
<style lang="scss" scoped>
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
