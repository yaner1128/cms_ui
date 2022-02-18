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
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
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
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'projectList',
  components: {},
  setup () {
    const formInline = reactive({
      name: '',
      status: '',
      startDate: '',
      endDate: '',
      product: '',
      owner: ''
    })
    const dateChange = (val: any) => {
      console.log(val)
    }
    const search = () => {
      console.log(formInline)
    }

    // const tableData = ref([])
    const tableData = [
      { id: 1, name: '岳阳市财政数据中心', status: '已完成', createDate: '2022年1月24日', product: '', owner: '姚竞', amount: '10604.1' },
      { id: 2, name: '临湘市财政数据中心', status: '待付款', createDate: '2022年1月24日', product: '', owner: '何晋华', amount: '20000.00' },
      { id: 3, name: '郴州市云核算', status: '待付款', createDate: '2022年1月24日', product: '', owner: '曾武本', amount: '20030.01' },
      { id: 4, name: '衡山县财政数据中心', status: '已废止', createDate: '2022年1月24日', product: '', owner: '姚竞', amount: '20063.01' }
    ]

    interface rowType{
      id: string
      name: string
      status: string
      createDate: string
      product: string
      owner: string
      amount: string
    }
    /*
     * 查看详情
     * row: 当前行数据
     */
    function detailClick (row: rowType, flag: string) {
      return `/project/details?flag=${flag}&id=${row.id}`
    }

    return {
      formInline, tableData, dateChange, search, detailClick
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
