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
      <el-table-column fixed prop="name" label="标题" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="meta.isShow" label="是否隐藏" />
      <el-table-column prop="component.__file" label="模块" />
      <el-table-column prop="redirect" label="重定向" />
      <el-table-column prop="parentId" label="图标" />
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
    <el-dialog v-model="dialogFormVisible" :title="curTitle" width="740px">
      <el-form ref="refForm" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择父级菜单">
            <el-option label="Zone No.1" value="shanghai"></el-option>
            <el-option label="Zone No.2" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="isShow">
          <el-switch v-model="form.isShow" />
        </el-form-item>
        <el-form-item label="模块" prop="module">
          <el-input v-model="form.module"></el-input>
        </el-form-item>
        <el-form-item label="重定向">
          <el-input v-model="form.redirect"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-dropdown trigger="click">
            <div class="iocnBox" v-if="form.name">
              <i class="iconfont" :class="form.name" ></i>
              <i class="iconfont icon-2901cuowu delete" @click.self="deleteIcon"></i>
            </div>
            <div class="iocnBox" v-else>
              <i class="iconfont icon-2801zengjia2"></i>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="iconList">
                <li v-for="icon in iconList" :key="icon" @click="selectIcon(icon)">
                  <i class="iconfont" :class="icon"></i>
                </li>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
    const iconList = ['icon-gongzuoguanli-huiyiguanli', 'icon-gongzuoguanli-hetongguanli', 'icon-gongzuoguanli-gongzuoqingdan', 'icon-gongzuoguanli-gongzuobaogao']
    const selectIcon = (icon: string) => {
      form.value.name = icon
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
    onUnmounted(() => {
      console.log(88888)
    })

    return {
      refForm, rules, iconList, selectIcon, deleteIcon, ...resData, form, add, tableData, onSubmit, editClick, deleteClick, cancelClick, commitClick
    }
  }
})
</script>
<style lang="scss" scoped>
/deep/ .el-input{
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
.el-form{
  display: flex;
  flex-wrap: wrap;
}
.el-pagination{
  text-align: center;
  padding-top: 30px;
  margin: 0 auto;
}
.iconList{
  display: flex;
  flex-wrap: wrap;
  width: 260px;
  padding: 0;
  li{
    width: 42px;
    height: 42px;
    margin: 5px;
    box-sizing: border-box;
    border: 1px solid #e0e0e0;
    position: relative;
  }
  .iconfont{
    font-size: 32px;
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
