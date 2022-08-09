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
        <tinymce ref="editor" v-model="contentVO.description"/>
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
          :before-upload="uploadPreview"
          :show-file-list="false"
        >
          <i class="el-icon-upload" style="color:#409EFF"/>
          <div class="el-upload__text text">
            将图片拖到此处，或
            <em>点击上传</em>
          </div>
          <div
            slot="tip"
            class="el-upload__tip text"
          >提示：可支持PNG,JPG,BMP,JPEG图片大小不超过4M,长宽像素比为5:3左右，请保证识别的部分为图片的主题部分
          </div>
        </el-upload>
        <!-- 本地预览需要上传处理的图片-->
        <div v-show="isShowImgUpload">
          <div style="position:relative;">
            <el-image
              style="width: 300px; height: 200px"
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
      contentId: -1,
      localUrl: '',
      isNeedRemovePhoto: false
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
          this.$router.push({path: '/content/chapter/' + this.contentId})
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
      if (this.isNeedRemovePhoto) {
        const coverName = this.contentVO.cover.substring(this.contentVO.cover.lastIndexOf('/') + 1)
        // console.log(coverName)
        contentApi.deleteContentCoverWithName(coverName)
      }
      this.localUrl = ''
      this.isShowImgUpload = false
      this.isShowUpload = true
      this.isNeedRemovePhoto = false
    },
    loadData() {
      // 获取路由参数
      if (this.$route.params && this.$route.params.id) {
        const contentId = this.$route.params.id
        if (contentId !== undefined && contentId !== '' && contentId !== null && contentId !== '-1') {
          // 有值,去数据库中查询
          console.log(contentId)
          this.getDataWithContentId(contentId)
        }
      } else {
        console.log('清空数据')
        // 没有值,就先清空vuex中的数据
        this.$store.commit('update', null)
        this.$store.commit('cachePreViewObject', null)
        this.$store.commit('cacheChapter', null)
        this.$router.push({path: '/content/add'})
      }
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
      this.$refs.upload.submit()
    },
    uploadPreview(file) {
      const photoTypeList = ['png', 'jpg', 'jpeg', 'bmp']
      const photoType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isAcceptType = photoTypeList.indexOf(photoType) > -1
      const isLt4MB = file.size / 1024 / 1024 < 4
      if (!isAcceptType) {
        this.$message.error('上传图片必须是指定格式')
        return false
      }
      if (!isLt4MB) {
        this.$message.error('上传图片大小不能超过 4MB!')
        return false
      }
      const _this = this
      const is5x3 = new Promise(function (resolve, reject) {
        const img = new Image()
        const _URL = window.URL || window.webkitURl
        img.onload = function () {
          file.width = img.width// 图片宽度
          file.height = img.height// 图片高度
          const valid = img.width / img.height > 1.7 && img.width / img.height < 1.8 // 上传图片尺寸判定
          valid ? resolve() : reject(new Error('图片尺寸不符合要求'))
        }
        img.src = _URL.createObjectURL(file)
      }).then(
        () => {
          return file
        },
        () => {
          _this.$message.error('上传图片尺寸必须接近5比3')
          return Promise.reject(new Error('error'))
        }
      )
      return isAcceptType && isLt4MB && is5x3
    },
    uploadCoverSuccess(response) {
      // 成功上传图片,记录一下标记,重新上传的时候就需要先去删除图片再上传
      this.isNeedRemovePhoto = true
      this.$message({type: 'success', message: response.message})
      this.contentVO.cover = response.data.url
    },
    getDataWithContentId(id) {
      contentApi.getContentDataWithId(id).then(response => {
        this.contentId = id
        const data = response.data.data
        this.contentVO = data.contentVO
        // 处理封面
        this.isShowUpload = false
        this.isShowImgUpload = true
        this.localUrl = JSON.parse(JSON.stringify(this.contentVO.cover))
        this.contentVO.categoryId = [this.contentVO.categoryParentId, this.contentVO.categoryId]
        console.log(this.contentVO)
        console.log(data.chapterTree)
        this.$store.commit('cacheChapter', data.chapterTree)
      })
    }
  }

}
</script>

<style scoped>

</style>
