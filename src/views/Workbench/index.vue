<template>
  <div class='projectList'>
    <el-table class="tableBox" v-loading="loading" :data="tableData" :height="480" border>
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createDate" label="项目新建日期" />
      <el-table-column prop="product" label="产品" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="amount" label="收款额" />
      <el-table-column label="操作">
        <template #default="scope">
          <router-link class="link" :to="detailClick(scope.row,'false')">查看</router-link>
          <router-link v-if="checkPermission(['ADMIN'])"  class="link" :to="detailClick(scope.row,'true')">编辑</router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pictureBox" v-loading="loading">
      <div class="left">
        <!-- <div class="title">我的收款情况</div> -->
        <div class="barBox" id="barBoxOne" ref="barBoxOne"></div>
      </div>
      <div class="right">
        <!-- <div class="title">我的项目情况</div> -->
        <div class="barBox" id="barBoxTwo" ref="barBoxTwo"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import * as echarts from 'echarts'
import { getWorkList, getPieData } from '@/api/workbench'
import { AxiosResponse } from 'axios'
import $store from '@/store'
import checkPermission from '@/utils/permission'

interface typeWorkbench {
  id:string
  name:string
  status: string
  createDate: string
  product: string
  desc: string
  amount: string
}

export default defineComponent({
  name: 'Workbench',
  components: {},
  setup () {
    const user = $store.state.userInfo
    // 查询当前用户下所有项目
    const loading = ref(false)
    const tableData = ref<typeWorkbench[]>([])
    const getData = () => {
      loading.value = true
      getWorkList({ id: user.id }).then(res => {
        // console.log(res)
        tableData.value = res.data[0].data.data
        loading.value = false
      })
    }
    getData()
    /*
     * 查看详情
     * row: 当前行数据
     */
    function detailClick (row: typeWorkbench, flag: string) {
      return `/project/details?flag=${flag}&id=${row.id}`
    }

    const barBoxOne = ref<HTMLElement>()
    const barBoxTwo = ref<HTMLElement>()
    // echarts图表配置
    const optionOne = reactive({
      title: {
        text: '我的收款情况',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
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
            { value: 700, name: '待收款' },
            { value: 1200, name: '已收款' }
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
        trigger: 'item'
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
            { value: 1048, name: '未完成' },
            { value: 735, name: '已完成' }
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
    const init = (res: AxiosResponse<unknown, unknown>) => {
      console.log('**res****', res)
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
      await getPieData({}).then(res => {
        init(res)
      })
    })
    return {
      loading, tableData, detailClick, barBoxOne, barBoxTwo, checkPermission
    }
  }
})
</script>

<style lang="scss" scoped>
.link{
  text-decoration: none;
  margin: 0 3px;
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
