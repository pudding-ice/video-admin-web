<template>
  <div class="app-container">
    <h1>最终发布</h1>

    <el-steps :active="3" finish-status="success">
      <el-step title="填写作品基本信息" />
      <el-step title="添加章节视频" />
      <el-step title="完成" />
    </el-steps>

    <el-button style="margin-top: 12px;" @click="pre">上一步</el-button>
    <el-button style="margin-top: 12px;">发布</el-button>
  </div>

</template>

<script>
export default {
  data() {
    return {
      active: 0
    }
  },

  methods: {
    pre() {
      this.$router.push({ path: '/content/chapter/1' })
    }
  }
}
</script>

<style scoped>

</style>
