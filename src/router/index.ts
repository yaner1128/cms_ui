import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

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
        component: () => import('@/views/Home.vue')
      }
    ]
  },
  // 项目列表
  {
    path: '/project',
    redirect: '/project/projectList',
    component: Layout,
    children: [
      {
        path: 'projectList',
        component: () => import('@/views/Project/projectList/index.vue')
      },
      {
        path: 'created',
        component: () => import('@/views/Project/created/index.vue')
      },
      {
        path: 'details',
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
        component: () => import('@/views/AttLibrary/index.vue')
      }
    ]
  },
  // 系统设置
  {
    path: '/System',
    redirect: '/System/setting',
    component: Layout,
    children: [
      {
        path: 'setting',
        component: () => import('@/views/System/index.vue')
      }
    ]
  },
  // 工作台
  {
    path: '/Workbench',
    redirect: '/Workbench',
    component: Layout,
    children: [
      {
        path: '/Workbench',
        component: () => import('@/views/Workbench/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
