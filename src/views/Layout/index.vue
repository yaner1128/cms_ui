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
                <el-menu-item v-for="(item) in route.children" :key="item.path" :index="item.path">{{ item.name }}</el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else v-for="item in route.children" :key="item.path" :index="item.path">{{ item.name }}</el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header>
          <div class="toolbar">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }">工作台</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index" :to="{path: item.path}">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="userName">{{ userInfo.employeeName }} {{ currentDataName }}好!</div>
            <el-dropdown>
              <div class="ava">
                <img src="../../assets/person.png" alt="">
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button type="text" @click="layoutClick">退出登录</el-button>
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
import { defineComponent, ref } from 'vue'
import router from '@/router'
import $store from '@/store'
import Cookies from 'js-cookie'
import { ElMessageBox, ElMessage } from 'element-plus'
import { RouteRecordRaw } from 'vue-router'
import { getAllMenuList } from '@/api/menu'
import Layout from '@/views/Layout/index.vue'

export default defineComponent({
  name: 'Layout',
  components: {},
  computed: {
    routerCur () {
      return router.currentRoute.value.path
    },
    breadcrumbList () {
      return router.currentRoute.value.matched.filter((item) => {
        return item.name && item.name !== '工作台'
      })
    },
    currentDataName () {
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
  },
  setup () {
    if (!Cookies.get('ctms-web')) {
      router.push({ path: '/login', replace: true })
      ElMessage.error('登录过期, 请重新登录!')
    }
    /**
     * 获取用户信息
     */
    const userInfo = ref<any>({})
    $store.commit('getUser')
    userInfo.value = $store.state.userInfo
    /**
     * 获取路由配置设置菜单
     */
    const meueData = router.options.routes.concat($store.state.temp)
    const routerList = meueData.filter((item) => {
      item.children = item.children?.filter(child => {
        return child.name && child.meta?.isShow
      })
      return item.meta?.isShow
    })
    /**
     * 退出登录
     */
    const layoutClick = () => {
      ElMessageBox.confirm('确认退出登录吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $store.dispatch('LogOut').then(() => {
          router.push({ path: '/', replace: true })
          ElMessage({
            type: 'success',
            message: '退出登录'
          })
        })
      }).catch(() => {
        console.log('取消')
      })
    }

    return {
      userInfo, layoutClick, routerList
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
