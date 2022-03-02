<template>
  <div class='projectList'>
    <!-- 查询 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.projectName" clearable placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.status" clearable placeholder="请选择状态">
          <el-option label="已完成" value="已完成"></el-option>
          <el-option label="待付款" value="待付款"></el-option>
          <el-option label="已废止" value="已废止"></el-option>
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
        <el-input v-model="formInline.product" clearable placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.owner" clearable placeholder="请输入责任人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="success" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column prop="isPaied" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.isPaied=='2'" type="success" effect="dark">已完成</el-tag>
          <el-tag v-else-if="scope.row.status=='0'" type="danger" effect="dark">待付款</el-tag>
          <el-tag v-else-if="scope.row.status=='1'" type="" effect="dark">进行中</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="项目新建日期" />
      <el-table-column prop="productName" label="产品" />
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
import { defineComponent, ref } from 'vue'
import { getProjectList } from '@/api/projectList'
import { format } from '@/utils/dateFormat'
import checkPermission from '@/utils/permission'
import { page } from '@/utils/page'

// 筛选条件数据类型
interface queryType {
  projectName: string
  status: string
  startDate: string
  endDate: string
  product: string
  owner: string
}
// 表格数据类型
interface rowType{
  projectName: string;
  isPaied: string;
  createTime: string;
  productName: string;
  employeeName: string;
  saleAmount: string;
  [propname: string]: any;
}
const loading = ref(false)
export default defineComponent({
  name: 'projectList',
  components: {},
  setup () {
    const { pageData, handleSizeChange, handleCurrentChange } = page()
    // 时间
    const value1 = ref('')
    // 定义查询表单
    const formInline = ref<queryType>({ projectName: '', status: '', startDate: '', endDate: '', product: '', owner: '' })
    // 定义表格数据
    const tableData = ref<rowType[]>([])
    // 日期范围修改方法
    const dateChange = (val: string) => {
      formInline.value.startDate = format(new Date(val[0]), 'yyyy-MM-dd')
      formInline.value.endDate = format(new Date(val[1]), 'yyyy-MM-dd')
    }
    // 获取数据
    const getData = async (query: queryType) => {
      loading.value = true
      const params = Object.assign({ currentPage: pageData.currentPage.value, pageSize: pageData.pageSize.value }, query)
      await getProjectList(params).then(res => {
        tableData.value = res.data.data.records
        pageData.total = res.data.data.total
        loading.value = false
      })
    }
    getData(formInline.value)
    // 搜索查询
    const search = () => {
      getData(formInline.value)
    }
    // 重置
    const reset = () => {
      formInline.value = { projectName: '', status: '', startDate: '', endDate: '', product: '', owner: '' }
      value1.value = ''
      getData(formInline.value)
    }
    /*
     * 查看详情
     * row: 当前行数据
     * flag: 是否可编辑标识
     */
    function detailClick (row: rowType, flag: string) {
      return `/project/details?flag=${flag}&id=${row.id}`
    }

    return {
      formInline, dateChange, loading, tableData, search, reset, detailClick, value1, checkPermission, ...pageData, handleSizeChange, handleCurrentChange
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
