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
    <div class="roleBox">
      <div class="left">
        <div class="title">角色列表</div>
        <div class="box">
          <el-table v-loading="loading" :data="roleData" @row-click="rowClick">
            <el-table-column prop="name" label="名称"  />
            <el-table-column prop="code" label="角色代码"  />
            <el-table-column prop="permission" label="数据权限" />
            <el-table-column prop="level" label="角色级别"  />
            <el-table-column prop="desc" label="描述" />
            <el-table-column prop="createDate" label="创建日期" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" @click="editClick(scope.row)">编辑</el-button>
                <el-popconfirm title="确认删除本条数据吗？">
                  <template #reference>
                    <el-button type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
                <!-- <el-button type="danger">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <span>菜单权限</span>
          <el-button type="primary" v-show="isSave" @click="saveClick">保存</el-button>
        </div>
        <div class="box" v-loading="loading2" v-show="isShow">
          <el-tree
            ref="menuRef"
            @check="isSave=true"
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
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue'
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
    const loading2 = ref(false)
    const isShow = ref(false)
    // 表单
    const formInline = ref({
      name: ''
    })
    // 查询表格数据
    const loading = ref(false)
    const roleData = ref<roleRowType[]>([])
    const getData = () => {
      loading.value = true
      const params = Object.assign({}, formInline.value)
      getAllRoleList(params).then(res => {
        roleData.value = res.data[0].data.data
        loading.value = false
      })
    }
    getData()
    // 点击查询
    const searchData = () => {
      console.log(formInline.value)
      getData()
    }
    // 创建新角色
    const curTitle = ref('新增')
    const dialogFormVisible = ref(false)
    const createForm = ref({
      name: '',
      code: '',
      permission: '',
      level: 0,
      desc: '',
      createDate: ''
    })
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
    const treeData = ref<unknown[]>([])
    // 点击新增角色
    const createClick = () => {
      dialogFormVisible.value = true
      curTitle.value = '新增'
      createForm.value = { name: '', code: '', permission: '', level: 0, desc: '', createDate: '' }
    }
    // 菜单默认选择的项
    const defaultKey = ref(['工作台'])
    // 是否显示保存按钮
    const isSave = ref(false)
    // 菜单权限保存
    const menuRef = ref()
    const saveClick = () => {
      isSave.value = false
      // 当前选中的所有菜单名称
      // const query = menuRef.value.getCheckedKeys(true)
      console.log('保存菜单权限', menuRef.value.getCheckedKeys(true))
    }
    // 行点击事件
    const rowClick = (row: roleRowType) => {
      isSave.value = false
      loading2.value = true
      isShow.value = true
      getMenuList(row).then(res => {
        console.log(res)
        treeData.value = [...list.value]
        console.log('treeData', treeData.value)
        loading2.value = false
        defaultKey.value = ['工作台', '项目列表']
        console.log('***defaultKey.value***', defaultKey.value)
      })
    }
    const editClick = (row: roleRowType) => {
      curTitle.value = '编辑'
      createForm.value = row
      dialogFormVisible.value = true
    }
    const commitClick = () => {
      dialogFormVisible.value = false
      if (curTitle.value === '新增') {
        console.log('新增处理')
      } else {
        console.log('编辑处理')
      }
    }

    return {
      rules, loading, loading2, isShow, roleData, formInline, searchData, dialogFormVisible, createForm, curTitle, createClick, rowClick, defaultKey, editClick, commitClick, treeData, saveClick, menuRef, isSave
    }
  }
})
</script>
<style lang="scss" scoped>
.roleBox{
  display: flex;
  flex-flow: row;
  max-height: calc(100vh - 140px);
  background-color: #fff;
}
.left,.right{
  border: 1px solid #eee;
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
.left{
  width: 68%;
  margin-right: 30px;
}
.right{
  flex: 0 1 30%;
}
</style>
