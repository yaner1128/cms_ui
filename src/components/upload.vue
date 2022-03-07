<template>
  <div class='upload'>
    <el-table :data="fileList" max-height="800" border>
      <el-table-column prop="uploadTime" label="上传日期" />
      <el-table-column prop="attachmentName" label="名称" />
      <el-table-column prop="projectName" label="所属项目" />
      <el-table-column prop="fileType" label="文件类型" />
      <el-table-column prop="attchmentType" label="附件类型" />
      <el-table-column label="操作">
        <template #default="scope">
          <a class="link" href="http://www.gov.cn/zhengce/pdfFile/2022_PDF.pdf" target="_blank" style="margin-right: 12px">查看</a>
          <el-button v-show="isEdit" type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除本条数据吗？">
            <template #reference>
              <el-button v-show="isEdit" type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="uploadDialog" title="附件" width="400px">
      <el-upload
        class="upload"
        ref="uploadRef"
        drag
        accept="image/*,.pdf"
        :limit="1"
        :on-exceed="fileExceed"
        action=""
        :fileList="fileList"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :auto-upload="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传pdf/jpg/png文件，且不超过500kb</div>
        </template>
      </el-upload>
      <div class="buttonList">
        <el-button type="primary">上传</el-button>
        <el-button type="" @click="uploadDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElUpload } from 'element-plus'

interface rowType {
  uploadTime: string;
  attachmentName: string;
  projectName: string;
  fileType: string;
  attchmentType: string;
  [propname: string]: any;
}
export default defineComponent({
  name: 'upLoad',
  components: { UploadFilled },
  props: ['fileList', 'isEdit'],
  setup (props) {
    const data = reactive({
      uploadDialog: false, // 附件弹出框
      editClick: (row: rowType) => {
        data.uploadDialog = true
        console.log(row)
      }
    })
    const resData = toRefs(data)

    // 附件上传
    const fileExceed = () => {
      ElMessage.warning('文件超出限制')
    }
    const uploadSuccess = (response: any, file:unknown, fileList: unknown) => {
      console.log(response, file)
      if (response[0].status === 200) {
        ElMessage.success('上传成功')
        data.uploadDialog = false
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
      ...props, ...resData, uploadSuccess, uploadError, fileExceed
    }
  }
})
</script>
<style lang="scss" scoped>
.link{
  text-decoration: none;
  margin: 0 3px;
}
a{
  font-size: 12px;
  color: #3894FF;
  cursor: pointer;
}
.buttonList{
  display: flex;
  justify-content: center;
}
</style>
