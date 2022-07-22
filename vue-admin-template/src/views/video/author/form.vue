<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="作者名称">
        <el-input v-model="author.name" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number v-model="author.sort" controls-position="right" :min="0" />
      </el-form-item>

      <el-form-item label="级别">
        <el-select v-model="author.level" clearable placeholder="选择级别">
          <el-option label="特约创作者" value="0" />
          <el-option label="普通创作者" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="工作经历">
        <el-input v-model="author.career" />
      </el-form-item>

      <el-form-item label="创作者简介">
        <el-input v-model="author.intro" type="textarea" :rows="10" />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="false" type="primary" @click="saveClick()">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import authorApi from '@/api/video/author'
export default {
  data() {
    return {
      author: {
        sort: 0
      }
    }
  },
  methods: {
    saveClick() {
      // 保存   添加/更新
      this.addAuthor()
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
    }
  }
}
</script>

<style scoped>

</style>
