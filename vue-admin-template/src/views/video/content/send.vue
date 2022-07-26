<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <h1>最终发布</h1>

    <el-steps :active="active" finish-status="success">
      <el-step title="填写作品基本信息"/>
      <el-step title="添加章节视频"/>
      <el-step title="完成"/>
    </el-steps>
    <div class="contentInfo">
      <img :src="previewObject.cover">
      <div class="main">
        <h2>{{ previewObject.title }}</h2>
        <p class="gray"><span>共{{ previewObject.contentNum }}总数</span></p>
        <p><span>所属分类：{{ previewObject.categoryId[0] }} — {{ previewObject.categoryId[1] }}</span></p>
        <p>作者：{{ previewObject.author }}</p>
        <h3 class="red">￥{{ previewObject.price }}</h3>
      </div>
    </div>
    <el-button type="primary" style="margin-top: 12px;" @click="pre">上一步</el-button>
    <el-button type="success" style="margin-top: 12px;" @click="sendContent">发布</el-button>
  </div>

</template>

<script>
import contentApi from '@/api/video/content'

export default {
  data() {
    return {
      timer: 0,
      loading: false,
      active: 3,
      previewObject: null,
      contentVO: null,
      chapterTree: null,
      contentId: null
    }
  },
  created() {
    this.getData()
    // 获取路由当中的id
    if (this.$route.params && this.$route.params.id) {
      // 获取当前作品id
      this.contentId = this.$route.params.id
    }
  },
  methods: {
    sendContent() {
      this.$confirm('是否要发布视频?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        // 判断作品封面是否上传
        if (this.contentVO.cover === null || this.contentVO.cover === undefined || this.contentVO.cover === '') {
          this.$message({type: 'error', message: '没有上传封面,请先上传封面'})
          this.loading = false
          return false
        }
        // 处理categoryId
        this.contentVO.categoryParentId = this.contentVO.categoryId[1]
        this.contentVO.categoryId = this.contentVO.categoryId[0]
        const contentChapterVO = {
          contentVO: this.contentVO,
          chapterTree: this.chapterTree
        }
        if (this.contentId !== '-1') {
          // 不是-1,更新操作
          contentApi.updateContentData(contentChapterVO).then((res) => {
            if (res.success) {
              this.$message({type: 'success', message: res.message})
              this.loading = false
            } else {
              this.$message({type: 'error', message: res.message})
              this.loading = false
              return false
            }
          })
        } else {
          contentApi.sendContentData(contentChapterVO).then((res) => {
            if (res.success) {
              this.$message({type: 'success', message: res.message})
              this.loading = false
            } else {
              this.$message({type: 'error', message: res.message})
              this.loading = false
              return false
            }
          })
        }
        this.$store.commit('update', null)
        this.$store.commit('cachePreViewObject', null)
        this.$store.commit('cacheChapter', null)
        this.$router.push({path: '/content/list'})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    getData() {
      this.contentVO = this.$store.state.contentVO
      this.chapterTree = this.$store.state.chapterTree
      this.previewObject = this.$store.state.preViewObject
    },
    pre() {
      this.$router.push({path: '/content/chapter/' + this.contentId})
    }
  }
}
</script>

<style scoped>
.contentInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #DDD;
  margin-bottom: 40px;
  position: relative;
}

.contentInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.contentInfo .main {
  margin-left: 520px;
}

.contentInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}

.contentInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.contentInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.contentInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>
