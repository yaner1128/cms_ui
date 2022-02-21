<template>
  <div class="loginBox">
    <div class="loginForm">
      <div class="form">
        <div class="projectName">得水-项目管理系统</div>
        <div class="title">账号登录</div>
        <el-form ref="refForm" :model="loginForm" :rules="rules" class="demo-form-inline">
          <el-form-item prop="name">
            <el-input v-model="loginForm.name" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.isRem">记住密码</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import router from '@/router'
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'Login',
  components: {},
  setup () {
    const loginForm = reactive({
      name: '',
      password: '',
      isRem: false
    })
    const rules = reactive({
      name: [
        { required: true, message: '请输入账号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    })
    const refForm = ref()
    const login = () => {
      refForm.value.validate((valid:boolean) => {
        if (valid) {
          // 校验成功
          router.push('/home')
        }
      })
    }

    return {
      loginForm, rules, login, refForm
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
