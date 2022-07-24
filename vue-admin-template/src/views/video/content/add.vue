<template>
  <div class="app-container">
    <h1>添加作品</h1>
    <el-steps :active="1" finish-status="success">
      <el-step title="填写作品基本信息" />
      <el-step title="添加章节视频" />
      <el-step title="完成" />
    </el-steps>

    <el-form label-width="120px" style="margin-top: 10px">
      <!--标题-->
      <el-form-item label="作品标题">
        <el-input v-model="contentVO.title" placeholder="请填写作品标题" />
      </el-form-item>
      <!--分类 -->
      <el-form-item label="作品分类">
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
      <el-form-item label="作者">
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
      <el-form-item label="总视频数">
        <el-input v-model="contentVO.contentNum" :min="0" placeholder="总视频数" />
      </el-form-item>
      <!--简介-->
      <el-form-item label="作品简介">
        <el-input v-model="contentVO.description" :min="0" placeholder="简介" />
      </el-form-item>
      <!--封面-->
      <el-form-item label="作品封面">
        <el-upload
          v-if="isShowUpload"
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture"
          :auto-upload="false"
          :on-change="imgSaveToUrl"
          :accept="'image/*'"
        >
          <i class="el-icon-upload" style="color:#409EFF" />
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
        <div v-if="isShowImgUpload">
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
          </div>
        </div>

      </el-form-item>
      <!--价格-->
      <el-form-item label="价格">
        <el-input v-model="contentVO.price" :min="0" placeholder="价格" />
      </el-form-item>

      <el-button style="margin-left: 120px; margin-top: 12px;" type="primary" @click="next">下一步</el-button>
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
import contentApi from '@/api/content/content'
export default {
  data() {
    return {
      isShowUpload: true,
      isShowImgUpload: false,
      localUrl: '',
      active: 0,
      contentVO: {
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
      BASE_URL: process.env.VUE_APP_BASE_API

    }
  },
  created() {
    this.getCategoryTree()
    this.getAuthorList()
    this.loadData()
  },

  methods: {
    next() {
      // 路由跳转
      this.contentVO.cover = JSON.parse(JSON.stringify(this.localUrl))
      this.$store.commit('update', this.contentVO)
      this.$router.push({ path: '/content/chapter/1' })
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
      this.contentVO = vo == null ? {} : vo
      if (this.contentVO.cover != null || this.contentVO.cover !== '') {
        // 封面有值,需要回显
        this.localUrl = this.contentVO.cover
        this.isShowUpload = false
        this.isShowImgUpload = true
      }
      console.log(this.contentVO)
    }
  }
}
</script>

<style scoped>

</style>
