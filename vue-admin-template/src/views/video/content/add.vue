<template>
  <div class="app-container">
    <h1>添加作品</h1>
    <el-steps :active="active" finish-status="success">
      <el-step title="填写作品基本信息"/>
      <el-step title="添加章节视频"/>
      <el-step title="完成"/>
    </el-steps>

    <el-form ref="contentVO" label-width="120px" style="margin-top: 10px" :model="contentVO" :rules="rules">
      <!--标题-->
      <el-form-item label="作品标题" prop="title">
        <el-input v-model="contentVO.title" autocomplete="off" placeholder="请填写作品标题"/>
      </el-form-item>
      <!--分类 -->
      <el-form-item label="作品分类" prop="categoryId">
        <div class="block">
          <el-cascader
            v-model="contentVO.categoryId"
            placeholder="请选择分类"
            clearable
            :options="categoryTree"
            :props="{ value: 'id', expandTrigger: 'hover' }"
          />
        </div>
      </el-form-item>
      <!--作者-->
      <el-form-item label="作者" prop="authorId">
        <el-select v-model="contentVO.authorId" placeholder="选择作者" @change="handleChange">
          <el-option
            v-for="author in authorList"
            :key="author.id"
            :label="author.name"
            :value="author.id"
          />
        </el-select>
      </el-form-item>
      <!--总视频数-->
      <el-form-item label="总视频数" prop="contentNum">
        <el-input v-model.number="contentVO.contentNum" :min="0" autocomplete="off" placeholder="总视频数"/>
      </el-form-item>
      <!--简介-->
      <el-form-item label="作品简介" prop="description">
        <tinymce ref="editor" v-model="contentVO.description"></tinymce>
      </el-form-item>
      <!--封面-->
      <el-form-item label="作品封面" prop="cover">
        <el-upload
          v-show="isShowUpload"
          ref="upload"
          class="upload-demo"
          drag
          :action="BASE_URL+'/service_upload/file/uploadCover'"
          list-type="picture"
          :auto-upload="false"
          :on-change="imgSaveToUrl"
          :accept="'image/*'"
          :on-success="uploadCoverSuccess"
        >
          <i class="el-icon-upload" style="color:#409EFF"/>
          <div class="el-upload__text text">
            将图片拖到此处，或
            <em>点击上传</em>
          </div>
          <div
            slot="tip"
            class="el-upload__tip text"
          >提示：可支持PNG、JPG、BMP，图片大小不超过4M,长边不大于4096像素，请保证识别的部分为图片的主题部分</div>
        </el-upload>
        <!-- 本地预览需要上传处理的图片-->
        <div v-show="isShowImgUpload">
          <div style="position:relative;">
            <el-image
              style="width: 300px; height: 200px"
              :preview-src-list="[localUrl]"
              :src="localUrl"
              fit="fill"
            />
          </div>
          <div style="padding: 5px;">
            <el-button type="primary" :loading="false" size="small" @click="reUploadButtonClick">重新上传</el-button>
            <el-button type="success" size="small" style="margin-top: 10px;margin-bottom: 10px;" @click="uploadCover">
              确认上传
            </el-button>
          </div>
        </div>

      </el-form-item>
      <!--价格-->
      <el-form-item label="价格" prop="price">
        <el-input v-model.number="contentVO.price" :min="0" autocomplete="off" placeholder="价格"/>
      </el-form-item>

      <el-button style="margin-left: 120px; margin-top: 12px;" type="primary" @click="next('contentVO')">下一步</el-button>
      <el-button type="success" style="margin-top: 10px;margin-bottom: 10px;" @click="cacheContentVO">保存当前编辑</el-button>
    </el-form>
  </div>

</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<script>
import contentApi from '@/api/video/content'
import tinymce from '@/components/Tinymce/tinymce'

export default {
  components: {
    tinymce
  },
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value === undefined || value === null || value === '' || value.trim().length === 0) {
        callback(new Error('标题不能为空并且不能全为空格'))
      } else {
        callback()
      }
    }
    var validateCategoryId = (rule, value, callback) => {
      if (value === undefined || value === null || value.length === 0) {
        callback(new Error('请选择作品分类'))
      } else {
        console.log(value)
        callback()
      }
    }
    var validateAuthorId = (rule, value, callback) => {
      if (value === undefined || value === null || value.length === 0) {
        callback(new Error('请选择作者'))
      } else {
        console.log(value)
        callback()
      }
    }
    var validateContentNum = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('视频数量不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('视频数量必须是数字'))
      }
      if (value < 1) {
        callback(new Error('视频数量必须大于0'))
      } else {
        callback()
      }
    }
    var validateDescription = (rule, value, callback) => {
      if (value === undefined || value === null || value === '' || value.trim().length === 0) {
        callback(new Error('简介不能为空'))
      } else {
        callback()
      }
    }
    var validateCover = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        console.log(value)
        callback(new Error('封面未上传'))
      } else {
        console.log(value)
        callback()
      }
    }
    var validatePrice = (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('价格不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('价格必须是数字'))
      }
      if (value < 0) {
        callback(new Error('价格不能小于0'))
      } else {
        callback()
      }
    }

    return {
      isUpload: false,
      isShowUpload: true,
      isShowImgUpload: false,
      // localUrl: '',
      active: 1,
      contentVO: {
        title: '',
        categoryId: '',
        authorId: '',
        contentNum: '',
        description: '',
        cover: '',
        price: ''
      },
      id: [],
      categoryTree: [],
      authorList: [],
      BASE_URL: process.env.VUE_APP_BASE_API,
      rules: {
        title: [
          {validator: validateTitle, trigger: 'blur'}
        ],
        categoryId: [
          {validator: validateCategoryId, trigger: 'blur'}
        ],
        authorId: [
          {validator: validateAuthorId, trigger: 'blur'}
        ],
        contentNum: [
          {validator: validateContentNum, trigger: 'blur'}
        ],
        description: [
          {validator: validateDescription, trigger: 'blur'}
        ],
        cover: [
          {validator: validateCover, trigger: 'blur'}
        ],
        price: [
          {validator: validatePrice, trigger: 'blur'}
        ]
      },
      contentId: '',
      localUrl: ''
    }
  },
  created() {
    this.getCategoryTree()
    this.getAuthorList()
    this.loadData()
  },
  methods: {
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 路由跳转
          this.$store.commit('update', this.contentVO)
          this.$store.commit('cachePreViewObject', this.getPreviewObject())
          this.$router.push({path: '/content/chapter' + this.contentId})
        } else {
          return false
        }
      })
    },
    getCategoryTree() {
      contentApi.getCategoryTree().then((response) => {
        if (response.success) {
          this.categoryTree = response.data.categoryTree
        } else {
          this.$message(response.message)
        }
      })
    },
    getAuthorList() {
      contentApi.getAuthorList().then((response) => {
        this.authorList = response.data.authorList
      })
    },
    handleChange(id) {
      this.contentVO.authorId = id
      // console.log(this.contentVO.authorId)
    },
    imgSaveToUrl(event) {
      // 获取上传图片的本地URL，用于上传前的本地预览
      var URL = null
      if (window.createObjectURL !== undefined) {
        // basic
        URL = window.createObjectURL(event.raw)
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(event.raw)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(event.raw)
      }
      // 转换后的地址为 blob:http://xxx/7bf54338-74bb-47b9-9a7f-7a7093c716b5
      this.localUrl = URL
      this.isShowImgUpload = true// 呈现本地预览组件
      this.isShowUpload = false// 隐藏上传组件
    },
    reUploadButtonClick() {
      this.localUrl = ''
      this.isShowImgUpload = false
      this.isShowUpload = true
    },
    loadData() {
      const vo = this.$store.state.contentVO
      if (vo !== null) {
        this.contentVO = vo
      }
      if (this.contentVO.cover != null && this.contentVO.cover !== '' && this.contentVO.cover !== undefined) {
        this.localUrl = this.contentVO.cover
        // 封面有值,需要回显
        this.isShowUpload = false
        this.isShowImgUpload = true
      }
    },
    cacheContentVO() {
      this.$store.commit('update', this.contentVO)
      this.$message({type: 'success', message: '保存成功'})
    },
    findOneAuthorName(id) {
      for (let i = 0; i < this.authorList.length; i++) {
        if (this.authorList[i].id === id) {
          return this.authorList[i].name
        }
      }
    },
    findCategoryName(ids) {
      const categoryName = []
      for (let i = 0; i < this.categoryTree.length; i++) {
        if (this.categoryTree[i].id === ids[0]) {
          const children = this.categoryTree[i].children
          categoryName.push(this.categoryTree[i].label)
          for (let j = 0; j < children.length; j++) {
            if (children[j].id === ids[1]) {
              categoryName.push(children[j].label)
              return categoryName
            }
          }
        }
      }
    },
    getPreviewObject() {
      const cloneContentVO = JSON.parse(JSON.stringify(this.contentVO))
      const previewObject = {}
      previewObject.cover = cloneContentVO.cover
      previewObject.title = cloneContentVO.title
      previewObject.contentNum = cloneContentVO.contentNum
      previewObject.categoryId = this.findCategoryName(cloneContentVO.categoryId)
      previewObject.author = this.findOneAuthorName(cloneContentVO.authorId)
      previewObject.price = cloneContentVO.price
      console.log(previewObject)
      return previewObject
    },
    uploadCover() {
      console.log('上传图片')
      this.$refs.upload.submit()
    },
    uploadCoverSuccess(response) {
      this.$message({type: 'success', message: response.message})
      this.contentVO.cover = response.data.url
    },
  }

}
</script>

<style scoped>

</style>