<template>
  <div class="loginBox">
    <div class="loginForm">
      <div class="form">
        <div class="projectName">得水-项目管理系统</div>
        <div class="title">账号登录</div>
        <el-form ref="refForm" :model="loginForm" :rules="rules" class="demo-form-inline">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" auto-complete="off" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" autocomplete="off" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="login">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import router from '@/router'
import $store from '@/store'
import { defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loadByUsername } from '@/api/login'
import { getAllMenuList } from '@/api/menu'
import Layout from '@/views/Layout/index.vue'
import { RouteRecordRaw } from 'node_modules/vue-router/dist/vue-router'

const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

export default defineComponent({
  name: 'Login',
  components: {},
  setup () {
    const loading = ref(false)
    const loginForm = ref({
      username: '',
      password: '',
      rememberMe: false
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
    // 表单校验
    const refForm = ref()
    const login = () => {
      refForm.value.validate((valid:boolean) => {
        if (valid) {
          loading.value = true
          // 校验成功
          $store.dispatch('Login', loginForm.value).then(() => {
            loading.value = false
            // 获取个人信息
            loadByUsername().then(res => {
              $store.commit('setUser', res.data.data)
            })
            getAllMenuList('').then(res => {
              $store.commit('setMenu', res.data.data)
              localStorage.setItem('menu', JSON.stringify(res.data.data))
              const handleRoueEvent = () => {
                $store.commit('setMenu', $store.state.menu)
                const temp: any[] = []
                const menuData = $store.state.menu
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
                $store.commit('setTemp', temp)
              }
              router.push({ path: '/home', replace: true })
            })
          }).catch(() => {
            loading.value = false
            ElMessage.error('请输入正确的用户名/密码！')
          })
        }
      })
    }

    return {
      loading, loginForm, rules, refForm, login
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-button{
  width: 260px;
}
.loginBox{
  width: 100vw;
  height: 100vh;
  // background-color: rgba(0,0,0,0.5);
  background: url('../../assets/back.jpg') no-repeat 100%;
  background-size:1920px 1080px;
  position: relative;
  overflow: hidden;
  .loginForm{
    padding: 50px;
    box-sizing: border-box;
    width: 500px;
    height: 600px;
    background-color: rgba(255,255,255,0.4);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .form{
      width: 80%;
      height: 80%;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .projectName{
        font-size: 25px;
        font-weight: bold;
        padding-bottom: 10px;
      }
      .title{
        font-size: 18px;
        font-weight: 400;
        margin-bottom: 50px;
      }
    }
  }
}
</style>
