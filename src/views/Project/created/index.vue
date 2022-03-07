<template>
  <div class='createdBox'>
    <div class="mainBox">
      <div class="title">新建项目</div>
      <div class="formBox">
        <el-form ref="refForm" :rules="rules" :model="form" label-width="100px" label-position="left">
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="form.projectName" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目类型:" prop="projectType">
            <el-select v-model="form.projectType" placeholder="请选择项目类型" @change="changeType">
              <el-option label="自营软件项目" :value="0"></el-option>
              <el-option label="采购代理软件" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="责任人:" prop="leaderId">
            <el-select v-model="form.leaderId" placeholder="请选择责任人">
              <el-option v-for="(item,index) in ownerList" :key="index" :label="item.employeeName" :value="item.employeeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否招投标:" prop="isBidding">
            <el-switch v-model="form.isBidding" active-color="#13ce66" inactive-color="#DCDFE6" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="招标日期:" v-show="form.isBidding==='1'">
            <el-date-picker v-model="value1" type="date" placeholder="请选择招标日期" @change="dateChange('inviteTendersDate', $event)"></el-date-picker>
          </el-form-item>
          <el-form-item label="是否中标:" prop="isWin" v-show="form.isBidding==='1'">
            <!-- <el-switch v-model="form.isWin" active-color="#13ce66" inactive-color="#DCDFE6" active-value="是" inactive-value="否"></el-switch> -->
            <el-select v-model="form.isWin" placeholder="请选择" clearable>
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="中标公司:" v-show="form.isWin==='是'">
            <el-input v-model="form.companyId" clearable></el-input>
          </el-form-item>
          <el-form-item label="中标日期:" v-show="form.isWin==='是'">
            <el-date-picker v-model="value2" type="date" placeholder="请选择招标日期" @change="dateChange('winBiddingDate', $event)"></el-date-picker>
          </el-form-item>
          <el-form-item label="所售产品:" prop="productId">
            <el-select v-model="form.productId" placeholder="请选择所售产品">
              <el-option v-for="(item,index) in productList" :key="index" :label="item.productName" :value="item.productId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售数量:" prop="saleCount">
            <el-input-number v-model="form.saleCount" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="采购数量:" prop="purchaseCount">
            <el-input-number v-model="form.purchaseCount" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="销售金额:" prop="saleAmount">
            <el-input v-model="form.saleAmount" clearable></el-input>
          </el-form-item>
          <el-form-item label="采购金额:" prop="purchaseAmount">
            <el-input v-model="form.purchaseAmount" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目区域:" prop="provinceCode" class="regionBox">
            <el-select v-model="form.provinceCode" placeholder="请选择" @change="changeRegion" clearable>
              <el-option v-for="item in areaList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"></el-option>
            </el-select>
            <hr>
            <el-select v-model="form.cityCode" placeholder="请选择" :disabled="!form.provinceCode" clearable>
              <el-option v-for="item in parentList" :key="item.areaCode" :label="item.areaName" :value="item.areaCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否验收:" prop="isChecked">
            <el-select v-model="form.isChecked" placeholder="请选择" clearable>
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目附件:" class="annexItem">
            <el-upload
              ref="uploadRef"
              drag
              accept="image/*,.pdf"
              action=""
              :http-request="imggreySuccess"
              :on-exceed="fileExceed"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :auto-upload="false"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">将文件拖到此处,或<em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">只能上传pdf/jpg/png文件，且不超过500kb</div>
              </template>
            </el-upload>
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
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { getSelectArea, getSelectParent, getProducts, getUserList, insertBatchSomeColumn } from '@/api/created'
import { format } from '@/utils/dateFormat'
import { getUserInfo } from '@/utils/token'
import router from '@/router'
import { ElMessage, ElUpload } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const rules = reactive({
  projectName: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  projectType: [
    { required: true, message: '请选择项目类型', trigger: 'change' }
  ],
  leaderId: [
    { required: true, message: '请选择责任人', trigger: 'change' }
  ],
  productId: [
    { required: true, message: '请选择所售产品', trigger: 'change' }
  ]
})

interface ownerDataType {
  employeeId: number;
  employeeName: string;
}
interface fromType {
  projectName: string;
  projectType: string|number;
  leaderId: string|number;
  [propname: string]: unknown;
}
interface regionType{
  areaCode: string;
  areaLevel: number;
  areaName: string;
  [propname: string]: unknown;
}
export default defineComponent({
  name: 'created',
  components: { UploadFilled },
  setup () {
    // 附件
    const fileList = ref<any[]>([])
    // 区域
    const areaList = ref<regionType[]>([])
    const parentList = ref<regionType[]>([])
    // 责任人、产品数据
    const ownerList = ref<ownerDataType[]>([])
    const productList = ref<{productName: string, productId: number}[]>([])
    const data = reactive({
      value1: '', // 时间
      value2: '', // 时间
      areaLevel: 0,
      dateChange: (code: string, val: any) => { // 日期范围修改方法
        form.value[code] = format(new Date(val), 'yyyy-MM-dd')
      },
      changeType: (val: unknown) => {
        if (val === 0) {
          form.value.leaderId = 1
        }
      },
      changeRegion: (val: any) => { // 获取省份列表
        data.getParent({ parentCode: val })
      },
      getParent: (query: { parentCode: string|number }) => {
        console.log('///////', query)
        getSelectParent(query).then(res => {
          parentList.value = res.data.data
        })
      },
      jumpClick: () => {
        router.push({ path: '/project' })
      }
    })
    const resData = toRefs(data)
    const form = ref<fromType>({ projectName: '', projectType: '', leaderId: '', isBidding: 0, productId: '', saleCount: 0, purchaseCount: 0, saleAmount: 0, purchaseAmount: 0, provinceCode: '', cityCode: '' })

    // 获取选择框下拉数据
    const getData = () => {
      const promise1 = getUserList()
      const promise2 = getProducts()
      const promise3 = getSelectArea()
      Promise.all([promise1, promise2, promise3]).then(res => {
        ownerList.value = res[0].data.data
        productList.value = res[1].data.data
        areaList.value = res[2].data.data
      })
      productList.value = [{
        productName: '1111', productId: 11
      }]
    }
    getData()
    // 校验表单
    const refForm = ref()
    const onSubmit = () => {
      refForm.value.validate((valid:boolean) => {
        if (valid) {
          fileList.value = []
          console.log(fileList.value)
          submitUpload()
          // 校验成功 创建
          const params = Object.assign({
            createTime: format(new Date(), 'yyyy-MM-dd'),
            // createUser: JSON.parse(getUserInfo()).username
            createUser: 1,
            fileList: fileList.value.length > 0 ? fileList.value : null
          }, form.value)
          let queryData = ''
          for (var k in params) {
            if (params[k] || params[k] === 0) {
              queryData += `${k}=${params[k]}&`
            }
          }
          console.log('上传参数：', params)
          insertBatchSomeColumn(queryData.slice(0, -1)).then(res => {
            console.log('***res.data***', res.data)
            ElMessage({
              message: '新增成功, 跳转项目列表',
              type: 'success'
            })
            setTimeout(() => {
              router.push({ path: '/project', replace: true })
            }, 1500)
          })
        }
      })
    }
    // 重置
    const reset = () => {
      form.value = { projectName: '', projectType: '', leaderId: '', isBidding: 0, productId: '', saleCount: 0, purchaseCount: 0, saleAmount: 0, purchaseAmount: 0, provinceCode: '', cityCode: '' }
    }
    const fileExceed = () => {
      ElMessage.warning('文件超出限制')
    }
    const filePreview = (file: unknown) => {
      console.log(file)
    }
    const uploadRef = ref<InstanceType<typeof ElUpload>>()
    // 附件提交
    const submitUpload = () => {
      uploadRef.value!.submit()
    }
    const imggreySuccess = (file: any) => {
      fileList.value.push(file)
      console.log('fileList', fileList.value)
    }
    const uploadSuccess = (response: any, file:unknown, fileList: unknown) => {
      console.log(response, file)
    }
    const uploadError = (error: unknown) => {
      console.log(error)
      ElMessage.warning('导入失败!')
    }
    return {
      ...resData, areaList, parentList, ownerList, productList, form, rules, refForm, onSubmit, reset, uploadRef, fileExceed, filePreview, submitUpload, uploadSuccess, uploadError, imggreySuccess, fileList
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
  height: calc(100vh - 80px);
  .title{
    font-size: 16px;
    padding-bottom: 10px;
    font-weight: 600;
    text-align: left;
    border-bottom: 1px solid #ccc;
    margin-bottom: 15px;
  }
  .el-form{
    // width: 360px;
    display: flex;
    flex-wrap: wrap;
    .annexItem{
      width: 100%;
    }
  }
}
/deep/ .regionBox .el-form-item__content{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
/deep/ .el-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 18px;
  width: 380px;
  margin-right: 100px
}
</style>
