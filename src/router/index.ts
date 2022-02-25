import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

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
    name: 'login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      isShow: false
    }
  },
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
  },
  // 项目列表
  {
    path: '/project',
    name: '项目总览',
    redirect: '/project/projectList',
    component: Layout,
    meta: {
      isShow: true
    },
    children: [
      {
        path: 'projectList',
        name: '项目列表',
        component: () => import('@/views/Project/projectList/index.vue'),
        meta: {
          isShow: true
        }
      },
      {
        path: 'created',
        name: '新建项目',
        component: () => import('@/views/Project/created/index.vue'),
        meta: {
          isShow: true
        }
      },
      {
        path: 'details',
        component: () => import('@/views/Project/details/index.vue'),
        meta: {
          isShow: false
        }
      }
    ]
  },
  // 附件库
  {
    path: '/AttLibrary',
    redirect: '/AttLibrary',
    component: Layout,
    meta: {
      isShow: true
    },
    children: [
      {
        path: '/AttLibrary',
        name: '附件库',
        component: () => import('@/views/AttLibrary/index.vue'),
        meta: {
          isShow: true
        }
      }
    ]
  },
  // 系统设置
  {
    path: '/System',
    redirect: '/System/role',
    name: '系统设置',
    component: Layout,
    meta: {
      isShow: true
    },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/System/User/index.vue'),
        meta: {
          isShow: true
        }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/System/Role/index.vue'),
        meta: {
          isShow: true
        }
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
