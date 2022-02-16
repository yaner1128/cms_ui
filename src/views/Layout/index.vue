<template>
  <div class='layout'>
    <el-container>
      <el-aside>
        <el-scrollbar>
          <div class="title">
            得水-项目管理系统
          </div>
          <el-menu :default-active="routerCur" :unique-opened="true" router @select="selectMenu">
            <el-menu-item index="/home">主页</el-menu-item>
            <el-sub-menu index="/project">
              <template #title>项目总览</template>
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
        <el-header>
          <div class="toolbar">
            <div class="userName">{{ userName }} {{ currentDataName() }}好!</div>
            <el-dropdown>
              <div class="ava">
                <img src="../../assets/person.png" alt="">
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/login">退出登录</router-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
import router from '@/router'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Layout',
  components: {},
  computed: {
    routerCur () {
      return router.currentRoute.value.path
    }
  },
  setup () {
    console.log('router', router)
    function currentDataName () {
      const curHour = new Date().getHours()
      if (curHour <= 8) {
        return '早上'
      } else if (curHour <= 12) {
        return '上午'
      } else if (curHour <= 19) {
        return '下午'
      } else {
        return '晚上'
      }
    }
    const userName = 'admin'

    function selectMenu (index: string, indexPath: any) {
      console.log(index, indexPath)
      console.log('currentRoute', router.currentRoute.value.matched)
    }

    return {
      currentDataName, userName, selectMenu
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-menu{
  border: none;
}
a{
  all: unset;
}
.el-main{
  padding-top: 0;
}
.el-header{
  height: 50px;
  font-size: 14px;
  line-height: 50px;
  // border-bottom: 1px solid #e0e0e0;
  .toolbar{
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
  }
  .breadcrumb{
    flex: 1 0 50%;
    height: 50px;
    .el-breadcrumb{
      height: 100%;
      line-height: 50px;
    }
  }
  .userName{
    font-size: 15px;
    padding: 0 10px;
  }
  img{
    width: 40px;
    padding: 5px 0;
  }
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
