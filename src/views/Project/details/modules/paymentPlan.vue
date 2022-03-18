<template>
  <div class="paymentPlan">
    <el-button type="primary" class="addButton" v-show="isEdit" @click="addClick">新增</el-button>
    <el-table :data="paymentPlan" border >
      <el-table-column prop="paymentDate" label="付款日期" />
      <el-table-column prop="paymentRatio" label="付款比例(%)"  />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="isPaied" label="是否已付款" />
      <el-table-column prop="operator" label="财务经办人" />
      <el-table-column prop="amount" label="附件">
        <template #default="scope">
          <!-- <span class="fileItem" @click="exportClick(scope.row.basAttachments[0].attachUrl)">{{ scope.row.basAttachments[0]?.attachmentName }}</span> -->
          <ul>
            <li class="fileItem" v-for="item in scope.row.basAttachments" :key="item">
              <span class="fileItem" @click="exportClick(item.attachUrl)">{{ item.attachmentName }}</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" v-if="isEdit">
        <template #default="scope">
          <el-button type="text" size="small" v-show="isEdit" @click="editClick(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除本条数据吗？" @confirm="deleteClick(scope.row.paymentPlanId)">
            <template #reference>
              <el-button type="text" size="small" v-show="isEdit">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="editDialog" :title="curentTitle" width="600px">
      <el-form :model="editForm" :rules="rules" class="demo-form-inline" label-width="110px">
        <el-form-item label="付款日期" prop="paymentDate">
          <el-date-picker v-model="editForm.paymentDate" type="date" placeholder="请选择付款日期" @change="changeVal($event)"></el-date-picker>
        </el-form-item>
        <el-form-item label="付款比例(%)" prop="paymentRatio">
          <el-input-number v-model="editForm.paymentRatio" :precision="2" :step="1" :max="100" />
        </el-form-item>
        <el-form-item label="付款额" prop="amount">
          <el-input-number v-model="editForm.amount" :precision="2" :step="1" />
        </el-form-item>
        <el-form-item label="是否已付款" prop="isPaied">
          <el-select placeholder="请选择是否付款" v-model="editForm.isPaied">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="财务经办人" prop="operator">
          <el-input v-model="editForm.operator" placeholder="请输入财务经办人姓名"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            ref="uploadRef"
            accept="image/*,.pdf"
            action=""
            :file-list="fileList"
            :on-change="handleFileChange"
            :before-remove="beforeRemove"
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
  </div>
</template>

<script lang='ts'>
import { getSelectContractId } from '@/api/details'
import { AddPaymentPlan, modifyPaymentPlan, deletePaymentPlan } from '@/api/planData'
import router from '@/router'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { format } from '@/utils/dateFormat'
import handleFd from '@/utils/formData'
import store from '@/store'
import { removeEnclosure } from '@/api/attLibrary'

const rules = reactive({
  paymentDate: [{ required: true, message: '请选择付款日期', trigger: 'change' }],
  paymentRatio: [{ required: true, message: '请输入付款比例', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入付款金额', trigger: 'blur' }],
  isPaied: [{ required: true, message: '请选择付款状态', trigger: 'change' }]
})
interface paymentPlanType {
  paymentDate: string
  paymentRatio: number;
  amount: number;
  isPaied: string;
  [propname: string]: any;
}
export default defineComponent({
  name: 'paymentPlan',
  setup () {
    const editForm = ref<paymentPlanType>({ paymentDate: '', paymentRatio: 0, amount: 0, isPaied: '' })
    // 付款计划
    const paymentPlan = ref<paymentPlanType[]>([])
    // 判断是否带参数
    const query = reactive({
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      fileList: ref<any[]>([]),
      editDialog: false,
      curentTitle: '新增',
      exportClick: (attachUrl: string) => {
        const url = `/file/downloadFile?savePath=${attachUrl}`
        const iframe = document.createElement('iframe')
        iframe.src = url
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      },
      changeVal: (val: any) => {
        editForm.value.paymentDate = format(new Date(val), 'yyyy-MM-dd')
      },
      addClick: () => {
        query.curentTitle = '新增'
        editForm.value = { paymentDate: '', paymentRatio: 0, amount: 0, isPaied: '' }
        query.editDialog = true
      },
      editClick: (row: paymentPlanType) => {
        query.fileList = []
        editForm.value = JSON.parse(JSON.stringify(row))
        delete editForm.value.basAttachments
        row.basAttachments.forEach((item: { attachmentName: string; attachUrl: string; attachmentId: number }) => {
          query.fileList.push({
            name: item.attachmentName,
            url: item.attachUrl,
            attachmentId: item.attachmentId
          })
        })
        query.curentTitle = '编辑'
        query.editDialog = true
      },
      deleteClick: (paymentPlanId: number) => {
        deletePaymentPlan(paymentPlanId).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('删除成功!')
            getData()
          }
        })
      },
      commitEditClick: () => {
        query.editDialog = false
        const params = Object.assign({
          contractId: localStorage.getItem('saleId'),
          projectId: query.id
        }, editForm.value)
        if (query.curentTitle === '新增') {
          AddPaymentPlan(handleFd(params)).then(res => {
            if (res.data.code === 200) {
              ElMessage.success('新增付款计划成功')
              getData()
            }
          })
        } else {
          modifyPaymentPlan(handleFd(params)).then(res => {
            if (res.data.code === 200) {
              ElMessage.success('编辑付款计划成功')
              getData()
            }
          })
        }
      }
    })
    const resData = toRefs(query)

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
    const getData = () => {
      getSelectContractId({ projectId: query.id }).then(res => {
        paymentPlan.value = res.data.data
      })
    }
    // 附件上传
    const handleFileChange = (file: any, fileList: any) => {
      const templist = ref<any[]>([])
      fileList.forEach((item: { raw: any }) => {
        if (item.raw) {
          templist.value.push(item.raw)
        }
      })
      editForm.value.file = templist
    }
    const beforeRemove = (file: any, fileList: any) => {
      ElMessageBox.confirm('确认删除该附件吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeEnclosure(file.attachmentId).then(res => {
          if (res.data.code === 200) {
            ElMessage.success('删除附件成功!')
          }
        })
      }).catch(() => {
        fileList.push(file)
      })
    }
    return {
      rules, ...resData, paymentPlan, editForm, handleFileChange, beforeRemove
    }
  }
})
</script>
<style lang="scss" scoped>
/deep/ .el-input-number{
  width: 240px;
}
.fileItem{
  cursor: pointer;
  color: rgb(64, 158, 255);
}
</style>
