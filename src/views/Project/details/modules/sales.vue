<template>
  <div class='sales'>
    <el-form class="salesBox" label-position="right" label-width="100px" :model="salesData" :disabled='!isEdit'>
      <div class="titleBox">
        <span class="title">{{ salesData.contractName|| '销售合同' }}</span>
      </div>
      <el-form-item label="合同编号">
        <el-input v-model="salesData.contractCode" placeholder="请输入合同编号"></el-input>
      </el-form-item>
      <el-form-item label="合同名称">
        <el-input v-model="salesData.contractName" placeholder="请输入合同名称"></el-input>
      </el-form-item>
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
      <el-form-item label="责任人">
        <el-select v-model="salesData.leaderId" placeholder="请选择状态">
          <el-option v-for="(item,index) in ownerList" :key="index" :label="item.employeeName" :value="item.employeeId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="附件" label-width="100px">
        <ul id="fileBox" v-if="file">
          <li>
            <span class="itemFile" @click="exportClick(file.attachUrl)">{{ file.attachmentName || '附件名称'}}</span>
            <!-- <el-button v-show="isEdit" type="text">更新附件</el-button> -->
            <el-upload v-show="isEdit"
              class="upload-demo"
              ref="uploadRef"
              accept="image/*,.pdf"
              :limit="1"
              action=""
              :on-change="handleFileChange"
              :on-remove="handleRemove"
              :auto-upload="false"
              >
              <el-button type="text">更新附件 </el-button>
            </el-upload>
            <el-button v-show="isEdit" type="text" @click="deleteClick(file.attachmentId)">删除</el-button>
          </li>
        </ul>
        <el-upload v-else
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
    </el-form>
    <el-form>
      <el-button type="primary" @click="commitClick('新增')">确认新增</el-button>
      <el-button type="" @click="commitClick('编辑')">确认编辑</el-button>
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
import { ElMessage } from 'element-plus'
import myUpLoad from '@/components/upload.vue'
import store from '@/store'
import { getUserList } from '@/api/created'
import { removeEnclosure } from '@/api/attLibrary'

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
  setup () {
    // 判断是否带参数
    const query = reactive({
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      dialogTableVisible: false,
      file: ref<any>(''), // 附件
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
      },
      commitClick: (val: string) => {
        const params = Object.assign({ projectId: query.id, contractType: '1', file: query.file, leaderId: 1 }, salesData.value)
        const fd = new FormData()
        for (var key in params) {
          fd.append(key, params[key])
        }

        console.log(params)
        console.log(fd.get('file'))
        if (val === '新增') {
          query.file = ''
          addSale(fd).then(res => {
            console.log(res)
            store.commit('changeSale', salesData.value)
          })
        } else {
          updateSale(fd).then(res => {
            console.log(res)
          })
        }
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
    const getData = (id: number) => {
      getSalesContract({ projectId: id }).then(res => {
        salesData.value = res.data.data[0] || salesData.value
        query.file = salesData.value.basAttachments
        store.commit('changeSale', res.data.data)
        localStorage.setItem('saleId', res.data.data[0]?.contractId || '')
      })
    }
    const handleFileChange = (file: any, fileList: any) => {
      salesData.value.file = file.raw
    }
    const handleRemove = (file: any, fileList: any) => {
      // detailObj.value.basAttachments = fileList[0].raw || []
    }
    return {
      ...resData, salesData, fileList, ownerList, handleFileChange, handleRemove
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

function handleEvent() {
  throw new Error('Function not implemented.')
}

function handleEvent() {
  throw new Error('Function not implemented.')
}
