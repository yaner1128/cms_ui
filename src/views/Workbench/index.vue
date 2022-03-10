<template>
  <div class='projectList'>
    <div class="headBox">
      <h1>待完成项目列表</h1>
      <div>
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :small="small"
          :disabled="disabled"
          :background="false"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-table class="tableBox" v-loading="loading" :data="tableData" :height="420" border>
      <el-table-column prop="projectId" label="项目ID" />
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status==3" type="success" effect="dark">已完成</el-tag>
          <el-tag v-else-if="scope.row.status==2" type="" effect="dark">进行中</el-tag>
          <el-tag v-else-if="scope.row.status==1" type="danger" effect="dark">待付款</el-tag>
          <el-tag v-else type="info" effect="dark">已废止</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractSignDate" label="项目新建日期" />
      <el-table-column prop="productName" label="产品" />
      <el-table-column prop="remark" label="说明" />
      <el-table-column prop="saleAmount" label="收款额" />
      <el-table-column label="操作">
        <template #default="scope">
          <router-link class="link" :to="detailClick(scope.row,'false')">查看</router-link>
          <router-link v-if="checkPermission(['ADMIN'])"  class="link" :to="detailClick(scope.row,'true')">编辑</router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pictureBox" v-loading="loading2">
      <div class="left">
        <div class="barBox" id="barBoxOne" ref="barBoxOne"></div>
      </div>
      <div class="right">
        <div class="barBox" id="barBoxTwo" ref="barBoxTwo"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import * as echarts from 'echarts'
import Cookies from 'js-cookie'
import { getProjectUndoneList, getAllCollectionPlans, getListUnfinishedProjects } from '@/api/workbench'
import checkPermission from '@/utils/permission'
import { page } from '@/utils/page'

interface typeWorkbench {
  projectId: number
  projectName:string
  status: number
  contractSignDate: string
  productName: string
  remark: string
  saleAmount: string|number
}

export default defineComponent({
  name: 'Workbench',
  components: {},
  setup () {
    const { pageData } = page()
    const user = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : {}
    const data = reactive({
      loading: false, // 表格加载标识
      loading2: false, // 图表加载标识
      handleCurrentChange: (val: number) => {
        pageData.currentPage.value = val
        getData()
      },
      handleSizeChange: (val: number) => {
        pageData.pageSize.value = val
        pageData.currentPage.value = 1
        getData()
      }
    })
    const resData = toRefs(data)
    // 查询当前用户下所有项目
    const tableData = ref<typeWorkbench[]>([])
    const getData = () => {
      data.loading = true
      const queryData = { currentPageIndex: pageData.currentPage.value, pageSize: pageData.pageSize.value }
      getProjectUndoneList(queryData).then(res => {
        tableData.value = res.data.data.records
        pageData.total.value = res.data.data.total
        data.loading = false
      }).catch(error => {
        console.log(error)
        data.loading = false
      })
    }
    getData()
    /*
     * 查看详情
     * row: 当前行数据
     */
    function detailClick (row: typeWorkbench, flag: string) {
      return `/project/details?flag=${flag}&id=${row.projectId}`
    }
    // 饼图
    const barBoxOne = ref<HTMLElement>()
    const barBoxTwo = ref<HTMLElement>()
    // echarts图表配置
    const optionOne = reactive({
      title: {
        text: '我的收款情况',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 10, name: '待收款' },
            { value: 7, name: '已收款' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
    const optionTwo = reactive({
      title: {
        text: '我的项目情况',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 10, name: '未完成' },
            { value: 7, name: '已完成' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
    const init = () => {
      const myChart = echarts.init(barBoxOne.value)
      myChart.setOption(optionOne)
      const myChart2 = echarts.init(barBoxTwo.value)
      myChart2.setOption(optionTwo)
      // 自适应大小
      window.onresize = function () {
        myChart2.resize()
        myChart.resize()
      }
    }
    onMounted(async () => {
      data.loading2 = true
      const promise1 = getAllCollectionPlans()
      const promise2 = getListUnfinishedProjects()
      Promise.all([promise1, promise2]).then((res) => {
        data.loading2 = false
        optionOne.series[0].data = [
          { value: res[0].data.data.unPaid, name: '待收款' },
          { value: res[0].data.data.paidFor, name: '已收款' }
        ]
        optionTwo.series[0].data = [
          { value: res[1].data.data.unfinished, name: '未完成' },
          { value: res[1].data.data.completed, name: '已完成' }
        ]
        init()
      }).catch((error) => {
        console.log(error)
        data.loading2 = false
      })
    })
    return {
      ...resData, tableData, detailClick, barBoxOne, barBoxTwo, checkPermission, ...pageData
    }
  }
})
</script>

<style lang="scss" scoped>
.link{
  text-decoration: none;
  margin: 0 3px;
}
.headBox{
  height: 45px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.tableBox{
  width: 100%;
}
.pictureBox{
  margin-top: 30px;
  height: 350px;
  display: flex;
  border-bottom: 1px solid #eee;
  .left{
    border-right: 1px dotted #ccc;
  }
  .left,.right{
    width: 50%;
    box-sizing: border-box;
    .title{
      font-size: 16px;
      font-weight: 600;
    }
  }
  .barBox{
    min-height: 300px;
  }
}
</style>
