<template>
  <div class="app-container">
    <el-form label-width="120px">
      <!--下载excel模板-->
      <el-collapse v-model="activeNames">
        <el-collapse-item title="视频分类Excel模板说明" name="1" @change="handleChange">
          <div>需要向数据库中导入视频分类时,请下载Excel模板,编辑完成后上传</div>
          <div style="font-size:18px">提示:</div>
          <div>1.如果视频分类是顶级分类,则父分类填写 '无' 或者 空字符串 或者 不填</div>
          <div>2.插入的数据中所有的顶级分类要写在Excel表最上面,否则导入数据会失败</div>
          <div>3.当导入的分类在数据库中存在时,会跳过,判断标准: 当前分类名称在数据库中存在 并且 父分类与数据库中记录一致</div>
          <div>4.重复的数据在导入时跳过,后台日志会记录</div>
          <div>如有疑问请联系管理员</div>
        </el-collapse-item>
      </el-collapse>
      <el-form-item label="模板下载">
        <el-tag>
          <i class="el-icon-download" />
          <a @click="downloadTemplate('xls')">点击下载模板 (.xls格式) </a>
        </el-tag> &nbsp;
        <el-tag>
          <i class="el-icon-download" />
          <a @click="downloadTemplate('xlsx')">点击下载模板 (.xlsx格式) </a>
        </el-tag>
      </el-form-item>
      <!--上传excel-->
      <el-form-item label="上传分类数据">
        <el-upload
          ref="upload"
          :action="BASE_URL+'/service_video/category/importExcel'"
          :auto-upload="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          accept=".xls, .xlsx"
          :limit="1"
          :disabled="uploadDisabled"
          name="file"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >导入到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import templateApi from '@/api/data/template'
export default {
  name: 'CategoryData',
  data() {
    return {
      uploadDisabled: false,
      activeNames: ['1'],
      BASE_URL: process.env.VUE_APP_BASE_API
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    },
    downloadTemplate(type) {
      templateApi.getTemplate('category', type).then((response) => {
        // console.log(response)
        if (response.success) {
          window.open(response.data.url)
        } else {
          alert(response.message)
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadSuccess(response) {
      this.$message('上传成功')
    },
    uploadError(response) {
      this.$message('上传失败')
    }

  }
}
</script>

<style scoped>

</style>
