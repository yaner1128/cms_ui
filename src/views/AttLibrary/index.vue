/* eslint-disable handle-callback-err */
/* eslint-disable handle-callback-err */
<template>
  <div class='attLibrary'>
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="date" label="上传日期" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="product" label="所属项目" />
      <el-table-column prop="fileType" label="文件类型" />
      <el-table-column prop="product2" label="所属项目" width="300px" />
      <el-table-column prop="enclosureType" label="附件类型" />
      <el-table-column label="操作">
        <template #default="scope">
          <a class="link" :href="scope.row.url" target="blank">查看</a>
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
import { defineComponent, reactive, ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElUpload } from 'element-plus'
import { getAttLibrary } from '@/api/attLibrary'

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
    // 获取表格数据
    const tableData: typeRow[] = reactive([])
    const getData = () => {
      loading.value = true
      getAttLibrary().then(res => {
        tableData.splice(0, tableData.length, ...res.data[0].data.data)
        loading.value = false
      })
    }
    getData()

    // /*
    //  * 查看详情
    //  * row: 当前行数据
    //  */
    // const annexClick = (row: typeRow) => {
    //   console.log('查看', row)
    //   if (row.enclosureType === 'PDF') {
    //     console.log('PDF')
    //     window.open('http://cn.createpdfonline.org/dopdf.php')
    //   } else if (row.enclosureType === '图片') {
    //     console.log('图片')
    //   }
    // }
    /**
     * 编辑
     **/
    const fileList = ref([])
    const editForm: any = ref({})
    const dialogFormVisible = ref(false)
    const uploadRef = ref<InstanceType<typeof ElUpload>>()
    const action = process.env.VUE_APP_BASE_API + '/api/personInfo/batchAdd'

    const editClick = (row: typeRow) => {
      editForm.value = Object.assign({}, row)
      dialogFormVisible.value = true
    }
    const submitUpload = () => {
      uploadRef.value!.submit()
      dialogFormVisible.value = false
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
      loading, tableData, editClick, dialogFormVisible, editForm, fileList, action, submitUpload, uploadSuccess, uploadError
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
