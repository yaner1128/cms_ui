<template>
  <div class='sales'>
    <el-form class="salesBox" ref="formRef" label-position="right" label-width="100px" :rules="rules" :inline-message="true" :model="salesData" :disabled='!isEdit'>
      <div class="titleBox">
        <span class="title">{{ salesData.contractName|| '' }}</span>
      </div>
      <el-form-item label="合同编号" prop="contractCode">
        <el-input v-model="salesData.contractCode" placeholder="请输入合同编号"></el-input>
      </el-form-item>
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="salesData.contractName" placeholder="请输入合同名称"></el-input>
      </el-form-item>
      <el-form-item label="甲方:">
        <el-input v-model="salesData.partyAName"></el-input>
      </el-form-item>
      <el-form-item label="乙方:">
        <el-input v-model="salesData.partyBName"></el-input>
      </el-form-item>
      <el-form-item label="生效日期:" prop="signDate">
        <el-date-picker v-model="salesData.signDate" type="date" placeholder="请选择生效日期" @change="dateChange($event,'signDate')"></el-date-picker>
      </el-form-item>
      <el-form-item label="终止日期:">
        <el-date-picker v-model="salesData.endDate" type="date" placeholder="请选择终止日期" @change="dateChange($event,'endDate')"></el-date-picker>
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
      <el-form-item label="责任人" prop="leaderId">
        <el-select v-model="salesData.leaderId" placeholder="请选择状态">
          <el-option v-for="(item,index) in ownerList" :key="index" :label="item.employeeName" :value="item.employeeId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="附件" label-width="100px">
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
    </el-form>
    <el-form v-show="isEdit">
      <el-button type="primary" v-if="!isSale" @click="commitClick('新增')">确认新增</el-button>
      <el-button type="primary" v-else @click="commitClick('编辑')">确认编辑</el-button>
    </el-form>
    <el-dialog v-model="dialogTableVisible" title="附件列表">
      <my-up-load :fileList="fileList" :isEdit="isEdit"></my-up-load>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { getSalesContract } from '@/api/details'
import { addSale, updateSale } from '@/api/saleApi'
import router from '@/router'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import myUpLoad from '@/components/upload.vue'
import store from '@/store'
import { getUserList } from '@/api/created'
import { removeEnclosure } from '@/api/attLibrary'
import { format } from '@/utils/dateFormat'
import handleFd from '@/utils/formData'

const rules = reactive({
  contractCode: [{ required: true, message: '请输入合同编码', trigger: 'blur' }],
  contractName: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
  signDate: [{ required: true, message: '请选择所售产品', trigger: 'change' }],
  leaderId: [{ required: true, message: '请选择责任人', trigger: 'change' }]
})

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
  [propname: string]: any
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
  computed: {
    isSale: () => {
      return store.state.isSale
    }
  },
  setup () {
    // 判断是否带参数
    const query = reactive({
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      dialogTableVisible: false,
      fileList: ref<any[]>([]),
      dateChange: (val: any, code: string) => {
        salesData.value[code] = format(new Date(val), 'yyyy-MM-dd')
      },
      exportClick: (attachUrl: string) => {
        const url = `/file/downloadFile?savePath=${attachUrl}`
        const iframe = document.createElement('iframe')
        iframe.src = url
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      },
      deleteClick: (attachmentId: number) => {
        removeEnclosure(attachmentId).then((res: any) => {
          if (res.data.code === 200) {
            ElMessage.warning('附件删除成功 !')
          }
        })
      }
    })
    const resData = toRefs(query)
    const formRef = ref()
    const commitClick = (val: string) => {
      formRef.value.validate((valid:boolean) => {
        if (valid) {
          const params = Object.assign({
            projectId: query.id,
            contractType: '1'
          }, salesData.value)
          if (val === '新增') {
            addSale(handleFd(params)).then(res => {
              getData()
              store.commit('changeSale', salesData.value)
            })
          } else {
            updateSale(handleFd(params)).then(res => {
              getData()
            })
          }
        }
      })
    }
    const fileList = ref<fileType[]>([])
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
    // 销售合同数据
    const salesData = ref<salesDataType>({
      contractName: '',
      contractCode: '',
      amount: '',
      contractId: 0,
      endDate: '',
      invoicedAmount: 0,
      partyAName: '',
      partyBName: '',
      paymentAmount: '',
      signDate: ''
    })
    const ownerList = ref<any[]>([])
    getUserList().then(res => {
      ownerList.value = res.data.data
    })
    const getData = () => {
      getSalesContract({ projectId: query.id }).then(res => {
        salesData.value = res.data.data[0] || salesData.value
        query.fileList = salesData.value.basAttachments
        store.commit('changeSale', res.data.data)
        localStorage.setItem('saleId', res.data.data[0]?.contractId || '')
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
      salesData.value.file = templist.value
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
      rules, ...resData, salesData, fileList, ownerList, formRef, commitClick, handleFileChange, beforeRemove
    }
  }
})
</script>
<style lang="scss" scoped>
.titleBox{
  display: flex;
  justify-content: space-between;
}
#fileBox{
  li{
    display: flex;
  }
  .itemFile{
    cursor: pointer;
    color: rgb(64, 158, 255);
  }
  .upload-demo{
    margin: 0 10px;
  }
}
</style>
