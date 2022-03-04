<template>
  <div class='projectList'>
    <!-- 查询 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.projectName" clearable placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.inStatus" clearable placeholder="请选择状态">
          <el-option label="已废止" :value="0"></el-option>
          <el-option label="待付款" :value="1"></el-option>
          <el-option label="进行中" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
        v-model="value1"
          type="daterange"
          range-separator="-"
          @change="dateChange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.productName" clearable placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.employeeName" clearable placeholder="请输入责任人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="success" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column prop="inStatus" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.inStatus===3" type="success" effect="dark">已完成</el-tag>
          <el-tag v-else-if="scope.row.inStatus===2" type="" effect="dark">进行中</el-tag>
          <el-tag v-else-if="scope.row.inStatus===1" type="danger" effect="dark">待付款</el-tag>
          <el-tag v-else-if="scope.row.inStatus===0" type="info" effect="dark">已废止</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="项目创建日期" />
      <el-table-column prop="productName" label="产品名称" />
      <el-table-column prop="employeeName" label="责任人" />
      <el-table-column prop="saleAmount" label="收款额" />
      <el-table-column label="操作">
        <template #default="scope">
          <router-link class="link" :to="detailClick(scope.row,'false')">查看</router-link>
          <router-link class="link" v-if="checkPermission(['ADMIN'])" :to="detailClick(scope.row,'true')">编辑</router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { getProjectList } from '@/api/projectList'
import { format } from '@/utils/dateFormat'
import checkPermission from '@/utils/permission'
import { page } from '@/utils/page'

// 筛选条件数据类型
interface queryType {
  projectName: string
  inStatus: number|string
  startTime: string
  endTime: string
  productName: string
  employeeName: string
}
// 表格数据类型
interface rowType{
  projectName: string;
  inStatus: number|string;
  createTime: string;
  productName: string;
  employeeName: string;
  saleAmount: string;
  [propname: string]: any;
}
export default defineComponent({
  name: 'projectList',
  components: {},
  setup () {
    const { pageData, handleSizeChange, handleCurrentChange } = page()
    const data = reactive({
      loading: false, // 表格加载
      value1: '', // 时间
      dateChange: (val: any) => { // 日期范围修改方法
        formInline.value.startTime = format(new Date(val[0]), 'yyyy-MM-dd')
        formInline.value.endTime = format(new Date(val[1]), 'yyyy-MM-dd')
      },
      search: () => { // 搜索查询
        getData(formInline.value)
      },
      reset: () => { // 重置
        formInline.value = { projectName: '', inStatus: '', startTime: '', endTime: '', productName: '', employeeName: '' }
        data.value1 = ''
        getData(formInline.value)
      }
    })
    const resData = toRefs(data)
    // 定义查询表单
    const formInline = ref<queryType>({ projectName: '', inStatus: '', startTime: '', endTime: '', productName: '', employeeName: '' })
    // 定义表格数据
    const tableData = ref<rowType[]>([])
    tableData.value = [{
      id: 100100,
      projectName: 'string',
      inStatus: 1,
      createTime: '2021-02-01',
      productName: 'string',
      employeeName: 'test',
      saleAmount: '1111'
    }]
    // 获取数据
    const getData = async (query: queryType) => {
      data.loading = true
      const queryData = { currentPage: pageData.currentPage.value, pageSize: pageData.pageSize.value }
      const params = Object.assign({}, query)
      await getProjectList(params, queryData).then(res => {
        console.log('*****res*****', res.data)
        tableData.value = res.data.data.records
        pageData.total.value = res.data.data.total
        data.loading = false
      }).catch(error => {
        console.log(error)
        data.loading = false
      })
    }
    getData(formInline.value)
    /*
     * 查看详情
     * row: 当前行数据
     * flag: 是否可编辑标识
     */
    function detailClick (row: rowType, flag: string) {
      console.log(row)
      return `/project/details?flag=${flag}&id=${row.projectId}`
    }

    return {
      ...resData, formInline, tableData, detailClick, checkPermission, ...pageData, handleSizeChange, handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.link{
  text-decoration: none;
  margin: 0 3px;
}
.el-pagination{
  padding-top: 30px;
}
</style>
