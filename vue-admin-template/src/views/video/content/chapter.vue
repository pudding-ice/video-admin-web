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
        <el-form ref="chapterFormData" label-width="100px" :model="chapterFormData" class="demo-ruleForm"
                 :rules="rules">
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
        title="请输入小节信息"
        :visible.sync="isShowContentVideoForm"
        width="30%"
      >
        <el-form ref="contentVideoFormData" label-width="100px" :rules="rules" :model="contentVideoFormData"
                 class="demo-ruleForm">
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
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeContentVideoForm">取 消</el-button>
          <el-button type="primary" @click="addContentVideo('contentVideoFormData')">确 定</el-button>
        </span>
      </el-dialog>
      <!--      编辑表单-->
      <el-dialog
        title="编辑信息"
        :visible.sync="isShowEditForm"
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
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditForm">取 消</el-button>
          <el-button type="primary" @click="addEdit('editFormData')">确 定</el-button>
        </span>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import chapter from '@/api/video/chapter'

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
        sort: ''
      },
      isShowEditForm: false,
      editFormData: {
        title: '',
        sort: '',
        children: []
      },
      contentVideoNodeData: {},
      chapterNodeData: {}
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
          const newChild = {title: this.contentVideoFormData.title, sort: this.contentVideoFormData.sort}
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
    },
    appendContentVideo(data) {
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
      this.isShowEditForm = false
      this.editFormData = {}
    },
    addEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.editFormData)
          if (this.editFormData.children != null) {
            // 父节点
            console.log('父节点修改')
            const data = this.chapterNodeData
            data.sort = this.editFormData.sort
            data.title = this.editFormData.title
          } else {
            console.log('子节点修改')
            const data = this.contentVideoNodeData
            console.log(data)
            data.sort = this.editFormData.sort
            data.title = this.editFormData.title
          }
          this.closeEditForm()
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
        } else {
          return false
        }
      })
    },
    edit(node, data) {
      console.log(data)
      if (data.children != null) {
        // 父结点,有孩子
        this.chapterNodeData = data
        this.editFormData = JSON.parse(JSON.stringify(data))
      } else {
        this.contentVideoNodeData = data
        this.editFormData = JSON.parse(JSON.stringify(data))
      }
      this.isShowEditForm = true
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
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

