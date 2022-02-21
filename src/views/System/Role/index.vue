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
      <el-form :model="createForm">
        <el-form-item label="角色名称">
          <el-input v-model="createForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色代码">
          <el-input v-model="createForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色级别">
          <el-input-number v-model="createForm.level" :min="1" controls-position="right" />
        </el-form-item>
        <el-form-item label="数据范围">
          <el-select v-model="createForm.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai"></el-option>
            <el-option label="Zone No.2" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input v-model="createForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="roleBox">
      <div class="left">
        <div class="title">角色列表</div>
        <div class="box">
          <el-table :data="roleData">
            <el-table-column prop="name" label="名称"  />
            <el-table-column prop="code" label="角色代码"  />
            <el-table-column prop="permission" label="数据权限" />
            <el-table-column prop="level" label="角色级别"  />
            <el-table-column prop="desc" label="描述" />
            <el-table-column prop="createDate" label="创建日期" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right">
        <div class="title">菜单分配</div>
        <div class="box">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            :default-checked-keys="[5]"
            :props="{
              children: 'children',
              label: 'label',
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'

const treeData = [
  {
    id: 1,
    label: '主页'
  },
  {
    id: 2,
    label: '项目总览',
    children: [
      {
        id: 5,
        label: '项目列表'
      },
      {
        id: 6,
        label: '新建项目'
      }
    ]
  },
  {
    id: 3,
    label: '附件库'
  },
  {
    id: 3,
    label: '系统设置',
    children: [
      {
        id: 5,
        label: '角色管理'
      },
      {
        id: 6,
        label: '权限管理'
      }
    ]
  },
  {
    id: 3,
    label: '工作台'
  }
]
export default defineComponent({
  name: 'System',
  components: {},
  setup () {
    const roleData = ref([{ name: 123 }])

    const formInline = ref({
      name: ''
    })
    const searchData = () => {
      console.log(formInline.value)
    }
    const createUser = () => {
      console.log()
    }

    const curTitle = ref('新增')
    const dialogFormVisible = ref(false)
    const createForm = ref({
      name: '',
      region: '',
      level: '1'
    })
    const createClick = () => {
      curTitle.value = '新增'
      createForm.value = { name: '', region: '', level: '1' }
      dialogFormVisible.value = true
    }

    const editClick = (row: { name: string; region: string; level: string }) => {
      curTitle.value = '编辑'
      createForm.value = row
      dialogFormVisible.value = true
    }
    return {
      formInline, searchData, createUser, roleData, dialogFormVisible, createClick, createForm, editClick, curTitle, treeData
    }
  }
})
</script>
<style lang="scss" scoped>
.roleBox{
  display: flex;
  flex-flow: row;
  height: 400px;
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
