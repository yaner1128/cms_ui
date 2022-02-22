<template>
  <div class='projectList'>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createDate" label="项目新建日期" />
      <el-table-column prop="product" label="产品" />
      <el-table-column prop="desc" label="说明" />
      <el-table-column prop="amount" label="收款额" />
      <el-table-column label="操作">
        <template #default="scope">
          <router-link class="link" :to="detailClick(scope.row,'false')">查看</router-link>
          <router-link class="link" :to="detailClick(scope.row,'true')">编辑</router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pictureBox">
      <div class="left">
        <div class="title">我的收款情况</div>
        <div class="barBox" id="barBoxOne"></div>
      </div>
      <div class="right">
        <div class="title">我的项目情况</div>
        <div class="barBox" id="barBoxTwo"></div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref } from 'vue'
import * as echarts from 'echarts'
import { getWorkList } from '@/api/workbench'

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
    // 查询当前用户下所有项目
    const loading = ref(false)
    const tableData: typeWorkbench[] = reactive([])
    const getData = () => {
      loading.value = true
      getWorkList({ id: 'xx' }).then(res => {
        console.log(res)
        tableData.splice(0, tableData.length, ...res.data[0].data.data)
        console.log(tableData)
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

    const optionOne = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 700, name: '代收款' },
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
    }
    const optionTwo = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
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
    }
    let myChart: any
    let myChart2: any
    const init = () => {
      var chartDom = document.getElementById('barBoxOne')
      var chartDom2 = document.getElementById('barBoxTwo')

      if (chartDom) {
        myChart = echarts.init(chartDom)
        myChart.setOption(optionOne)
      }
      if (chartDom2) {
        myChart2 = echarts.init(chartDom2)
        myChart2.setOption(optionTwo)
      }
    }
    onMounted(() => {
      init()

      var chartDom = document.getElementById('barBoxOne')
      var chartDom2 = document.getElementById('barBoxTwo')

      if (chartDom) {
        if (myChart != null && myChart !== '' && myChart !== undefined) {
          myChart.dispose()
        }
        myChart = echarts.init(chartDom)
        myChart.setOption(optionOne)
      }
      if (chartDom2) {
        if (myChart2 != null && myChart2 !== '' && myChart2 !== undefined) {
          myChart2.dispose()
        }
        myChart2 = echarts.init(chartDom2)
        myChart2.setOption(optionTwo)
      }
    })
    return {
      loading, tableData, detailClick
    }
  }
})
</script>

<style lang="scss" scoped>
.link{
  text-decoration: none;
  margin: 0 3px;
}
.pictureBox{
  margin-top: 30px;
  // height: 500px;
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
