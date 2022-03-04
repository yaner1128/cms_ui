<template>
  <div class='detailBox'>
    <div class="generalization" v-loading="loading">
      <span class="title">{{ projectName }}项目情况概览</span>
      <div class="processBox">
        <el-steps :active="active" align-center>
          <el-step v-for="step in stepList"
            :key="step.id"
            :title="step.title"
            :description="step.description">
            <template #description>
              <span v-if="step.desc1">{{ step.desc1 }}<br/>{{ step.desc2 }}</span>
              <span v-else>{{ step.description }}</span>
            </template>
          </el-step>
        </el-steps>
      </div>
      <div class="detailContent" v-if="detailList.length>0">
        <ul>
          <li v-for="(detail,index) in detailList"
            :key="index"
          >
            <span>{{detail.name}}</span>：<el-input v-model="detail.prop" :disabled="!isEdit"></el-input>
          </li>
        </ul>
      </div>
    </div>
    <div class="contract" v-loading="loading2">
      <el-tabs type="border-card">
        <el-tab-pane label="采购合同">
          <el-table :data="purchaseData">
            <el-table-column prop="signDate" label="合同签订日期" sortable />
            <el-table-column prop="contractName" label="合同名称" sortable />
            <el-table-column prop="amount" label="合同总金额" />
            <el-table-column prop="inStatus" label="状态"
              :filters="[
                { text: '已完成', value: 2 },
                { text: '进行中', value: 1 },
                { text: '待付款', value: 0 },
              ]"
              :filter-method="filterTag">
              <template #default="scope">
                <el-tag v-if="scope.row.status===2" type="success" effect="dark">已完成</el-tag>
                <el-tag v-else-if="scope.row.status===1" type="" effect="dark">进行中</el-tag>
                <el-tag v-else-if="scope.row.status===0" type="danger" effect="dark">待付款</el-tag>
                <span v-else></span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="销售合同">
          <el-form class="salesBox" label-position="right" label-width="100px" :model="salesData" disabled>
            <div class="title">{{ salesData.contractName|| '销售合同' }}</div>
            <el-form-item label="甲方:">
              <el-input v-model="salesData.partyAName"></el-input>
            </el-form-item>
            <el-form-item label="乙方:">
              <el-input v-model="salesData.partyBName"></el-input>
            </el-form-item>
            <el-form-item label="生效日期:">
              <el-input v-model="salesData.signDate"></el-input>
            </el-form-item>
            <el-form-item label="终止日期:">
              <el-input v-model="salesData.endDate"></el-input>
            </el-form-item>
            <el-form-item label="已开票金额:">
              <el-input v-model="salesData.invoicedAmount"></el-input>
            </el-form-item>
            <el-form-item label="已付款金额:">
              <el-input v-model="salesData.paymentAmount"></el-input>
            </el-form-item>
            <el-form-item label="合同总金额:">
              <el-input v-model="salesData.amount"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="付款计划">
          <div class="title">合同付款计划</div>
          <el-table :data="paymentPlan" border >
            <el-table-column prop="date" label="付款日期" />
            <el-table-column prop="rate" label="付款比例"  />
            <el-table-column prop="amount" label="金额" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-affix v-if="isEdit" position="bottom" :offset="10" style="text-align:center">
      <el-button type="primary" @click="commitClick">确认</el-button>
    </el-affix>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, nextTick, reactive, toRefs } from 'vue'
import { getContractsByStatus, getSalesContract, getSelectContractId, getDetails } from '@/api/details'
import router from '@/router'
import { ElMessage } from 'element-plus'

interface stepListType {
  title: string
  description: string
  desc1?: string
  desc2?: string
  id: string
}
interface detailListType {
  name: string
  prop: string
}
interface purchaseDataType {
  amount: string;
  contractId: number;
  contractName: string;
  inStatus: number;
  signDate: string;
}
interface salesDataType {
  amount: string
  contractId: number
  contractName: string
  endDate: string
  invoicedAmount: number
  partyAName: string
  partyBName: string
  paymentAmount: string
  signDate: string
}
interface paymentPlanType {
  date: string
  rate: string
  amount: string
}

export default defineComponent({
  name: 'Details',
  components: {},
  setup () {
    const data = reactive({
      loading: false, // 加载标识
      loading2: false,
      projectName: '', // 当前项目名称
      active: 0, // 步骤条进度
      getPurchaseData: async (id: number) => { // 采购合同
        const query = { inStatus: 0, projectId: id }
        await getContractsByStatus(query).then(res => {
          purchaseData.value = res.data.records
        })
      },
      getSalesData: async (id: number) => { // 销售合同
        await getSalesContract({ projectId: id }).then(res => {
          salesData.value = res.data.data || salesData.value
        })
      },
      getPlanData: (id: number) => {
        getSelectContractId({ projectId: id }).then(res => {
          paymentPlan.value = res.data.data
        })
      }
    })
    const resData = toRefs(data)

    // 当前项目详细数据
    const detailList = ref<detailListType[]>([])
    // 步骤条数据
    const stepList = ref<stepListType[]>([])
    // 采购合同数据
    const purchaseData = ref<purchaseDataType[]>([])
    // 销售合同数据
    const salesData = ref<salesDataType>({
      amount: '',
      contractId: 0,
      contractName: '衡山县财政数据中心合同',
      endDate: '',
      invoicedAmount: 0,
      partyAName: '',
      partyBName: '',
      paymentAmount: '',
      signDate: ''
    })
    // 付款计划
    const paymentPlan = ref<paymentPlanType[]>([])
    // 调用接口获取数据
    const getData = (query: any) => {
      data.loading = true
      // data.loading2 = true
      const params = Object.assign({}, query)
      console.log('*****getDetails******', params)
      getDetails(params).then(res => {
        data.loading = false
        console.log('*******', res)
        // data.projectName = res.data[0].data.detailList[0].prop
        // stepList.value = res.data[0].data.setupList
        // detailList.value = res.data[0].data.detailList
        // nextTick(() => {
        //   data.active = res.data[0].data.active
        // })
      })
      // 采购合同数据
      data.getPurchaseData(query.id)
      // 销售合同数据
      data.getSalesData(query.id)
      // 付款计划
      data.getPlanData(query.id)
    }
    // 判断是否带参数
    const query = {
      flag: router.currentRoute.value.query.flag,
      id: Number(router.currentRoute.value.query.id)
    }
    const isEdit = ref(false)
    onMounted(() => {
      if (query && query.id) {
        isEdit.value = !!(query.flag && query.flag === 'true')
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
      console.log(detailList)
    }
    /*
     *  筛选方法
    */
    const DateList: unknown[] = []
    const temp: unknown[] = []
    purchaseData.value.forEach((item: any) => {
      if (!temp.includes(item.date)) {
        temp.push(item.date)
        DateList.push({ text: item.date, value: item.date })
      }
    })
    const filterTag = (value: number, row: purchaseDataType) => {
      return row.inStatus === value
    }
    return {
      ...resData, stepList, detailList, purchaseData, salesData, paymentPlan, filterTag, DateList, isEdit, commitClick
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
/deep/ .el-button {
  width: 100px;
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
      width: 88%;
      span{
        width: 80px;
      }
      li{
        display: flex;
        align-items: center;
        height: 35px;
        width: 35%;
        font-size: 13px;
        // font-weight: 600;
        padding: 5px 0;
      }
    }
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
