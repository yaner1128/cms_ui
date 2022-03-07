<template>
  <div class='purchase'>
    <el-button type="primary" class="addButton" v-show="isEdit" @click="addClick">新增</el-button>
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
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button type="text" size="small" v-show="isEdit" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="upLoadView(scope.row)">附件</el-button>
          <el-popconfirm title="确认删除本条数据吗？">
            <template #reference>
              <el-button type="text" size="small" v-show="isEdit">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="editDialog" :title="curentTitle" width="600px">
      <el-form :model="editForm" class="demo-form-inline" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="editForm.contractName" placeholder="请输入合同名称"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="editForm.amount" placeholder="请输入合同金额"></el-input>
        </el-form-item>
        <el-form-item label="签订日期">
          <el-date-picker v-model="editForm.signDate" type="date" placeholder="请选择合同签订日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.inStatus" placeholder="请选择状态">
            <el-option label="待付款" :value="0"></el-option>
            <el-option label="进行中" :value="1"></el-option>
            <el-option label="已完成" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="buttonList">
          <el-button type="primary" @click="commitEditClick">确认</el-button>
          <el-button type="" @click="editDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="dialogTableVisible" title="附件列表">
      <my-up-load :fileList="fileList" :isEdit="isEdit"></my-up-load>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { getContractsByStatus } from '@/api/details'
import router from '@/router'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import myUpLoad from '@/components/upload.vue'

interface purchaseDataType {
  amount: string;
  contractId: number;
  contractName: string;
  inStatus: number|string;
  signDate: string;
}
export default defineComponent({
  name: 'purchase',
  components: { myUpLoad },
  setup () {
    // 判断是否带参数
    const query = reactive({
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      curentTitle: '新增',
      dialogTableVisible: false,
      editDialog: false,
      addClick: () => {
        query.curentTitle = '新增'
        editForm.value = { amount: '', contractId: 0, contractName: '', inStatus: '', signDate: '' }
        query.editDialog = true
      },
      editClick: (row: purchaseDataType) => {
        editForm.value = row
        query.curentTitle = '编辑'
        query.editDialog = true
      },
      commitEditClick: () => {
        console.log(editForm.value)
        query.editDialog = false
      },
      upLoadView: (row: purchaseDataType) => {
        fileList.value = [{ attachmentName: '1111' }]
        query.dialogTableVisible = true
        console.log(row)
      },
      filterTag: (value: number, row: purchaseDataType) => { // 过滤
        return row.inStatus === value
      }
    })
    const resData = toRefs(query)
    // 编辑表单
    const editForm = ref<purchaseDataType>({ amount: '', contractId: 0, contractName: '', inStatus: '', signDate: '' })
    // 采购合同数据
    const purchaseData = ref<purchaseDataType[]>([])
    const getData = (query: { id: number }) => {
      getContractsByStatus({ inStatus: 0, projectId: query.id }).then(res => {
        purchaseData.value = res.data.records
        purchaseData.value = [{
          amount: '12000',
          contractId: 1,
          contractName: '合同1',
          inStatus: 0,
          signDate: '2022-03-01'
        }]
      })
    }
    const fileList = ref<any[]>([])
    onMounted(() => {
      if (query && query.id) {
        getData(query)
      } else {
        ElMessage.warning('获取失败, 跳转首页 !')
        setTimeout(() => {
          router.push({ path: '/home', replace: true })
        }, 1000)
      }
    })

    return {
      ...resData, purchaseData, fileList, editForm
    }
  }
})
</script>
<style lang="scss" scoped>
/deep/.buttonList .el-form-item__content{
  display: flex;
  justify-content: flex-end;
}
</style>
