import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
import store from '@/store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      isShow: false
    }
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      isShow: false
    }
  },
  // 工作台
  {
    path: '/home',
    redirect: '/home',
    component: Layout,
    meta: {
      isShow: true
    },
    children: [
      {
        path: '/home',
        name: '工作台',
        // component: () => import('@/views/Home.vue')
        component: () => import('@/views/Workbench/index.vue'),
        meta: {
          isShow: true
        }
      }
    ]
  }
  // 项目列表
  // {
  //   path: '/project',
  //   name: '项目总览',
  //   redirect: '/project/projectList',
  //   component: Layout,
  //   meta: {
  //     isShow: true
  //   },
  //   children: [
  //     {
  //       path: 'projectList',
  //       name: '项目列表',
  //       component: () => import('@/views/Project/projectList/index.vue'),
  //       meta: {
  //         isShow: true
  //       }
  //     },
  //     {
  //       path: 'created',
  //       name: '新建项目',
  //       component: () => import('@/views/Project/created/index.vue'),
  //       meta: {
  //         isShow: true
  //       }
  //     },
  //     {
  //       path: 'details',
  //       component: () => import('@/views/Project/details/index.vue'),
  //       meta: {
  //         isShow: false
  //       }
  //     }
  //   ]
  // },
  // 系统设置
  // {
  //   path: '/System',
  //   redirect: '/System/role',
  //   name: '系统设置',
  //   component: Layout,
  //   meta: {
  //     isShow: true
  //   },
  //   children: [
  //     {
  //       path: 'user',
  //       name: '用户管理',
  //       component: () => import('@/views/System/User/index.vue'),
  //       meta: {
  //         isShow: true
  //       }
  //     },
  //     {
  //       path: 'depart',
  //       name: '部门管理',
  //       component: () => import('@/views/System/Depart/index.vue'),
  //       meta: {
  //         isShow: true
  //       }
  //     },
  //     {
  //       path: 'role',
  //       name: '岗位管理',
  //       component: () => import('@/views/System/Role/index.vue'),
  //       meta: {
  //         isShow: true
  //       }
  //     },
  //     {
  //       path: 'api',
  //       name: '接口管理',
  //       component: () => import('@/views/System/Api/index.vue'),
  //       meta: {
  //         isShow: true
  //       }
  //     },
  //     {
  //       path: 'menu',
  //       name: '菜单管理',
  //       component: () => import('@/views/System/Menu/index.vue'),
  //       meta: {
  //         isShow: true
  //       }
  //     }
  //   ]
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const handleRoute = (arr: string | any[], temp: any) => {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
      temp.push({
        name: arr[i].permissionName,
        path: arr[i].permissionUrl,
        component: () => import(`@/views${arr[i].vueFileUrl}/index.vue`),
        redirect: '',
        meta: {
          isShow: arr[i].isShow !== '否'
        },
        children: []
      })
      handleRoute(arr[i].children, temp[i].children)
    } else {
      temp.push({
        name: arr[i].permissionName,
        path: arr[i].permissionUrl,
        component: () => import(`@/views${arr[i].vueFileUrl}/index.vue`),
        redirect: '',
        meta: {
          isShow: arr[i].isShow !== '否'
        }
      })
    }
  }
}
const handleRoueEvent = () => {
  store.commit('setMenu', store.state.menu)
  const temp: any[] = []
  const menuData = store.state.menu
  handleRoute(menuData, temp)
  console.log(temp)
  for (let i = 0; i < temp.length; i++) {
    if (temp[i].children) {
      const name = temp[i].name
      router.addRoute({ name: temp[i].name, path: temp[i].path, component: Layout })
      temp[i].children.forEach((item: RouteRecordRaw) => {
        router.addRoute(name, item)
      })
    } else {
      router.addRoute(temp[i])
    }
  }
  store.commit('setTemp', temp)
}

router.beforeEach((to, from, next) => {
  if (!router.hasRoute(to.name || '')) {
    handleRoueEvent()
    next({ ...to, replace: true })
  }
  if (to.path === '/login') {
    next()
  } else {
    if (to.path !== '/login' && !Cookies.get('ctms-web')) {
      next({ path: '/login' })
      ElMessage.error('登录过期, 请重新登录!')
    } else {
      handleRoueEvent()
      next()
    }
  }
})

export default router
