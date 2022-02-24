/* eslint-disable handle-callback-err */
/* eslint-disable handle-callback-err */
<template>
  <div class='attLibrary'>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-date-picker
        v-model="value1"
          type="daterange"
          range-separator="-"
          @change="dateChange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.name" clearable placeholder="请输入附件名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.product" clearable placeholder="请输入项目"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.fileType" clearable placeholder="请选择文件类型">
          <el-option label="采购合同" value="采购合同"></el-option>
          <el-option label="销售合同" value="销售合同"></el-option>
          <el-option label="中标通知书" value="中标通知书"></el-option>
          <el-option label="验收清单" value="验收清单"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.type" clearable placeholder="请选择附件类型">
          <el-option label="PDF" value="PDF"></el-option>
          <el-option label="图片" value="图片"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="success" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" max-height="800" border>
      <el-table-column prop="date" label="上传日期" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="product" label="所属项目" />
      <el-table-column prop="fileType" label="文件类型" />
      <el-table-column prop="product2" label="所属项目" width="300px" />
      <el-table-column prop="enclosureType" label="附件类型" />
      <el-table-column label="操作">
        <template #default="scope">
          <a class="link" :href="scope.row.url" target="_blank">查看</a>
          <a class="link" v-if="checkPermission(['ADMIN'])" @click="editClick(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" :title="editForm.name">
      <el-form class="dialogForm" :model="editForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="所属项目" prop="product">
          <el-input v-model="editForm.product"></el-input>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-input v-model="editForm.fileType"></el-input>
        </el-form-item>
        <el-form-item label="所属项目" prop="product2">
          <el-input v-model="editForm.product2"></el-input>
        </el-form-item>
        <el-form-item label="附件类型" prop="enclosureType">
          <el-select v-model="editForm.enclosureType">
            <el-option label="PDF" value="pdf"></el-option>
            <el-option label="图片" value="图片"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件" prop="fileList" class="annexItem">
          <el-upload
            class="upload"
            ref="uploadRef"
            drag
            accept="image/*,.pdf"
            :limit="1"
            :on-preview="filePreview"
            :on-exceed="fileExceed"
            :action="action"
            :fileList="fileList"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :auto-upload="false"
            :data="editForm"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">只能上传pdf/jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUpload">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElUpload } from 'element-plus'
import { getAttLibrary } from '@/api/attLibrary'
import { format } from '@/utils/dateFormat'
import checkPermission from '@/utils/permission'

interface queryType {
  startDate: string
  endDate: string
  name: string
  product: string
  fileType: string
  type: string
}
interface typeRow{
  id: string
  date: string
  name: string
  product: string
  fileType: string
  product2: string
  enclosureType: string
  url: string
}
export default defineComponent({
  name: 'AttLibaray',
  components: { UploadFilled },
  setup () {
    const loading = ref(false)
    // 查询表单数据
    const value1 = ref('')
    const formInline = ref({
      startDate: '',
      endDate: '',
      name: '',
      product: '',
      fileType: '',
      type: ''
    })
    // 日期范围修改方法
    const dateChange = (val: any) => {
      formInline.value.startDate = format(new Date(val[0]), 'yyyy-MM-dd')
      formInline.value.endDate = format(new Date(val[1]), 'yyyy-MM-dd')
    }
    // 搜索
    const search = () => {
      console.log(formInline.value)
      getData(formInline.value)
    }
    // 重置
    const reset = () => {
      formInline.value = { startDate: '', endDate: '', name: '', product: '', fileType: '', type: '' }
      value1.value = ''
      getData(formInline.value)
    }
    // 获取表格数据
    const tableData: typeRow[] = reactive([])
    const getData = (query: queryType) => {
      loading.value = true
      getAttLibrary(query).then(res => {
        tableData.splice(0, tableData.length, ...res.data[0].data.data)
        loading.value = false
      })
    }
    getData(formInline.value)
    /**
     * 编辑
     **/
    const fileList = ref([])
    const editForm: any = ref({})
    const dialogFormVisible = ref(false)
    const action = 'api/attLibrary'

    const editClick = (row: typeRow) => {
      editForm.value = Object.assign({}, row)
      if (localStorage.getItem('file') && localStorage.getItem('file') !== null) {
        fileList.value = JSON.parse(localStorage.getItem('file') || '')
      }
      dialogFormVisible.value = true
    }
    const fileExceed = () => {
      ElMessage.warning('文件超出限制')
    }
    const filePreview = (file: any) => {
      console.log(file)
    }
    const uploadRef = ref<InstanceType<typeof ElUpload>>()
    // 附件提交
    const submitUpload = () => {
      console.log('12333')
      uploadRef.value!.submit()
      dialogFormVisible.value = false
    }
    const uploadSuccess = (response: any, fileList: any) => {
      console.log(response)
      if (response[0].status === 200) {
        ElMessage.success('上传成功')
        dialogFormVisible.value = false
        localStorage.setItem('file', JSON.stringify(fileList))
      } else {
        ElMessage.warning(response.message + '!')
      }
    }
    const uploadError = (error: any) => {
      console.log(error)
      ElMessage.warning('导入失败!')
    }

    return {
      loading, formInline, value1, dateChange, search, reset, tableData, editClick, dialogFormVisible, editForm, fileList, action, uploadRef, fileExceed, filePreview, submitUpload, uploadSuccess, uploadError, checkPermission
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/ .el-input {
  width: 200px;
}
.link{
  text-decoration: none;
  margin: 0 3px;
}
a{
  color: #3894FF;
}
.dialogForm{
  display: flex;
  flex-wrap: wrap;
  .el-form-item{
    width: 33%;
  }
  .annexItem{
    flex: 1 0 100%;
    width: 100% !important;
  }
}
</style>
