<template>
  <div class="app-container">
    <h1>章节信息</h1>
    <el-steps :active="2" finish-status="success">
      <el-step title="填写作品基本信息" />
      <el-step title="添加章节视频" />
      <el-step title="完成" />
    </el-steps>

    <h1>章节信息</h1>
    <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
  </div>

</template>

<script>
export default {
  data() {
    return {
      active: 0,
      contentVO: {}
    }
  },
  created() {
    this.contentVO = this.$store.state.contentVO
  },
  mounted() {
  },
  methods: {
    pre() {
      this.$router.push({ path: '/content/add/1' })
    },
    next() {
      this.$router.push({ path: '/content/send/1' })
    }
  }
}
</script>

<style scoped>

</style>
