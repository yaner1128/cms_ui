<template>
  <div class='projectList'>
    <!-- 查询 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.status" placeholder="请选择状态">
          <el-option label="已完成" value="已完成"></el-option>
          <el-option label="待付款" value="待付款"></el-option>
          <el-option label="已废止" value="已废止"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker  v-model="formInline.startDate"
          type="daterange"
          range-separator="-"
          @change="dateChange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.product" placeholder="请输入产品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.owner" placeholder="请输入责任人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="success">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status=='已完成'" type="success" effect="dark">{{scope.row.status}}</el-tag>
          <el-tag v-else-if="scope.row.status=='已废止'" type="danger" effect="dark">{{scope.row.status}}</el-tag>
          <el-tag v-else type="" effect="dark">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="项目新建日期" />
      <el-table-column prop="product" label="产品" />
      <el-table-column prop="owner" label="责任人" />
      <el-table-column prop="amount" label="收款额" />
      <el-table-column label="操作">
        <template #default="scope">
          <router-link class="link" :to="detailClick(scope.row,'false')">查看</router-link>
          <router-link class="link" :to="detailClick(scope.row,'true')">编辑</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue'
import { getProjectList } from '@/api/projectList'

// 筛选条件数据类型
interface queryType {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
  product: string
  owner: string
}
// 表格数据类型
interface rowType{
  id: string
  name: string
  status: string
  createDate: string
  product: string
  owner: string
  amount: string
}
const loading = ref(false)
export default defineComponent({
  name: 'projectList',
  components: {},
  setup () {
    // 筛选表单对象
    const formInline = ref({
      id: '',
      name: '',
      status: '',
      startDate: '',
      endDate: '',
      product: '',
      owner: ''
    })
    // 定义表格数据
    const tableData: rowType[] = reactive([])
    // 日期范围修改方法
    const dateChange = (val: any) => {
      // formInline.startDate = val[0]
      // formInline.endDate = val[1]
    }
    const getData = async (query: queryType, tableData: rowType[]) => {
      loading.value = true
      const params = Object.assign({}, query)
      await getProjectList(params).then(res => {
        console.log('**********', res)
        // tableData = res.data[0].data.data
        tableData.splice(0, tableData.length, ...res.data[0].data.data)
        loading.value = false
      })
    }
    const search = () => {
      getData(formInline.value, tableData)
    }
    getData(formInline.value, tableData)
    /*
     * 查看详情
     * row: 当前行数据
     */
    function detailClick (row: rowType, flag: string) {
      return `/project/details?flag=${flag}&id=${row.id}`
    }

    return {
      formInline, dateChange, loading, tableData, search, detailClick
    }
  }
})
</script>

<style lang="scss" scoped>
.link{
  text-decoration: none;
  margin: 0 3px;
}
</style>
