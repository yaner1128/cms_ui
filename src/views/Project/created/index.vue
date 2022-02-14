<template>
  <div class='createdBox'>
    <div class="mainBox">
      <div class="title">新建项目</div>
      <div class="formBox">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px" label-position="left">
          <el-form-item label="项目名称:">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="项目类型:">
            <el-select v-model="form.type" placeholder="请选择项目类型">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任人:">
            <el-select v-model="form.owner" placeholder="请选择责任人">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否招投标:">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="销售数量:">
            <el-input v-model="form.salesNum"></el-input>
          </el-form-item>
          <el-form-item label="采购数量:">
            <el-input v-model="form.amountNum"></el-input>
          </el-form-item>
          <el-form-item label="销售金额:">
            <el-input v-model="form.sales"></el-input>
          </el-form-item>
          <el-form-item label="采购金额:">
            <el-input v-model="form.amount"></el-input>
          </el-form-item>
          <el-form-item label="项目区域:">
            <el-input type="textarea" v-model="form.region"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Home',
  components: {},
  setup () {
    const form = {
      name: '',
      type: '',
      owner: '',
      isBidding: '',
      product: '',
      salesNum: 0,
      amountNum: 0,
      sales: 0,
      amount: 0,
      region: ''
    }
    const rules = {
      name: [
        { required: true, message: '请输入项目名称', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择活动区域', trigger: 'change' }
      ],
      owner: [
        { required: true, message: '请选择活动区域', trigger: 'change' }
      ],
      isBidding: [
        { required: true, message: '请选择时间', trigger: 'change' }
      ],
      product: [
        { required: true, message: '请至少选择一个活动性质', trigger: 'change' }
      ],
      salesNum: [
        { required: true, message: '请选择活动资源', trigger: 'change' }
      ],
      amountNum: [
        { required: true, message: '请填写活动形式', trigger: 'blur' }
      ],
      sales: [
        { required: true, message: '请选择活动资源', trigger: 'change' }
      ],
      amount: [
        { required: true, message: '请填写活动形式', trigger: 'blur' }
      ],
      region: [
        { required: true, message: '请选择活动资源', trigger: 'change' }
      ]
    }
    function onSubmit () {
      console.log(form)
    }
    return {
      form, rules, onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-select{
  width: 350px;
}
.mainBox{
  .title{
    font-size: 16px;
    padding-bottom: 10px;
    font-weight: 600;
    text-align: left;
    border-bottom: 1px solid #ccc;
    margin-bottom: 15px;
  }
  .formBox{
    width: 360px;
  }
}
</style>
