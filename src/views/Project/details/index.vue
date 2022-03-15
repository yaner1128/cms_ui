<template>
  <div class='detailBox'>
    <div class="generalization">
      <span class="title">{{ detailObj.projectName }}项目情况概览</span>
      <div class="processBox">
        <el-steps :active="active" align-center>
          <el-step title="立项" description="">
            <template #description>
              <span>中标日期: {{ detaileVo.winBiddingDate || '' }}</span>
              <br>
              <span>合同签订日期: {{ detaileVo.contractSignDate || '' }}</span>
            </template>
          </el-step>
          <el-step title="项目验收" description="">
            <template #description>
              <span>验收日期: {{ detaileVo.checkDate || '' }}</span>
            </template>
          </el-step>
          <el-step title="待付款" description="">
            <template #description>
              <span v-for="(item, index) in planList" :key="item">
                第{{ index + 1 }}次付款计划：{{ item.paymentDate || '' }}<br>
              </span>
            </template>
          </el-step>
          <el-step title="项目完成" description="">
            <template #description>
              <span>合同终止日期: {{ detaileVo.completedTime ||'' }}<br/></span>
            </template>
          </el-step>
        </el-steps>
      </div>
      <div class="detailContent">
        <ul>
          <li>
            <span>项目名称</span>：<el-input v-model="detailObj.projectName" :disabled="!isEdit"></el-input>
          </li>
          <li>
            <span>立项日期</span>：
            <el-date-picker v-model="detailObj.contractSignDate" type="date" placeholder="请选择招标日期" :disabled="!isEdit" @change="dateChange($event,'contractSignDate')"></el-date-picker>
          </li>
          <li>
            <span>项目类型</span>：
            <el-select v-model="detailObj.projectType" placeholder="请选择项目类型" :disabled="!isEdit">
              <el-option label="自营软件项目" :value="0"></el-option>
              <el-option label="采购代理软件" :value="1"></el-option>
            </el-select>
          </li>
          <li>
            <span>责任人</span>：
            <el-select v-model="detailObj.leaderId" placeholder="请选择责任人" :disabled="!isEdit">
              <el-option v-for="(item,index) in ownerList" :key="index" :label="item.employeeName" :value="item.employeeId"></el-option>
            </el-select>
          </li>
          <li>
            <span>是否招投标项目</span>：
            <el-select v-model="detailObj.isBidding" placeholder="请选择项目类型" :disabled="!isEdit">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </li>
          <li>
            <span>中标日期</span>：
            <el-date-picker v-model="detailObj.winBiddingDate" type="date" placeholder="请选择中标日期" :disabled="!isEdit" @change="dateChange($event,'winBiddingDate')"></el-date-picker>
          </li>
          <li>
            <span>采购金额</span>：<el-input v-model="detailObj.purchaseAmount" :disabled="!isEdit"></el-input>
          </li>
          <li>
            <span>销售金额</span>：<el-input v-model="detailObj.saleAmount" :disabled="!isEdit"></el-input>
          </li>
          <li>
            <span>项目产品</span>：
            <el-select v-model="detailObj.productId" placeholder="请选择所售产品" :disabled="!isEdit">
              <el-option v-for="(item,index) in productList" :key="index" :label="item.productName" :value="item.productId"></el-option>
            </el-select>
          </li>
          <li>
            <span>是否已验收</span>：
            <el-select v-model="detailObj.isChecked" placeholder="是否已验收" :disabled="!isEdit">
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </li>
          <li>
            <span>验收日期</span>：
            <el-date-picker v-model="detailObj.checkDate" type="date" placeholder="请选择验收日期" :disabled="!isEdit" @change="dateChange($event,'checkDate')"></el-date-picker>
          </li>
          <li style="width: 100%">
            <span>项目附件</span>：
            <!-- <span class="itemFile" @click="fileClick">附件</span> -->
            <ul id="fileBox" v-if="detailObj.basAttachments">
              <li v-for="item in detailObj.basAttachments" :key="item">
                <span class="itemFile" @click="exportClick(item.attachUrl)">{{ item.attachmentName || '附件名称'}}</span>
                <el-upload v-show="isEdit"
                  class="upload-demo"
                  ref="uploadRef"
                  accept="image/*,.pdf"
                  :limit="1"
                  action=""
                  :on-change="handleFileChange"
                  :on-remove="handleRemove"
                  :auto-upload="false"
                  >
                  <el-button type="text">更新附件 </el-button>
                </el-upload>
                <el-button v-show="isEdit" type="text" @click="deleteClick(item.attachmentId)">删除</el-button>
              </li>
            </ul>
            <el-upload v-else
              v-show="isEdit"
              class="upload-demo"
              ref="uploadRef"
              accept="image/*,.pdf"
              :limit="1"
              action=""
              :on-change="handleFileChange"
              :on-remove="handleRemove"
              :auto-upload="false"
              >
              <el-button type="text">上传附件</el-button>
            </el-upload>
          </li>
        </ul>
        <div class="buttonList">
          <el-button v-show="isEdit" type="primary" @click="commitClick">确认</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogTableVisible" title="附件列表">
      <my-up-load :fileList="fileList" :isEdit="isEdit"></my-up-load>
    </el-dialog>
    <div class="contract">
      <el-tabs type="border-card">
        <el-tab-pane label="采购合同">
          <myPurchase :id="projectId"></myPurchase>
        </el-tab-pane>
        <el-tab-pane label="销售合同">
          <my-sales></my-sales>
        </el-tab-pane>
        <el-tab-pane label="付款计划" v-if="isSale">
          <my-payment-plan></my-payment-plan>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, nextTick, reactive, toRefs } from 'vue'
import { getDetails, updateDetails, getProjectOverview } from '@/api/details'
import { getProducts, getUserList } from '@/api/created'
import router from '@/router'
import { ElMessage } from 'element-plus'
import myPurchase from './modules/purchase.vue'
import mySales from './modules/sales.vue'
import myPaymentPlan from './modules/paymentPlan.vue'
import myUpLoad from '@/components/upload.vue'
import { format } from '@/utils/dateFormat'
import { removeEnclosure } from '@/api/attLibrary'
import store from '@/store'

interface stepListType {
  title: string
  description: any
  desc1?: string
  desc2?: string
}
interface fileType {
  uploadTime: string;
  attachmentName: string;
  projectName: string;
  fileType: string;
  attchmentType: string;
  [propname: string]: any;
}

export default defineComponent({
  name: 'Details',
  components: { myPurchase, mySales, myPaymentPlan, myUpLoad },
  computed: {
    isSale: () => {
      console.log(store.state.isSale)
      return store.state.isSale
    }
  },
  setup () {
    const data = reactive({
      exportClick: (attachUrl: string) => {
        // eslint-disable-next-line no-debugger
        debugger
        const url = `/file/downloadFile?savePath=${attachUrl}`
        const iframe = document.createElement('iframe')
        iframe.src = url
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      },
      deleteClick: (attachmentId: number) => {
        removeEnclosure(attachmentId).then((res: any) => {
          if (res.data.code === 200) {
            ElMessage.warning('附件删除成功 !')
          }
        })
      },
      fileClick: () => {
        data.dialogTableVisible = true
        fileList.value = detailObj.value.basAttachments
        console.log(fileList.value)
      },
      dateChange: (val: any, code: string) => {
        detailObj.value[code] = format(new Date(val), 'yyyy-MM-dd')
      },
      dialogTableVisible: false,
      projectId: 0,
      active: 0 // 步骤条进度
    })
    const resData = toRefs(data)
    const ownerList = ref<{[propname:string]:any}[]>([])
    const productList = ref<{productName: string, productId: number}[]>([])
    // 当前项目详细数据
    const detailObj = ref<{ [propname: string]: any }>({ projectName: '', contractSignDate: '', projectType: '', leaderId: '', isBidding: '', winBiddingDate: '', purchaseAmount: '', saleAmount: '', productId: '', isChecked: '' })
    // 步骤条数据
    const stepList = ref<stepListType[]>([])
    // 附件操作
    const fileList = ref<fileType[]>([])
    const fileListClick = () => {
      fileList.value = []
      data.dialogTableVisible = true
      // fileList.value = detailObj.value.fileList
    }
    const detaileVo = ref<any>({})
    const planList = ref<any>([])
    // 调用接口获取详情数据
    const getData = (query: any) => {
      const params = Object.assign({}, query)
      getDetails(params).then(res => {
        detailObj.value = res.data.data
      })
      const promise1 = getUserList()
      const promise2 = getProducts()
      const promise3 = getProjectOverview({ id: query.id })
      Promise.all([promise1, promise2, promise3]).then((res) => {
        ownerList.value = res[0].data.data
        productList.value = res[1].data.data
        detaileVo.value = res[2].data.data
        data.active = Number(res[2].data.data.status)
        planList.value = detaileVo.value.prjContractsVOList[0]?.prjPaymentPlanVOList
      })
    }
    // 判断是否带参数
    const query = {
      isEdit: router.currentRoute.value.query.flag === 'true',
      id: Number(router.currentRoute.value.query.id)
    }
    const isEdit = ref<boolean>(false)
    onMounted(() => {
      if (query && query.id) {
        data.projectId = query.id
        isEdit.value = query.isEdit
        getData(query)
      } else {
        ElMessage.warning('获取失败, 跳转首页 !')
        setTimeout(() => {
          router.push({ path: '/home', replace: true })
        }, 1000)
      }
    })
    // 编辑状态下点击提交
    const commitClick = () => {
      isEdit.value = false
      console.log(detailObj.value)
      updateDetails(detailObj.value).then(res => {
        console.log('//////', res.data)
      })
    }
    // 附件
    // 附件上传
    const handleFileChange = (file: any, fileList: any) => {
      detailObj.value.basAttachments = fileList[0].raw
    }
    const handleRemove = (file: any, fileList: any) => {
      detailObj.value.basAttachments = fileList[0].raw || []
    }

    return {
      ...resData, detaileVo, stepList, ownerList, productList, detailObj, planList, isEdit, commitClick, fileList, fileListClick, handleFileChange, handleRemove
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-input{
  width: 240px;
}
/deep/ .is-disabled .el-input__inner{
  color: #000 !important;
}
/deep/ .el-button--text{
  width: auto;
}
/deep/ tbody .el-button{
  width: auto !important;
}
.generalization{
  margin-bottom: 30px;
  .title{
    font-size: 16px;
    font-weight: 600;
  }
  .processBox{
    margin: 30px 0;
  }
  .detailContent{
    border: 1px solid #ccc;
    margin: 10px 0;
    padding: 10px;
    ul{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      span{
        width: 100px;
      }
      li{
        display: flex;
        align-items: center;
        height: 35px;
        width: 30%;
        font-size: 13px;
        padding: 5px 0;
        a{
          text-decoration: none;
          line-height: 32px;
        }
        .itemFile{
          cursor: pointer;
          color: rgb(64, 158, 255)
        }
      }
    }
    .buttonList{
      display: flex;
      justify-content: center;
    }
  }
}
#fileBox{
  display: flex;
  width: 100%;
  flex-direction: column;
  li{
    padding: 0;
    height: 30px;
  }
}
.contract{
  .title{
    font-size: 16px;
    padding: 10px 0;
  }
}
/deep/ .salesBox .el-form-item{
  margin-bottom: 5px !important;
}
.salesBox{
  .title{
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 10px 0;
  }
}
</style>
