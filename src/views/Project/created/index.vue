<template>
  <div class='createdBox'>
    <div class="mainBox">
      <div class="title">新建项目</div>
      <div class="formBox">
        <el-form ref="refForm" :rules="rules" :model="form" label-width="100px" label-position="left">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="form.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目类型:" prop="type">
            <el-select v-model="form.type" placeholder="请选择项目类型" @change="changeType">
              <el-option label="自有软件销售" value="自有软件销售"></el-option>
              <el-option label="代理软件销售" value="代理软件销售"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任人:" prop="owner">
            <el-select v-model="form.owner" placeholder="请选择责任人">
              <el-option v-for="(item,index) in ownerList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否招投标:" prop="isBidding">
            <el-switch v-model="form.isBidding" active-color="#13ce66" inactive-color="#DCDFE6"></el-switch>
          </el-form-item>
          <el-form-item label="所售产品:" prop="product">
            <el-select v-model="form.product" placeholder="请选择所售产品">
              <el-option v-for="(item,index) in productList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售数量:" prop="salesNum">
            <!-- <el-input v-model="form.salesNum" clearable></el-input> -->
            <el-input-number v-model="form.salesNum" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="采购数量:" prop="amountNum">
            <!-- <el-input v-model="form.amountNum" clearable></el-input> -->
            <el-input-number v-model="form.amountNum" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="销售金额:" prop="sales">
            <el-input v-model="form.sales" clearable></el-input>
          </el-form-item>
          <el-form-item label="采购金额:" prop="amount">
            <el-input v-model="form.amount" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目区域:" prop="region">
            <!-- <el-input type="textarea" v-model="form.region" clearable></el-input> -->
            <el-cascader v-model="form.region" :options="regionList" placeholder="请选择项目区域" clearable></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue'
import { getOwnerList, getRegionList, getProductList } from '@/api/created'

const rules = reactive({
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择项目类型', trigger: 'change' }
  ],
  owner: [
    { required: true, message: '请选择责任人', trigger: 'change' }
  ],
  product: [
    { required: true, message: '请选择所售产品', trigger: 'change' }
  ]
})

interface ownerListType {
  label: string
  value: string
}
export default defineComponent({
  name: 'created',
  setup () {
    // 定义表单
    const form = ref({
      name: '',
      type: '',
      owner: '',
      isBidding: true,
      product: '',
      salesNum: 0,
      amountNum: 0,
      sales: 0,
      amount: 0,
      region: ''
    })
    // 责任人、产品、地区 列表数据
    const ownerList: ownerListType[] = reactive([])
    const productList: ownerListType[] = reactive([])
    const regionList: any[] = reactive([])
    const getData = () => {
      getOwnerList().then(res => {
        ownerList.splice(0, ownerList.length, ...res.data[0].data.data)
      })
      getRegionList().then(res => {
        regionList.splice(0, regionList.length, ...res.data[0].data.data)
      })
      getProductList().then(res => {
        productList.splice(0, productList.length, ...res.data[0].data.data)
      })
    }
    getData()
    // 联动
    const changeType = (val: string) => {
      if (val === '自有软件销售') {
        form.value.owner = '罗真'
      }
    }
    // 校验表单
    const refForm = ref()
    const onSubmit = () => {
      refForm.value.validate((valid:boolean) => {
        if (valid) {
          // 校验成功 创建
          console.log(form.value)
        }
      })
    }
    // 重置
    const reset = () => {
      form.value = reactive({
        name: '',
        type: '',
        owner: '',
        isBidding: true,
        product: '',
        salesNum: 0,
        amountNum: 0,
        sales: 0,
        amount: 0,
        region: ''
      })
    }
    return {
      form, rules, ownerList, productList, regionList, changeType, refForm, onSubmit, reset
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-select,.el-input-number{
  width: 360px;
}
/deep/ .el-cascader{
  width: 360px;
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
