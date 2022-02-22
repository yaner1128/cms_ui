<template>
  <div class='detailBox'>
    <div class="generalization">
      <span class="title">{{ projectName }}项目情况概览</span>
      <div class="processBox">
        <el-steps :active="2" align-center>
          <el-step v-for="(step,index) in stepList"
            :key="index"
            :title="step.title"
            description="step.description">
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
    <div class="contract">
      <el-tabs type="border-card">
        <el-tab-pane label="采购合同">
          <el-table :data="purchaseData">
            <el-table-column prop="date" label="日期" sortable
              :filters="DateList"
              :filter-method="filterDate"
            />
            <el-table-column prop="name" label="名称" sortable />
            <el-table-column prop="amount" label="合同金额" />
            <el-table-column prop="status" label="状态"
              :filters="[
                { text: '完成', value: '完成' },
                { text: '进行', value: '进行' },
                { text: '待付款', value: '待付款' },
              ]"
              :filter-method="filterTag">
              <template #default="scope">
                <el-tag v-if="scope.row.status=='完成'" type="success" effect="dark">{{scope.row.status}}</el-tag>
                <el-tag v-else-if="scope.row.status=='待付款'" type="danger" effect="dark">{{scope.row.status}}</el-tag>
                <el-tag v-else type="" effect="dark">{{scope.row.status}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="销售合同">销售合同</el-tab-pane>
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
import { defineComponent, reactive, ref } from 'vue'
import { getDetails, getContractDetails } from '@/api/details'
import router from '@/router'

interface stepListType {
  title: string
  description: string
  desc1?: string
  desc2?: string
}
interface detailListType {
  name: string
  prop: string
}
interface purchaseDataType {
  date: string
  name: string
  amount: string
  status: string
}
interface paymentPlanType {
  date: string
  rate: string
  amount: string
}

// const getData = async (query: any, stepList: stepListType[], detailList: detailListType[], purchaseData: purchaseDataType[], paymentPlan: paymentPlanType[]) => {
//   const res = await getDetails(query)
//   console.log('*********', res)
//   const data = {
//     stepList: [
//       { title: '立项', description: '中标日期: 2022年1月24日\n合同日期: 2022年1月24日', desc1: '中标日期: 2022年1月24日', desc2: '合同日期: 2022年1月24日' },
//       { title: '实施中', description: '第一阶段付款: 2022年1月24日' },
//       { title: '项目验收', description: '进行中' },
//       { title: '项目完成', description: '合同终止日期: 2025年1月24日' }
//     ],
//     purchaseData: [
//       { date: '2016-05-02', name: '服务器采购合同', amount: '250000.00', status: '完成' },
//       { date: '2016-05-03', name: '机房建设合同', amount: '250000.00', status: '完成' },
//       { date: '2016-05-04', name: '机房维护合同', amount: '250000.00', status: '进行' },
//       { date: '2016-05-05', name: '硬件数据恢复合同', amount: '250000.00', status: '待付款' }
//     ],
//     paymentPlan: [
//       { date: '2016-05-02', rate: '30%', amount: '600000.00' },
//       { date: '未付款', rate: '40%', amount: '800000.00' },
//       { date: '未付款', rate: '20%', amount: '400000.00' },
//       { date: '未付款', rate: '10%', amount: '200000.00' }
//     ],
//     detailList: [
//       { name: '项目名称', prop: '衡山县财政数据中心' },
//       { name: '立项日期', prop: '2022年1月24日' },
//       { name: '项目类型', prop: '自营软件项目' },
//       { name: '责任人', prop: '姚竞' },
//       { name: '是否招标项目', prop: '招投标项目' },
//       { name: '中标日期', prop: '2022年1月24日' },
//       { name: '采购金额', prop: '100000.00' },
//       { name: '销售金额', prop: '2000000.00' },
//       { name: '项目产品', prop: '财政数据中心区县基础版' },
//       { name: '是否已验收', prop: '否' }
//     ]
//   }
//   stepList.splice(0, stepList.length, ...data.stepList)
//   purchaseData.splice(0, purchaseData.length, ...data.purchaseData)
//   paymentPlan.splice(0, paymentPlan.length, ...data.paymentPlan)
//   detailList.splice(0, detailList.length, ...data.detailList)
// }

export default defineComponent({
  name: 'Details',
  components: {},
  setup () {
    const projectName = ref('')
    // 地铁图数据
    const stepList: stepListType[] = reactive([])
    // 当前项目详细数据
    const detailList: detailListType[] = reactive([])
    const getData = async (query: any) => {
      const params = Object.assign({}, query)
      await getDetails(params).then(res => {
        projectName.value = res.data[0].data.detailList[0].prop
        stepList.splice(0, stepList.length, ...res.data[0].data.setupList)
        detailList.splice(0, detailList.length, ...res.data[0].data.detailList)
      })
      await getContractDetails(params).then(res => {
        purchaseData.splice(0, purchaseData.length, ...res.data[0].data.purchaseData)
        paymentPlan.splice(0, paymentPlan.length, ...res.data[0].data.paymentPlan)
      })
    }
    // 采购合同数据
    const purchaseData: purchaseDataType[] = reactive([])
    // 付款计划
    const paymentPlan: paymentPlanType[] = reactive([])

    // 判断是否带参数
    const query = router.currentRoute.value.query
    const isEdit = ref(false)
    if (query && query.id) {
      isEdit.value = !!(query.flag && query.flag === 'true')
      getData(query)
    } else {
      router.push('/project')
    }
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
    purchaseData.forEach((item: any) => {
      if (!temp.includes(item.date)) {
        temp.push(item.date)
        DateList.push({ text: item.date, value: item.date })
      }
    })
    const filterTag = (value: string, row: purchaseDataType) => {
      return row.status === value
    }
    const filterDate = (value: string, row: purchaseDataType) => {
      return row.date === value
    }
    return {
      stepList, detailList, purchaseData, paymentPlan, filterTag, filterDate, DateList, projectName, isEdit, commitClick
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
</style>
