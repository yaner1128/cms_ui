<template>
  <div class="paymentPlan">
    <el-button type="primary" class="addButton" v-show="isEdit" @click="addClick">新增</el-button>
    <el-table :data="paymentPlan" border >
      <el-table-column prop="paymentDate" label="付款日期" />
      <el-table-column prop="paymentRatio" label="付款比例(%)"  />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="isPaied" label="是否已付款" />
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
        <el-form-item label="付款日期">
          <el-date-picker v-model="value1" type="date" placeholder="请选择付款日期" @change="changeVal($event)"></el-date-picker>
        </el-form-item>
        <el-form-item label="付款比例(%)">
          <el-input-number v-model="editForm.paymentRatio" :precision="2" :step="1" :max="100" />
        </el-form-item>
        <el-form-item label="付款额">
          <el-input-number v-model="editForm.amount" :precision="2" :step="1" />
        </el-form-item>
        <el-form-item label="是否已付款">
          <el-select placeholder="请选择是否付款" v-model="editForm.isPaied">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            ref="uploadRef"
            accept="image/*,.pdf"
            :limit="1"
            action=""
            :on-change="handleFileChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            >
            <el-button type="text">上传附件</el-button>
          </el-upload>
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
import { AddPaymentPlan, modifyPaymentPlan, deletePaymentPlan } from '@/api/planData'
import router from '@/router'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import myUpLoad from '@/components/upload.vue'
import { format } from '@/utils/dateFormat'

interface paymentPlanType {
  paymentDate: string
  paymentRatio: number;
  amount: number;
  isPaied: string;
  [propname: string]: any;
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
      value1: '',
      file: ref<any>(''),
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      editDialog: false,
      dialogTableVisible: false,
      curentTitle: '新增',
      changeVal: (val: any) => {
        editForm.value.paymentDate = format(new Date(val), 'yyyy-MM-dd')
      },
      addClick: () => {
        query.curentTitle = '新增'
        editForm.value = { paymentDate: '', paymentRatio: 0, amount: 0, isPaied: '' }
        query.value1 = ''
        query.editDialog = true
      },
      editClick: (row: paymentPlanType) => {
        editForm.value = JSON.parse(JSON.stringify(row))
        query.curentTitle = '编辑'
        query.editDialog = true
      },
      upLoadView: (row: any) => {
        fileList.value = [{ attachmentName: '1111' }]
        query.dialogTableVisible = true
        console.log(row)
      },
      commitEditClick: () => {
        query.editDialog = false

        const params = Object.assign({ contractId: localStorage.getItem('saleId'), projectId: query.id, file: query.file, leaderId: 1 }, editForm.value)
        const fd = new FormData()
        for (var key in params) {
          fd.append(key, params[key])
        }
        console.log(params)
        console.log('file', fd.get('file'))
        if (query.curentTitle === '新增') {
          AddPaymentPlan(fd).then(res => {
            console.log(res)
            getData()
          })
        } else {
          console.log(editForm.value)
          editForm.value.paymentRatio = Number(editForm.value.paymentRatio)
          modifyPaymentPlan(editForm.value).then(res => {
            console.log(res)
          })
        }
      }
    })
    const resData = toRefs(query)
    const editForm = ref<paymentPlanType>({ paymentDate: '', paymentRatio: 0, amount: 0, isPaied: '' })
    const fileList = ref<any>([])

    onMounted(() => {
      if (query && query.id) {
        getData()
      } else {
        ElMessage.warning('获取失败, 跳转首页 !')
        setTimeout(() => {
          router.push({ path: '/home', replace: true })
        }, 1000)
      }
    })
    // 付款计划
    const paymentPlan = ref<paymentPlanType[]>([])

    const getData = () => {
      getSelectContractId({ projectId: query.id }).then(res => {
        paymentPlan.value = res.data.data
      })
    }
    // 附件上传
    const handleFileChange = (file: any, fileList: any) => {
      query.file = file.raw
      // detailObj.value.basAttachments = fileList[0].raw
    }
    const handleRemove = (file: any, fileList: any) => {
      console.log(file)
    }
    return {
      ...resData, paymentPlan, editForm, fileList, handleFileChange, handleRemove
    }
  }
})
</script>
<style lang="scss" scoped>
/deep/ .el-input-number{
  width: 240px;
}
</style>
