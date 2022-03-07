<template>
  <div class="paymentPlan">
    <el-button type="primary" class="addButton" v-show="isEdit" @click="addClick">新增</el-button>
    <el-table :data="paymentPlan" border >
      <el-table-column prop="paymentDate" label="付款日期" />
      <el-table-column prop="paymentRatio" label="付款比例(%)"  />
      <el-table-column prop="amount" label="金额" />
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
      <el-form :model="editForm" class="demo-form-inline" label-width="100px">
        <el-form-item label="名称">
          <el-date-picker v-model="editForm.paymentDate" type="date" placeholder="请选择付款日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="付款比例(%)">
          <el-input v-model="editForm.paymentRatio" placeholder="请输入付款比例"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="editForm.amount" placeholder="请输入付款金额"></el-input>
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
import { getSelectContractId } from '@/api/details'
import router from '@/router'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import myUpLoad from '@/components/upload.vue'

interface paymentPlanType {
  paymentDate: string
  paymentRatio: number|string;
  amount: number|string;
}
interface fileType {
  uploadTime: string;
  attachmentName: string;
  projectName: string;
  fileType: string;
  attchmentType: string;
  [propname: string]: any;
}
export default defineComponent({
  name: 'paymentPlan',
  components: { myUpLoad },
  setup () {
    // 判断是否带参数
    const query = reactive({
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      editDialog: false,
      dialogTableVisible: false,
      curentTitle: '新增',
      addClick: () => {
        query.curentTitle = '新增'
        editForm.value = { paymentDate: '', paymentRatio: 0, amount: '' }
        query.editDialog = true
      },
      editClick: (row: paymentPlanType) => {
        editForm.value = row
        query.curentTitle = '编辑'
        query.editDialog = true
      },
      upLoadView: (row: any) => {
        fileList.value = [{ attachmentName: '1111' }]
        query.dialogTableVisible = true
        console.log(row)
      },
      commitEditClick: () => {
        console.log(editForm.value)
        query.editDialog = false
      }
    })
    const resData = toRefs(query)
    const editForm = ref<paymentPlanType>({ paymentDate: '2022-03-01', paymentRatio: 20, amount: 120000 })
    const fileList = ref<any>([])

    onMounted(() => {
      if (query && query.id) {
        getData(query.id)
      } else {
        ElMessage.warning('获取失败, 跳转首页 !')
        setTimeout(() => {
          router.push({ path: '/home', replace: true })
        }, 1000)
      }
    })
    // 付款计划
    const paymentPlan = ref<paymentPlanType[]>([])

    const getData = (id: number) => {
      getSelectContractId({ projectId: id }).then(res => {
        paymentPlan.value = res.data.data
        paymentPlan.value = [{
          paymentDate: '2021-12-01',
          paymentRatio: 20,
          amount: 120000.00
        }]
      })
    }
    return {
      ...resData, paymentPlan, editForm, fileList
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
