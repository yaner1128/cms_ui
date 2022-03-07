<template>
  <div class='sales'>
    <el-form class="salesBox" label-position="right" label-width="100px" :model="salesData" :disabled='!isEdit'>
      <div class="titleBox">
        <span class="title">{{ salesData.contractName|| '销售合同' }}</span>
      </div>
      <el-form-item label="甲方:">
        <el-input v-model="salesData.partyAName"></el-input>
      </el-form-item>
      <el-form-item label="乙方:">
        <el-input v-model="salesData.partyBName"></el-input>
      </el-form-item>
      <el-form-item label="生效日期:">
        <el-input v-model="salesData.signDate"></el-input>
      </el-form-item>
      <el-form-item label="终止日期:">
        <el-input v-model="salesData.endDate"></el-input>
      </el-form-item>
      <el-form-item label="已开票金额:">
        <el-input v-model="salesData.invoicedAmount"></el-input>
      </el-form-item>
      <el-form-item label="已付款金额:">
        <el-input v-model="salesData.paymentAmount"></el-input>
      </el-form-item>
      <el-form-item label="合同总金额:">
        <el-input v-model="salesData.amount"></el-input>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="附件" label-width="100px">
        <el-button type="text" size="small" @click="upLoadList">附件</el-button>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogTableVisible" title="附件列表">
      <my-up-load :fileList="fileList" :isEdit="isEdit"></my-up-load>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { getSalesContract } from '@/api/details'
import router from '@/router'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import myUpLoad from '@/components/upload.vue'

interface salesDataType {
  amount: string
  contractId: number
  contractName: string
  endDate: string
  invoicedAmount: number
  partyAName: string
  partyBName: string
  paymentAmount: string
  signDate: string
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
  name: 'sales',
  components: { myUpLoad },
  setup () {
    // 判断是否带参数
    const query = reactive({
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      dialogTableVisible: false,
      upLoadList: () => {
        fileList.value = [{
          uploadTime: 'string',
          attachmentName: 'string',
          projectName: 'string',
          fileType: 'string',
          attchmentType: 'string'
        }]
        query.dialogTableVisible = true
      }
    })
    const resData = toRefs(query)
    const fileList = ref<fileType[]>([])
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
    // 销售合同数据
    const salesData = ref<salesDataType>({
      amount: '',
      contractId: 0,
      contractName: '',
      endDate: '',
      invoicedAmount: 0,
      partyAName: '',
      partyBName: '',
      paymentAmount: '',
      signDate: ''
    })

    const getData = (id: number) => {
      getSalesContract({ projectId: id }).then(res => {
        salesData.value = res.data.data || salesData.value
      })
    }
    return {
      ...resData, salesData, fileList
    }
  }
})
</script>
<style lang="scss" scoped>
.titleBox{
  display: flex;
  justify-content: space-between;
}
</style>
