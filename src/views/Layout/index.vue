<template>
  <div class='layout'>
    <el-container>
      <el-aside>
        <el-scrollbar>
          <div class="title">
            得水-合同管理系统
          </div>
          <el-menu default-active="/home" :unique-opened="true" router>
            <el-menu-item index="/home">主页</el-menu-item>
            <el-sub-menu index="/project">
              <template #title>项目列表</template>
              <el-menu-item index="/project/projectList">项目列表</el-menu-item>
              <el-menu-item index="/project/created">新建项目</el-menu-item>
              <el-menu-item index="/project/details">项目详情</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/AttLibrary">附件库</el-menu-item>
            <el-menu-item index="/System/setting">系统设置</el-menu-item>
            <el-menu-item index="/Workbench">工作台</el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>Tom</span>
          </div>
        </el-header>

        <el-main>
          <el-scrollbar>
            <router-view></router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Layout',
  components: {},
  setup () {
    return {}
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-menu{
  border: none;
}
.el-container{
  height: 100vh;
}
.el-aside{
  width: 220px;
  border-right: 1px solid #eee;
  .title{
    width: 100%;
    height: 40px;
    font-size: 18px;
    color: #000;
    font-weight: 600;
    text-align: center;
    line-height: 40px;
  }
  .el-menu{
    height: calc(100vh - 40px);
    background-color: #fff;
  }
}

</style>
