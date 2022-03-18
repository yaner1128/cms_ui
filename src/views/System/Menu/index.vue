<template>
  <div class='departBox'>
    <div class="handleClickBox">
      <div class="buttonBox">
        <el-button type="primary" @click="add">+ 添加</el-button>
      </div>
      <div class="formBox">
        <el-input v-model="selectName" placeholder="请输入名称" clearable></el-input>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    <el-table
      :data="tableData" border
      row-key="permissionId"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" />
      <el-table-column fixed prop="permissionName" label="名称" />
      <el-table-column prop="permissionIcon" label="图标" width="80px">
        <template #default="scope">
          <i class="iconfont" :class="'icon-'+scope.row.permissionIcon" style="font-size:25px"></i>
        </template>
      </el-table-column>
      <el-table-column prop="menuSorting" label="排序" width="60px">
        <template #default="scope">
          <el-tag v-if="scope.row.menuSorting">{{ scope.row.menuSorting }}</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="moduleName" label="模块" />
      <el-table-column prop="permissionUrl" label="路径" />
      <el-table-column prop="jumpUrl" label="重定向" />
      <el-table-column prop="vueFileUrl" label="vue文件路径" />
      <el-table-column prop="createdDate" label="创建日期" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除本条数据吗？"  @confirm="deleteClick(scope.row.permissionId)">
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="580px">
      <el-form ref="refForm" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader v-model="parentId"
            @change="changePermission($event)"
            :options="selectData"
            :props="{ checkStrictly: true, label: 'permissionName', value: 'permissionId' }" placeholder="请选择父级菜单"></el-cascader>
        </el-form-item>
        <el-form-item label="图标">
          <el-dropdown trigger="hover">
            <div class="iconBox">
              <el-input v-model="form.permissionIcon" clearable></el-input>
              <span>
                <i class="iconfont" :class="'icon-'+form.permissionIcon"></i>
              </span>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="iconList">
                <li v-for="icon in iconList" :key="icon.icon_id" @click="selectIcon(icon.font_class)">
                  <i class="iconfont" :class="'icon-'+icon.font_class"></i>
                </li>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="菜单名称" prop="permissionName">
          <el-input v-model="form.permissionName" clearable></el-input>
        </el-form-item>
        <el-form-item label="模块">
          <el-input v-model="form.moduleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="vue文件路径">
          <el-input v-model="form.vueFileUrl" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单url" prop="permissionUrl">
          <el-input v-model="form.permissionUrl" clearable></el-input>
        </el-form-item>
        <el-form-item label="重定向" prop="permissionUrl">
          <el-input v-model="form.jumpUrl" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单排序">
          <el-input-number v-model="form.menuSorting" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="commitClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive, toRefs } from 'vue'
import iconList from './module/iconData'
import { getAllMenuList, permissionAdd, permissionUpdate, permissionDelete } from '@/api/menu'
import { ElMessage } from 'element-plus'

const rules = reactive({
  parentId: [
    { required: true, message: '请选择父级菜单', trigger: 'change' }
  ],
  permissionName: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ]
})
interface formType {
  parentId: number|string;
  permissionName: string;
  permissionIcon: string;
  permissionUrl: string;
  createTime?: string;
  moduleName: string;
  vueFileUrl: string;
  jumpUrl: string;
  menuSorting: string;
}
export default defineComponent({
  name: 'depart',
  components: {},
  setup () {
    const data = reactive({
      parentId: ref<any>([]),
      selectName: '',
      dialogFormVisible: false,
      curTitle: '新增',
      changePermission: (val: any) => {
        console.log(val)
        form.value.parentId = val.slice(-1)[0]
      },
      selectIcon: (icon: string) => {
        form.value.permissionIcon = icon
      },
      onSubmit: () => {
        getData()
      },
      add: () => { // 新增
        data.dialogFormVisible = true
        data.curTitle = '新增'
        form.value = { parentId: 0, permissionName: '', permissionIcon: '', permissionUrl: '', moduleName: '', vueFileUrl: '', jumpUrl: '', menuSorting: '' }
      },
      editClick: (row: any) => { // 编辑
        data.dialogFormVisible = true
        data.curTitle = '编辑'
        form.value = row
        data.parentId = [form.value.parentId]
      },
      deleteClick: (permissionId: number) => { // 删除
        console.log(permissionId)
        permissionDelete(permissionId).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('删除成功！')
            getData()
          }
        })
      }
    })
    const resData = toRefs(data)
    const form = ref<formType>({ parentId: 0, permissionName: '', permissionIcon: '', permissionUrl: '', moduleName: '', vueFileUrl: '', jumpUrl: '', menuSorting: '' })
    // 表格数据
    const tableData = ref<any[]>([])
    const selectData = ref<any[]>([])
    const getData = () => {
      getAllMenuList(data.selectName).then(res => {
        tableData.value = res.data.data
        selectData.value = JSON.parse(JSON.stringify(tableData.value))
        selectData.value.unshift({ permissionId: 0, permissionName: '无父级' })
      })
    }
    getData()
    // 提交
    const refForm = ref()
    const commitClick = () => {
      refForm.value.validate((valid:boolean) => {
        if (valid) {
          if (data.curTitle === '新增') {
            console.log(form.value)
            permissionAdd(form.value).then(res => {
              if (res.data.code === 200) {
                ElMessage.success('新增菜单成功！')
                getData()
                data.dialogFormVisible = false
              }
            })
          } else {
            permissionUpdate(form.value).then(res => {
              if (res.data.code === 200) {
                ElMessage.success('编辑成功！')
                getData()
                data.dialogFormVisible = false
              }
            })
          }
        }
      })
    }

    return {
      refForm, rules, iconList, ...resData, form, tableData, commitClick, selectData
    }
  }
})
</script>
<style lang="scss" scoped>
/deep/ .el-input,.el-input-number {
  width: 260px;
}
.handleClickBox{
  display: flex;
  padding-bottom: 10px;
  .buttonBox{
    flex: 1 0 300px;
  }
  .formBox{
    display: flex;
    .el-input{
      margin-right: 20px;
    }
  }
}
.el-pagination{
  text-align: center;
  padding-top: 30px;
  margin: 0 auto;
}
.iconBox{
  position: relative;
  span{
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translate(0,-50%);
  }
  /deep/ .el-input__inner{
    padding-left: 30px;
  }
}
.iconList{
  display: flex;
  flex-wrap: wrap;
  width: 260px;
  padding: 0;
  li{
    width: 31px;
    height: 31px;
    margin: 5px 3px;
    box-sizing: border-box;
    border: 1px solid #e0e0e0;
    position: relative;
  }
  .iconfont{
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
.iocnBox{
  width: 36px;
  height: 36px;
  position: relative;
  border: 1px solid #e0e0e0;
  i{
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .delete{
    position: absolute;
    top: 0;
    left: 35px;
    font-size: 10px;
    border-radius: 10px;
    border: 1px solid #ccc;
    background: #f0f0f0;
  }
}
</style>
