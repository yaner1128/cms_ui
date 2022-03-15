<template>
  <div class='purchase'>
    <el-button type="primary" class="addButton" v-show="isEdit" @click="addClick">新增</el-button>
    <el-table :data="purchaseData">
      <el-table-column prop="signDate" label="合同签订日期" sortable />
      <el-table-column prop="contractName" label="合同名称" sortable />
      <el-table-column prop="amount" label="合同总金额" />
      <el-table-column prop="status" label="状态"
        :filters="[
          { text: '已完成', value: 2 },
          { text: '进行中', value: 1 },
          { text: '待付款', value: 0 },
        ]"
        :filter-method="filterTag">
        <template #default="scope">
          <el-tag v-if="scope.row.status==='2'" type="success" effect="dark">已完成</el-tag>
          <el-tag v-else-if="scope.row.status==='1'" type="" effect="dark">进行中</el-tag>
          <el-tag v-else-if="scope.row.status==='0'" type="danger" effect="dark">待付款</el-tag>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template #default="scope">
          <el-button type="text" size="small" v-show="isEdit" @click="editClick(scope.row)">编辑</el-button>
          <!-- <el-button type="text" size="small" @click="upLoadView(scope.row.basAttachments)">附件</el-button> -->
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
        <el-form-item label="合同编号">
          <el-input v-model="editForm.contractCode" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="editForm.contractName" placeholder="请输入合同名称"></el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="editForm.amount" placeholder="请输入合同金额"></el-input>
        </el-form-item>
        <el-form-item label="签订日期">
          <el-date-picker v-model="editForm.signDate" type="date" placeholder="请选择合同签订日期" @change="changeDate($event)"></el-date-picker>
        </el-form-item>
        <el-form-item label="责任人">
          <el-select v-model="editForm.leaderId" placeholder="请选择状态">
            <el-option v-for="(item,index) in ownerList" :key="index" :label="item.employeeName" :value="item.employeeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option label="待付款" value="0"></el-option>
            <el-option label="进行中" value="1"></el-option>
            <el-option label="已完成" value="2"></el-option>
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
  </div>
</template>

<script lang='ts'>
import router from '@/router'
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import myUpLoad from '@/components/upload.vue'
import { addSale, updateSale } from '@/api/saleApi'
import { getContractsByStatus } from '@/api/details'
import { format } from '@/utils/dateFormat'
import { getUserList } from '@/api/created'

interface purchaseDataType {
  amount: string;
  contractId: number;
  contractName: string;
  status: string;
  signDate: string;
  [propname: string]: any;
}
export default defineComponent({
  name: 'purchase',
  setup () {
    // 判断是否带参数
    const query = reactive({
      isEdit: router.currentRoute.value.query.flag !== 'false',
      id: Number(router.currentRoute.value.query.id),
      curentTitle: '新增',
      editDialog: false,
      file: '', // 附件
      changeDate: (val: any) => {
        editForm.value.signDate = format(new Date(val), 'yyyy-MM-dd')
      },
      addClick: () => {
        query.curentTitle = '新增'
        editForm.value = { amount: '', contractId: 0, contractName: '', status: '', signDate: '' }
        query.editDialog = true
      },
      editClick: (row: purchaseDataType) => {
        console.log(row)
        editForm.value = row
        query.curentTitle = '编辑'
        query.editDialog = true
      },
      commitEditClick: () => {
        query.editDialog = false
        const params = Object.assign({ projectId: query.id, contractType: '0', file: query.file, leaderId: 1 }, editForm.value)
        const fd = new FormData()
        for (var key in params) {
          fd.append(key, params[key])
        }
        console.log(params)
        console.log('file', fd.get('file'))
        if (query.curentTitle === '新增') {
          addSale(fd).then(res => {
            query.file = ''
            if (res.data.code === 200) {
              ElMessage.success('新增成功!')
              getData()
            }
          })
        } else {
          updateSale(fd).then()
        }
      },
      filterTag: (value: string, row: purchaseDataType) => { // 过滤
        return row.status === value
      }
    })
    const resData = toRefs(query)
    // 编辑表单
    const editForm = ref<purchaseDataType>({ amount: '', contractId: 0, contractName: '', status: '', signDate: '' })
    // 采购合同数据
    const purchaseData = ref<purchaseDataType[]>([])
    const getData = () => {
      getContractsByStatus({ projectId: query.id }).then(res => {
        purchaseData.value = res.data.data.records
      })
    }
    const ownerList = ref<any[]>([])
    getUserList().then(res => {
      ownerList.value = res.data.data
    })
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
    // 附件上传
    const handleFileChange = (file: any, fileList: any) => {
      query.file = file.raw
      // detailObj.value.basAttachments = fileList[0].raw
    }
    const handleRemove = (file: any, fileList: any) => {
      console.log(file)
    }

    return {
      ...resData, purchaseData, editForm, ownerList, handleFileChange, handleRemove
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
