<template>
  <div class='attLibrary'>
    <el-table :data="tableData" border>
      <el-table-column prop="date" label="上传日期" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="product" label="所属项目" />
      <el-table-column prop="fileType" label="文件类型" />
      <el-table-column prop="product2" label="所属项目" width="300px" />
      <el-table-column prop="enclosureType" label="附件类型" />
      <el-table-column label="操作">
        <template #default="scope">
          <router-link class="link" :to="detailClick(scope.row)">查看</router-link>
          <router-link class="link" :to="detailClick(scope.row)">编辑</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AttLibaray',
  components: {},
  setup () {
    const tableData = [
      { id: 1, date: '2016-05-02', name: 'xx采购合同', product: '衡山', fileType: '采购合同', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: 'PDF' },
      { id: 1, date: '2016-05-03', name: 'xx中标通知书', product: '衡山', fileType: '中标通知书', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: '图片' },
      { id: 1, date: '2016-05-04', name: 'xx销售合同', product: '衡山', fileType: '销售合同', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: 'PDF' },
      { id: 1, date: '2016-05-05', name: 'xx验收清单', product: '衡山', fileType: '验收清单', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: 'PDF' }
    ]
    interface typeRow{
      id: string
      date: string
      name: string
      product: string
      fileType: string
      product2: string
      enclosureType: string
    }
    /*
     * 查看详情
     * row: 当前行数据
     */
    function detailClick (row: typeRow) {
      return '/project/details?' + row.id
    }

    return {
      tableData, detailClick
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
