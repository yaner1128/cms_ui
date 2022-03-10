<template>
  <div class='departBox'>
    <div class="handleClickBox">
      <div class="buttonBox">
        <el-button type="primary" @click="add">+ 添加</el-button>
      </div>
      <div class="formBox">
        <el-input v-model="selectName" placeholder="请输入名称"></el-input>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    <el-table :data="tableData" border row-key="path" default-expand-all>
      <el-table-column type="selection" />
      <el-table-column fixed prop="name" label="名称" />
      <el-table-column prop="parentId" label="图标" width="80px">
        <template #default="scope">
          <i class="iconfont" :class="'icon-'+scope.row.icon" style="font-size:25px"></i>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="排序" width="60px">
        <template #default="scope">
          <el-tag>{{ scope.parentId||1 }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="模块" />
      <el-table-column prop="component.__file" label="组件路径" />
      <el-table-column prop="createdDate" label="创建日期" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除本条数据吗?">
            <template #reference>
              <el-button type="danger" size="small" @click="deleteClick(scope.row)">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="580px">
      <el-form ref="refForm" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择父级菜单">
            <el-option label="Zone No.1" value="shanghai"></el-option>
            <el-option label="Zone No.2" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标">
          <el-dropdown trigger="hover">
            <div class="iconBox">
              <el-input v-model="form.icon" clearable></el-input>
              <span>
                <i class="iconfont" :class="'icon-'+form.icon"></i>
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
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单排序">
          <el-input-number v-model="form.title" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="模块" prop="path">
          <el-input v-model="form.path" clearable></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="path">
          <el-input v-model="form.path" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="commitClick">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import router from '@/router'
import { defineComponent, ref, reactive, toRefs, onUnmounted } from 'vue'
import iconList from './module/iconData'

const rules = reactive({
  parentId: [
    { required: true, message: '请选择父级菜单', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路径', trigger: 'blur' }
  ],
  isShow: [
    { required: true, message: '请选择所售产品', trigger: 'change' }
  ],
  module: [
    { required: true, message: '请输入模块名称', trigger: 'blur' }
  ]
})
export default defineComponent({
  name: 'depart',
  components: {},
  setup () {
    const selectIcon = (icon: string) => {
      form.value.icon = icon
    }
    const deleteIcon = () => {
      form.value.name = ''
    }
    const data = reactive({
      selectName: '',
      dialogFormVisible: false,
      curTitle: '新增'
    })
    const resData = toRefs(data)
    const form = ref<{ [propname: string]: any }>({
      name: '',
      path: '',
      region: ''
    })
    // 新增
    const add = (row: any) => {
      data.dialogFormVisible = true
      data.curTitle = '新增'
      console.log(row)
    }
    // 表格数据
    const tableData = ref<any[]>([])
    const temp = router.options.routes.filter(item => {
      item.children = item.children?.filter(child => {
        return child.name
      })
      return true
    })
    temp.forEach(item => {
      if (!item.name && item.children) {
        item = item.children[0]
      }
      tableData.value.push(item)
    })
    // 查询
    const onSubmit = () => {
      console.log('查询', data.selectName)
    }
    // 编辑
    const editClick = (row: any) => {
      data.dialogFormVisible = true
      data.curTitle = '编辑'
      form.value = row
      console.log(row)
    }
    // 删除
    const deleteClick = (row: any) => {
      console.log(row)
    }
    // 取消
    const cancelClick = () => {
      data.dialogFormVisible = false
      form.value = { name: '', region: '', path: '' }
    }
    // 提交
    const refForm = ref()
    const commitClick = () => {
      refForm.value.validate((valid:boolean) => {
        if (valid) {
          data.dialogFormVisible = false
          // 提交
          console.log(form.value)
          form.value = { name: '', region: '', path: '' }
        }
      })
    }

    return {
      refForm, rules, iconList, selectIcon, deleteIcon, ...resData, form, add, tableData, onSubmit, editClick, deleteClick, cancelClick, commitClick
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
