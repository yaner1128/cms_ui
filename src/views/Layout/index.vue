<template>
  <div class='layout'>
    <el-container>
      <el-aside>
        <el-scrollbar>
          <div class="title">
            <img src="@/assets/logo.png" alt="">
            <span>得水-项目管理系统</span>
          </div>
          <el-menu
            background-color="#001529"
            text-color="#fff"
            active-text-color="#ffd04b"
            :default-active="routerCur"
            :unique-opened="true"
            router
          >
            <template v-for="(route) in routerList" :key="route.path">
              <el-sub-menu v-if="route.name" :index="route.path">
                <template #title>{{ route.name }}</template>
                <el-menu-item v-for="(item) in route.children" :key="item.path" :index="route.path+'/'+item.path">{{ item.name }}</el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else v-for="item in route.children" :key="item.path" :index="item.path">{{ item.name }}</el-menu-item>
            </template>
            <!-- <el-menu-item index="/home">工作台</el-menu-item>
            <el-sub-menu index="/project">
              <template #title>项目总览</template>
              <el-menu-item index="/project/projectList">项目列表</el-menu-item>
              <el-menu-item index="/project/created">新建项目</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/AttLibrary">附件库</el-menu-item>
            <el-sub-menu index="/System">
              <template #title>系统设置</template>
              <el-menu-item index="/System/role">角色管理</el-menu-item>
              <el-menu-item index="/System/user">用户管理</el-menu-item>
            </el-sub-menu> -->
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-header>
          <div class="toolbar">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }">主页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index" :to="{path: item.path}">{{ item.name }}</el-breadcrumb-item>
              <!-- <el-breadcrumb-item>promotion detail</el-breadcrumb-item> -->
            </el-breadcrumb>
            <div class="userName">{{ userInfo.username }} {{ currentDataName() }}好!</div>
            <el-dropdown>
              <div class="ava">
                <img src="../../assets/person.png" alt="">
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <i class="iconfont icon-gongzuoguanli-huiyiguanli"></i>
                    <span @click="layoutClick" replace>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main>
          <el-scrollbar>
            <div class="container_box">
              <router-view></router-view>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang='ts'>
import router from '@/router'
import $store from '@/store'
import { defineComponent, ref } from 'vue'
import { getUserInfo } from '@/utils/token'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'Layout',
  components: {},
  computed: {
    routerCur () {
      return router.currentRoute.value.path
    },
    breadcrumbList () {
      return router.currentRoute.value.matched.filter((item) => {
        return item.name && item.name !== '主页'
      })
    }
  },
  setup () {
    const routerList = router.options.routes.filter(item => {
      item.children = item.children?.filter(child => {
        return child.name
      })
      return item.meta?.isShow
    })
    const userInfo = ref({
      id: '',
      username: ''
    })
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
    const layoutClick = () => {
      $store.dispatch('LogOut').then(() => {
        router.push({ path: '/', replace: true })
      })
    }
    if (!Cookies.get('userInfo')) {
      router.push({ path: '/login', replace: true })
      ElMessage.error('登录过期, 请重新登录!')
    } else {
      $store.commit('SET_USER', JSON.parse(getUserInfo()))
      userInfo.value = JSON.parse(getUserInfo())
    }

    return {
      userInfo, currentDataName, layoutClick, routerList
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
  padding:5px 10px 0;
  background-color: #f0f0f0;
  .scrollbar{
    background-color: #fff;
  }
  .container_box{
    background-color: #fff;
    padding: 10px;
  }
}
.el-header{
  height: 45px;
  font-size: 14px;
  line-height: 45px;
  margin-bottom: 5px;
  box-shadow: 1px 0px 10px #999;
  .toolbar{
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    .el-breadcrumb{
      flex: 1 0 50%;
      line-height: 45px;
    }
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
    width: 35px;
    padding: 5px 0;
  }
}
.el-container{
  height: 100vh;
}
.el-aside{
  width: 240px;
  border-right: 1px solid #eee;
  background: #001529;
  color: #fff;
  .title{
    width: 100%;
    height: 40px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    line-height: 40px;
    display: flex;
    justify-content: center;
    img{
      width: 60px;
      padding: 5px;
    }
  }
  .el-menu{
    height: calc(100vh - 40px);
    // background-color: #fff;
  }
}

</style>
