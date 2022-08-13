<template>
  <div class="app-container">
    <h1 align="center">章节信息</h1>
    <el-steps :active="active" finish-status="success">
      <el-step title="填写作品基本信息"/>
      <el-step title="添加章节视频"/>
      <el-step title="完成"/>
    </el-steps>

    <!-- 章节 -->
    <div class="custom-tree-container">
      <div class="block">
        <el-button type="primary" style="margin-top: 10px;margin-bottom: 10px;" @click="appendChapter">添加章节</el-button>
        <el-button type="success" style="margin-top: 10px;margin-bottom: 10px;" @click="cacheChapterTree">保存当前编辑
        </el-button>
        <el-tree
          :data="chapterTree"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :props="{label:'title'}"
        >

          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                v-show="data.children"
                type="text"
                size="mini"
                @click="() => appendContentVideo(data)"
              >
                添加小节
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(node, data)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    <div style="margin-top: 15px;">
      <!--      新增章节-->
      <el-dialog
        title="请输入章节信息"
        :visible.sync="isShowChapterForm"
        width="30%"
      >
        <el-form
          ref="chapterFormData"
          label-width="100px"
          :model="chapterFormData"
          class="demo-ruleForm"
          :rules="rules"
        >
          <el-form-item
            label="章节名"
            prop="title"
          >
            <el-input v-model="chapterFormData.title" autocomplete="off"/>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sort"
          >
            <el-input v-model.number="chapterFormData.sort" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeChapterForm">取 消</el-button>
          <el-button type="primary" @click="addChapter('chapterFormData')">确 定</el-button>
        </span>
      </el-dialog>
      <!--      新增小节-->
      <el-dialog
        v-loading="isLoading"
        title="请输入小节信息"
        :visible.sync="isShowContentVideoForm"
        element-loading-text="正在上传中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.6)"
        width="30%"
      >
        <el-form
          ref="contentVideoFormData"
          label-width="100px"
          :rules="rules"
          :model="contentVideoFormData"
          class="demo-ruleForm"
        >
          <el-form-item
            label="小节名"
            prop="title"
          >
            <el-input v-model="contentVideoFormData.title"/>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sort"
          >
            <el-input v-model.number="contentVideoFormData.sort"/>
          </el-form-item>
          <el-form-item
            label="上传视频"
            prop="video"
          >
            <!-- 上传视频 -->
            <el-upload
              :on-success="handleVodUploadSuccess"
              :on-remove="handleVodRemove"
              :before-remove="beforeVodRemove"
              :before-upload="beforeVodUpload"
              :on-exceed="handleUploadExceed"
              :on-progress="uploadVideoProcess"
              :file-list="fileList"
              :action="BASE_API+'/service_vod/vod/upload'"
              :limit="1"
              class="avatar-uploader"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
            <!-- 进度条 -->
            <el-progress v-if="isShowProgress" :percentage="loadProgress"/>
            <el-tooltip placement="right-end">
              <el-button size="small" type="warning">格式要求</el-button>
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeContentVideoForm">取 消</el-button>
          <el-button type="primary" @click="addContentVideo('contentVideoFormData')">确 定</el-button>
        </span>
      </el-dialog>
      <!--      编辑小节表单-->
      <el-dialog
        v-loading="isLoading"
        title="编辑信息"
        element-loading-text="正在上传中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :visible.sync="isShowEditVideoForm"
        width="30%"
      >
        <el-form ref="editFormData" label-width="100px" :rules="rules" :model="editFormData" class="demo-ruleForm">
          <el-form-item
            label="名称"
            prop="title"
          >
            <el-input v-model="editFormData.title"/>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sort"
          >
            <el-input v-model.number="editFormData.sort"/>
          </el-form-item>
          <el-form-item
            v-show="!editFormData.children"
            label="上传视频"
            prop="video"
          >
            <!-- 上传视频 -->
            <el-upload
              :on-success="handleEditVodUploadSuccess"
              :on-remove="handleEditVodRemove"
              :before-remove="beforeVodRemove"
              :before-upload="beforeVodUpload"
              :on-exceed="handleUploadExceed"
              :on-progree="uploadVideoProcess"
              :file-list="fileList"
              :action="BASE_API+'/service_vod/vod/upload'"
              :limit="1"
              class="avatar-uploader"
            >
              <i size="small" class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
            <!-- 进度条 -->
            <el-progress v-if="isShowProgress" :percentage="loadProgress"/>
            <el-tooltip placement="right-end">
              <el-button size="small" type="warning">格式要求</el-button>
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
            </el-tooltip>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditForm">取 消</el-button>
          <el-button type="primary" @click="addEdit('editFormData')">确 定</el-button>
        </span>
      </el-dialog>
      <!--      编辑章节表单-->
      <el-dialog
        title="编辑章节信息"
        :visible.sync="isShowEditChapterForm"
        width="30%"
        :before-close="closeEditChapterForm"
      >
        <el-form ref="editChapterFormData" label-width="100px" :rules="rules" :model="chapterFormData"
                 class="demo-ruleForm">
          <el-form-item
            label="名称"
            prop="title"
          >
            <el-input v-model="chapterFormData.title"/>
          </el-form-item>
          <el-form-item
            label="排序"
            prop="sort"
          >
            <el-input v-model.number="chapterFormData.sort"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditChapterForm">取 消</el-button>
          <el-button type="primary" @click="updateChapterForm('editChapterFormData')">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import chapter from '@/api/video/chapter'
import vodApi from '@/api/video/vod'
import videoApi from '@/api/video/video'

export default {
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value === '' || value.trim().length === 0) {
        callback(new Error('名称不能为空并且不能全为空格'))
      } else {
        if (this.ruleForm.title !== '') {
          this.$refs.ruleForm.validateField('title')
        }
        callback()
      }
    }
    var validateSort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('排序不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('排序必须是数字'))
      }
      if (value < 0) {
        callback(new Error('排序不能小于0'))
      } else {
        if (this.ruleForm.sort !== '') {
          this.$refs.ruleForm.validateField('sort')
        }
        callback()
      }
    }
    var validateVideo = (rule, value, callback) => {
      if (this.fileList.length === 0) {
        callback(new Error('没有上传视频'))
      }
      if (this.fileList.length > 0) {
        callback()
      }
    }
    return {
      ruleForm: {
        title: '',
        sort: ''
      },
      rules: {
        title: [
          {validator: validateTitle, trigger: 'blur'}
        ],
        sort: [
          {validator: validateSort, trigger: 'blur'}
        ],
        video: [
          {validator: validateVideo, trigger: 'blur'}
        ]
      },
      id: 1000,
      active: 2,
      contentVO: {},
      contentId: null, // 作品ID
      chapterTree: null,
      isShowChapterForm: false,
      chapterFormData: {
        title: '',
        sort: ''
      },
      isShowContentVideoForm: false,
      contentVideoFormData: {
        title: '',
        sort: 0,
        videoSourceId: null,
        videoOriginalName: null
      },
      isShowEditVideoForm: false,
      isShowEditChapterForm: false,
      editFormData: {
        title: '',
        sort: '',
        children: [],
        videoSourceId: null,
        videoOriginalName: null
      },
      contentVideoNodeData: {},
      chapterNodeData: {},
      fileList: [], // 上传文件列表
      BASE_API: process.env.VUE_APP_BASE_API,
      isLoading: false,
      isRejectedType: false, // 判断上传的文件格式是否符合规范
      loadProgress: 0, // 动态显示进度条
      isShowProgress: false // 关闭进度条
    }
  },
  created() {
    this.contentVO = this.$store.state.contentVO
    this.chapterTree = this.$store.state.chapterTree
    // 获取路由当中的id
    if (this.$route.params && this.$route.params.id) {
      // 获取当前作品id
      this.contentId = this.$route.params.id
      // 请求嵌套数据
      if (this.chapterTree == null) {
        // vuex中没有章节,再到数据库中去取
        this.getChapterTree(this.contentId)
      }
    }
  },
  methods: {
    // 树控件相关方法
    closeChapterForm() {
      this.resetChapterForm()
      this.isShowChapterForm = false
    },
    closeEditChapterForm() {
      this.chapterFormData.title = ''
      this.chapterFormData.sort = ''
      this.isShowEditChapterForm = false
    },
    updateChapterForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.chapterFormData
          this.chapterNodeData.title = data.title
          this.chapterNodeData.sort = data.sort
          this.closeEditChapterForm()
        } else {
          return false
        }
      })
    },
    addChapter(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.chapterTree == null) {
            this.chapterTree = []
          }
          const newChild = {title: this.chapterFormData.title, sort: this.chapterFormData.sort, children: []}
          this.chapterTree.push(newChild)
          this.isShowChapterForm = false
          this.$message({
            type: 'success',
            message: '新增章节: ' + this.chapterFormData.title
          })
          this.resetChapterForm()
        } else {
          return false
        }
      })
    },
    resetChapterForm() {
      this.chapterFormData = {}
    },
    appendChapter() {
      this.isShowChapterForm = true
    },

    closeContentVideoForm() {
      this.resetContentVideoForm()
      this.isShowContentVideoForm = false
    },
    addContentVideo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.contentVideoNodeData
          const newChild = {
            title: this.contentVideoFormData.title,
            sort: this.contentVideoFormData.sort,
            videoSourceId: this.contentVideoFormData.videoSourceId,
            videoOriginalName: this.contentVideoFormData.videoOriginalName
          }
          data.children.push(newChild)
          console.log(data)
          this.$message({
            type: 'success',
            message: '新增小节: ' + this.contentVideoFormData.title
          })
          this.closeContentVideoForm()
        } else {
          return false
        }
      })
    },
    resetContentVideoForm() {
      this.contentVideoFormData = {}
      this.fileList = []
    },
    appendContentVideo(data) {
      this.resetContentVideoForm()
      this.contentVideoNodeData = data
      this.isShowContentVideoForm = true
    },
    getChapterTree(contentId) {
      if (contentId === null || contentId === '') {
        return
      }
      chapter.getChapterTree(contentId).then(res => {
        const data = res.data
        console.log(data)
        this.chapterTree = data.chapterTree
      })
    },

    closeEditForm() {
      this.isShowEditVideoForm = false
      this.editFormData = {}
    },
    addEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = this.contentVideoNodeData
          data.sort = this.editFormData.sort
          data.title = this.editFormData.title
          this.closeEditForm()
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
        } else {
          console.log('编辑失败')
          return false
        }
      })
    },
    edit(node, data) {
      console.log(data)
      if (data.children != null) {
        // 父结点,有孩子,编辑章节
        this.chapterNodeData = data
        this.chapterFormData = {...data}
        this.isShowEditChapterForm = true
      } else {
        // 没有孩子,编辑小节
        this.contentVideoNodeData = data
        this.editFormData = {...data}
        if (data.videoSourceId != null && data.videoSourceId !== '') {
          this.editFormData.videoOriginalName = data.videoOriginalName
          this.editFormData.videoSourceId = data.videoSourceId
          this.fileList = [{'name': this.editFormData.videoOriginalName}]
        }
        this.isShowEditVideoForm = true
      }
    },

    remove(node, data) {
      console.log(data)
      if (data.children !== undefined) {
        this.$confirm('删除章节会删除章节下的所有小节视频,是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapter.deleteChapterVideoWithChapterId(data.id).then(response => {
            if (response.success) {
              this.$message({type: 'success', message: response.message})
            } else {
              this.$message({type: 'warning', message: response.message})
            }
          })
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$confirm('是否要删除小节?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          videoApi.deleteVideoWithId(data.videoSourceId).then(response => {
            if (response.success) {
              this.$message({type: 'success', message: response.message})
            } else {
              this.$message({type: 'warning', message: response.message})
            }
          })
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 上传视频方法
    // 自动上传成功回调
    handleVodUploadSuccess(response, file, fileList) {
      // 加载标记设为false
      this.isLoading = false
      // 获取当前上传视频ID
      this.contentVideoFormData.videoSourceId = response.data.videoId
      // 获取当前上传视频标题
      this.contentVideoFormData.videoOriginalName = file.name
      // 设置文件名回显
      this.fileList = [{'name': this.contentVideoFormData.videoOriginalName}]
    },
    handleEditVodUploadSuccess(response, file, fileList) {
      // 加载标记设为false
      this.isLoading = false
      // 获取当前上传视频ID
      this.editFormData.videoSourceId = response.data.videoId
      // 获取当前上传视频标题
      this.editFormData.videoOriginalName = file.name
      // 设置文件名回显
      this.fileList = [{'name': this.editFormData.videoOriginalName}]
    },
    // 已经超过了指定数量时, 调用此方法
    handleUploadExceed(files, fileList) {
      this.$message.warning('请先删除已上传的视频')
    },
    // 删除之前提示信息
    beforeVodRemove(file, fileList) {
      if (this.isRejectedType) return
      return this.$confirm(`确定删除 ${file.name}？`)
    },
    // 上传之前提示信息
    beforeVodUpload(file) {
      this.isLoading = true
      // 限制文件格式类型
      const isAcceptType = this.isAcceptType(file)
      if (!isAcceptType) {
        this.$message({
          message: '只能上传指定视频格式',
          type: 'error'
        })
        this.isLoading = false
        this.isRejectedType = true
        return false
      }
      // 限制文件上传大小
      const isAcceptSize = this.isAcceptSize(file)
      if (!isAcceptSize) {
        this.$message({
          message: '视频大小超过1G',
          type: 'error'
        })
        this.isLoading = false
        this.isRejectedType = true
        return false
      }
      // 通过格式检查,就是符合规范的视频
      this.isRejectedType = false
    },
    // 删除小节视频
    handleVodRemove(file, fileList) {
      if (this.isRejectedType) return
      vodApi.deleteVodById(this.contentVideoFormData.videoSourceId).then(response => {
        // 清空当前小节视频id
        this.contentVideoFormData.videoSourceId = ''
        // 清空当前小节视频标题
        this.contentVideoFormData.videoOriginalName = ''
        this.fileList = []
        this.$message({
          type: 'success',
          message: response.message
        })
      })
    },
    handleEditVodRemove(file, fileList) {
      if (this.isRejectedType) return
      vodApi.deleteVodById(this.editFormData.videoSourceId).then(response => {
        // 清空当前小节视频id
        this.editFormData.videoSourceId = ''
        // 清空当前小节视频标题
        this.editFormData.videoOriginalName = ''
        this.fileList = []
        this.$message({
          type: 'success',
          message: response.message
        })
      })
    },
    // 判断选择的文件是否是规定的视频格式
    isAcceptType(file) {
      // 限制文件格式类型
      const fileTypeList = ['3GP', 'ASF', 'AVI', 'DAT', 'DV', 'FLV', 'F4V', 'GIF', 'M2T', 'M4V', 'MJ2', 'MJPEG', 'MKV', 'MOV', 'MP4',
        'MPE', 'MPG', 'MPEG', 'MTS', 'OGG', 'QT', 'RM', 'RMVB', 'SWF', 'TS', 'VOB', 'WMV', 'WEBM']
      const fileType = file.name.split('.')[1].toUpperCase()
      const isAcceptType = fileTypeList.indexOf(fileType) > -1
      if (isAcceptType) {
        return true
      } else {
        return false
      }
    },
    // 判断选择的文件是否不超过大小限制
    isAcceptSize(file) {
      return file.size / 1024 / 1024 / 1024 < 1
    },
    // 上传进度
    uploadVideoProcess(event, file, fileList) {
      this.isShowProgress = true // 显示进度条
      this.loadProgress = parseInt(event.percent) // 动态获取文件上传进度
      if (this.loadProgress >= 100) {
        this.loadProgress = 100
        setTimeout(() => {
          this.isShowProgress = false
        }, 1000) // 一秒后关闭进度条
      }
    },
    pre() {
      this.$router.push({path: '/content/add/' + this.contentId})
    },
    next() {
      // 如果树为空,不允许到下一页
      console.log(this.chapterTree)
      let notEmpty = false
      // 章节树为空
      if (this.chapterTree == null || this.chapterTree.length === 0) {
        this.$notify.error({
          title: '错误',
          message: '请至少添加一个章节'
        })
        return
      }
      // 判断章节树中是否存在小节
      for (let i = 0; i < this.chapterTree.length; i++) {
        if (this.chapterTree[i].children.length > 0) {
          notEmpty = true
          break
        }
      }
      if (!notEmpty) {
        this.$notify.error({
          title: '错误',
          message: '请至少添加一个小节'
        })
        return
      }
      this.$store.commit('cacheChapter', this.chapterTree)
      this.$router.push({path: '/content/send/' + this.contentId})
    },
    cacheChapterTree() {
      this.$store.commit('cacheChapter', this.chapterTree)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    }
  }
}

</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
}

</style>

