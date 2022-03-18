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
        <el-input v-model="formInline.attachmentName" clearable placeholder="请输入附件名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.projectName" clearable placeholder="请输入项目"></el-input>
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
        <el-select v-model="formInline.attchmentType" clearable placeholder="请选择附件类型">
          <el-option label="PDF" value="PDF"></el-option>
          <el-option label="图片" value="图片"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="success" @click="reset">重置</el-button>
        <el-button type="warning" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="tableData" max-height="800" border>
      <el-table-column prop="uploadTime" label="上传日期" />
      <el-table-column prop="attachmentName" label="名称" />
      <el-table-column prop="projectName" label="所属项目" />
      <el-table-column prop="fileType" label="文件类型" />
      <el-table-column prop="attchmentType" label="附件类型" />
      <el-table-column label="操作">
        <template #default="scope">
          <a class="link" :href="scope.row.attachUrl" target="_blank">查看</a>
          <a class="link" v-if="checkPermission(['ADMIN'])" @click="editClick(scope.row)">编辑</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
      <el-form class="dialogForm" :model="editForm" label-width="80px">
        <el-form-item label="名称" prop="attachmentName" placeholder="请输入附件名称">
          <el-input v-model="editForm.attachmentName"></el-input>
        </el-form-item>
        <el-form-item label="所属项目" prop="projectName" placeholder="请选择所属项目">
          <el-input v-model="editForm.projectName"></el-input>
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType" placeholder="请选择文件类型">
          <el-input v-model="editForm.fileType"></el-input>
        </el-form-item>
        <el-form-item label="附件类型" prop="attchmentType">
          <el-select v-model="editForm.attchmentType" placeholder="请选择附件类型">
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
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElUpload } from 'element-plus'
import { getAttLibrary } from '@/api/attLibrary'
import { format } from '@/utils/dateFormat'
import checkPermission from '@/utils/permission'
import { page } from '@/utils/page'

interface queryType {
  attachmentName: string;
  projectName: string;
  fileType: string;
  attchmentType: string;
  startDate: string;
  endDate: string;
  [propname: string]: any
}
interface typeRow{
  attachmentName: string;
  projectName: string;
  fileType: string;
  attchmentType: string;
  startDate: string;
  endDate: string;
  [propname: string]: any
}
export default defineComponent({
  name: 'AttLibaray',
  components: { UploadFilled },
  setup () {
    const { pageData, handleSizeChange, handleCurrentChange } = page()
    const data = reactive({
      loading: false, // 表格加载
      value1: '', // 查询表单数据
      dialogFormVisible: false,
      dateChange: (val: any) => { // 日期范围修改方法
        formInline.value.startDate = format(new Date(val[0]), 'yyyy-MM-dd')
        formInline.value.endDate = format(new Date(val[1]), 'yyyy-MM-dd')
      },
      search: () => { // 搜索
        getData(formInline.value)
      },
      reset: () => { // 重置
        formInline.value = { attachmentName: '', projectName: '', fileType: '', attchmentType: '', startDate: '', endDate: '' }
        data.value1 = ''
        getData(formInline.value)
      },
      dialogTitle: '',
      add: () => {
        data.dialogFormVisible = true
        data.dialogTitle = '新增'
        editForm.value = { attachmentName: '', projectName: '', fileType: '', attchmentType: '', startDate: '', endDate: '' }
      },
      action: 'api/attLibrary'
    })
    const resData = toRefs(data)
    // 搜索表单数据
    const formInline = ref<queryType>({ attachmentName: '', projectName: '', fileType: '', attchmentType: '', startDate: '', endDate: '' })
    // 获取表格数据
    const tableData = ref<typeRow[]>([])
    const getData = async (query: queryType) => {
      data.loading = true
      query = Object.assign({ currentPage: pageData.currentPage.value, pageSize: pageData.pageSize.value }, query)
      let queryStr = ''
      console.log(query)
      for (var k in query) {
        if (query[k]) {
          queryStr += `${k}=${query[k]}&`
        }
      }
      await getAttLibrary(queryStr.slice(0, -1)).then(res => {
        console.log(res.data)
        tableData.value = res.data.data.records
        pageData.total.value = res.data.data.total
        data.loading = false
      })
    }
    getData(formInline.value)
    /**
     * 编辑
     **/
    const fileList = ref<unknown[]>([])
    const editForm = ref<typeRow>({ attachmentName: '', projectName: '', fileType: '', attchmentType: '', startDate: '', endDate: '' })

    const editClick = (row: typeRow) => {
      data.dialogFormVisible = true
      data.dialogTitle = '编辑'
      editForm.value = Object.assign({}, row)
      // if (localStorage.getItem('file') && localStorage.getItem('file') !== null) {
      //   fileList.value = JSON.parse(localStorage.getItem('file') || '')
      // }
    }
    // 附件相关
    const fileExceed = () => {
      ElMessage.warning('文件超出限制')
    }
    const filePreview = (file: unknown) => {
      console.log(file)
    }
    const uploadRef = ref<InstanceType<typeof ElUpload>>()
    // 附件提交
    const submitUpload = () => {
      uploadRef.value!.submit()
      data.dialogFormVisible = false
    }
    const uploadSuccess = (response: any, file:unknown, fileList: unknown) => {
      console.log(response, file)
      if (response[0].status === 200) {
        ElMessage.success('上传成功')
        data.dialogFormVisible = false
        localStorage.setItem('file', JSON.stringify(fileList))
      } else {
        ElMessage.warning(response.message + '!')
      }
    }
    const uploadError = (error: unknown) => {
      console.log(error)
      ElMessage.warning('导入失败!')
    }

    return {
      ...pageData, handleSizeChange, handleCurrentChange, ...resData, formInline, tableData, editClick, editForm, fileList, uploadRef, fileExceed, filePreview, submitUpload, uploadSuccess, uploadError, checkPermission
    }
  }
})
</script>

<style lang="scss" scoped>
/deep/.dialogForm .el-input {
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
