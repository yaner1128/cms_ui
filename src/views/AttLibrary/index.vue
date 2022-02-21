/* eslint-disable handle-callback-err */
/* eslint-disable handle-callback-err */
<template>
  <div class='attLibrary'>
    <el-table :data="tableData" border>
      <el-table-column prop="date" label="上传日期" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="product" label="所属项目" />
      <el-table-column prop="fileType" label="文件类型" />
      <el-table-column prop="product2" label="所属项目" width="300px" />
      <el-table-column prop="enclosureType" label="附件类型" />
      <el-table-column label="操作">
        <template #default="scope">
          <a class="link" @click="annexClick(scope.row)">查看</a>
          <a class="link" @click="editClick(scope.row)">编辑</a>
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
            <el-option label="PDF" value="PDF"></el-option>
            <el-option label="图片" value="图片"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件" prop="fileList" class="annexItem">
          <el-upload
            class="upload"
            ref="uploadPerson"
            drag
            :action="action"
            :fileList="fileList"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :auto-upload="false">
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
import { defineComponent, ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElUpload } from 'element-plus'

const fileList = ref([])
const editForm: any = ref({})
const dialogFormVisible = ref(false)
const uploadRef = ref<InstanceType<typeof ElUpload>>()
const submitUpload = () => {
  uploadRef.value!.submit()
  dialogFormVisible.value = false
}
export default defineComponent({
  name: 'AttLibaray',
  components: { UploadFilled },
  setup () {
    const tableData = [
      { id: 1, date: '2016-05-02', name: 'xx采购合同', product: '衡山', fileType: '采购合同', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: 'PDF' },
      { id: 1, date: '2016-05-03', name: 'xx中标通知书', product: '衡山', fileType: '中标通知书', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: '图片' },
      { id: 1, date: '2016-05-04', name: 'xx销售合同', product: '衡山', fileType: '销售合同', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: 'PDF' },
      { id: 1, date: '2016-05-05', name: 'xx验收清单', product: '衡山', fileType: '验收清单', product2: '会计云核算-衡山县财政局-软件代理销售', enclosureType: 'PDF' }
    ]
    interface typeRow{
      id: string
      date: string
      name: string
      product: string
      fileType: string
      product2: string
      enclosureType: string
    }
    /*
     * 查看详情
     * row: 当前行数据
     */
    const annexClick = (row: typeRow) => {
      console.log('查看', row)
    }
    /**
     * 编辑
     **/
    const action = process.env.VUE_APP_BASE_API + '/api/personInfo/batchAdd'
    const editClick = (row: typeRow) => {
      editForm.value = Object.assign({}, row)
      dialogFormVisible.value = true
    }
    const uploadSuccess = (response: { code: number; message: string }, file: any, fileList: any) => {
      if (response.code === 200) {
        ElMessage.success('上传成功')
        dialogFormVisible.value = false
      } else {
        ElMessage.warning(response.message + '！')
      }
    }
    const uploadError = (error: any, file: any, fileList: any) => {
      console.log(error, file, fileList)
      ElMessage.warning('导入失败!')
    }

    return {
      tableData, annexClick, editClick, dialogFormVisible, editForm, fileList, action, submitUpload, uploadSuccess, uploadError
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
