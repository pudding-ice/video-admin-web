<template>
  <div class="app-container">
    <el-form ref="authorVO" label-width="120px" :rules="rules" :model="author">
      <el-form-item label="作者名称" prop="name">
        <el-input v-model="author.name"/>
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number v-model="author.sort" controls-position="right" :min="0"/>
      </el-form-item>

      <el-form-item label="级别" prop="level">
        <el-select v-model="author.level" clearable placeholder="选择级别">
          <el-option label="特约创作者" :value="0"/>
          <el-option label="普通创作者" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="创作者简介" prop="introduction">
        <el-input v-model="author.introduction"/>
      </el-form-item>
      <el-form-item label="上传头像" prop="avatar">
        <el-upload
          ref="avatar"
          class="avatar-uploader"
          accept="image/*"
          :action="BASE_URL+'/service_upload/file/uploadAvatar'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="imgSaveToUrl"
          :auto-upload="false"
          :limit="1"
          :file-list="avatarList"
        >
          <img v-if="localUrl" :src="localUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
        <el-button type="warning" size="small" style="margin-top: 10px;margin-bottom: 10px;" @click="reChooseAvatar">
          重新选择
        </el-button>
        <el-button type="success" size="small" style="margin-top: 10px;margin-bottom: 10px;" @click="uploadAvatar">
          确认上传
        </el-button>
        <el-tooltip placement="right-end">
          <div slot="content">
            可支持PNG,JPG,BMP,JPEG图片大小不超过2M,请保证识别的部分为图片的主题部分<br>
          </div>
          <i class="el-icon-question"/>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="工作经历" prop="career">
        <el-input v-model="author.career" type="textarea" :rows="10"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="false" type="primary" @click="saveClick()">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import authorApi from '@/api/video/author'
// import ImageCropper from '@/components/ImageCropper'
// import PanThumb from '@/components/PanThumb'

export default {
  // components: { ImageCropper, PanThumb },
  data() {
    var validateAuthorName = (rule, value, callback) => {
      if (value === undefined || value === null || value === '' || value.trim().length === 0) {
        callback(new Error('作者名称不能为空并且不能全为空格'))
      } else {
        callback()
      }
    }
    var validateCareer = (rule, value, callback) => {
      if (value === undefined || value === null || value === '' || value.trim().length === 0 || value.length > 100) {
        callback(new Error('工作经历不能为空并且不能超过100字'))
      } else {
        callback()
      }
    }
    var validateAvatar = (rule, value, callback) => {
      if (this.author.avatar === '' || this.author.avatar === undefined || this.author.avatar === null) {
        callback(new Error('需要上传头像'))
      } else {
        callback()
      }
    }
    var validateIntroduction = (rule, value, callback) => {
      if (value === undefined || value === null || value === '' || value.trim().length === 0 || value.length > 30) {
        callback(new Error('简介不能为空并且不能超过30字'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          {validator: validateAuthorName, trigger: 'blur'}
        ],
        career: [
          {validator: validateCareer, trigger: 'blur'}
        ],
        avatar: [
          {validator: validateAvatar, trigger: 'blur'}
        ],
        introduction: [
          {validator: validateIntroduction, trigger: 'blur'}
        ]
      },
      localUrl: '',
      author: {
        sort: 0,
        level: 0,
        avatar: ''
      },
      // imageCropperShow: false,
      // cropperKey: 0,
      BASE_URL: process.env.VUE_APP_BASE_API,
      isNeedRemoveAvatar: false,
      avatarList: [],
      allowUploadAvatar: false
    }
  },
  created() { // 一进来就要获取参数
    // 判断有没有参数 ，如果有， 获取参数
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id
      // 根据id获取该条参数对应的数据  --> 发送请求到服务器当中获取数据
      authorApi.getOneAuthor(id).then((response) => {
        this.author = response.data.author
      })
    } else {
      this.author = {
        sort: 0,
        level: 0
      }
    }
  },
  methods: {
    saveClick() {
      // 保存   添加/更新
      this.$refs['authorVO'].validate((valid) => {
        if (valid) {
          if (this.author.id) {
            // 更新
            this.updateAuthor()
          } else {
            // 新增
            this.addAuthor()
          }
        } else {
          return false
        }
      })
    },
    // 添加
    addAuthor() {
      // 调用接口，做添加操作
      authorApi.addAuthor(this.author).then(() => {
        // 添加成功
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        // 跳转到列表页
        this.$router.push({ path: '/author/list' })
      })
    },
    // 更新
    updateAuthor() {
      // 调用接口，做添加操作
      authorApi.updateAuthor(this.author).then((response) => {
        // 添加成功
        if (response.success) {
          this.$message({type: 'success', message: response.message})
          // 跳转到列表页
          this.$router.push({path: '/author/list'})
        } else {
          this.$message({type: 'error', message: response.message})
        }
      })
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.$message({type: 'success', message: res.message})
        this.isNeedRemoveAvatar = true
        this.author.avatar = res.data.url
        this.localUrl = URL.createObjectURL(file.raw)
      } else {
        this.$message.error(res.message)
      }
    },
    reChooseAvatar() {
      this.avatarList = []
      this.localUrl = ''
    },
    beforeAvatarUpload(file) {
      // 判断是否要删除之前的图片
      if (this.isNeedRemoveAvatar) {
        const avatarName = this.author.avatar.substring(this.author.avatar.lastIndexOf('/') + 1)
        authorApi.deleteAuthorAvatarWithName(avatarName)
        this.author.avatar = ''
        this.isNeedRemoveAvatar = false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      const photoTypeList = ['png', 'jpg', 'jpeg', 'bmp']
      const photoType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isAcceptType = photoTypeList.indexOf(photoType) > -1
      if (!isAcceptType) {
        this.$message.error('上传头像图片只能是 PNG,JPG,BMP,JPEG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isAcceptType && isLt2M
    },
    imgSaveToUrl(file, fileList) {
      console.log(fileList)
      // 获取上传图片的本地URL，用于上传前的本地预览
      var URL = null
      if (window.createObjectURL !== undefined) {
        // basic
        URL = window.createObjectURL(file.raw)
      } else if (window.URL !== undefined) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(file.raw)
      } else if (window.webkitURL !== undefined) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(file.raw)
      }
      // 转换后的地址为 blob:http://xxx/7bf54338-74bb-47b9-9a7f-7a7093c716b5
      this.localUrl = URL
    },
    uploadAvatar() {
      if (this.localUrl === '') {
        this.$message({type: 'warning', message: '至少选择一张照片'})
      } else {
        this.$refs.avatar.submit()
      }
    }
    // close() {
    //   this.imageCropperShow = false
    //   this.cropperKey = this.cropperKey + 1
    // },
    // cropSuccess(data) {
    //   this.imageCropperShow = false
    //   this.author.avatar = data.url
    //   this.cropperKey = this.cropperKey + 1
    // }
  }
}
</script>

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
