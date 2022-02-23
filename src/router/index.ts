import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/home',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: '工作台',
        // component: () => import('@/views/Home.vue')
        component: () => import('@/views/Workbench/index.vue')
      }
    ]
  },
  // 项目列表
  {
    path: '/project',
    name: '项目总览',
    redirect: '/project/projectList',
    component: Layout,
    children: [
      {
        path: 'projectList',
        name: '项目列表',
        component: () => import('@/views/Project/projectList/index.vue')
      },
      {
        path: 'created',
        name: '新建项目',
        component: () => import('@/views/Project/created/index.vue')
      },
      {
        path: 'details',
        name: '项目详情',
        component: () => import('@/views/Project/details/index.vue')
      }
    ]
  },
  // 附件库
  {
    path: '/AttLibrary',
    redirect: '/AttLibrary',
    component: Layout,
    children: [
      {
        path: '/AttLibrary',
        name: '附件库',
        component: () => import('@/views/AttLibrary/index.vue')
      }
    ]
  },
  // 系统设置
  {
    path: '/System',
    redirect: '/System/role',
    name: '系统设置',
    component: Layout,
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/System/User/index.vue')
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/System/Role/index.vue')
      }
    ]
  }
  // 工作台
  // {
  //   path: '/Workbench',
  //   redirect: '/Workbench',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/Workbench',
  //       name: '工作台',
  //       component: () => import('@/views/Workbench/index.vue')
  //     }
  //   ]
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !Cookies.get('userInfo')) {
    next({ name: 'login' })
    ElMessage.error('登录过期, 请重新登录!')
  } else next()
})

export default router
