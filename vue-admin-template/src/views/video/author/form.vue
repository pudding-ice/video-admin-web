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
          <el-option label="特约创作者" :value="0" />
          <el-option label="普通创作者" :value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="工作经历">
        <el-input v-model="author.career" />
      </el-form-item>

      <el-form-item label="创作者简介">
        <el-input v-model="author.introduction" type="textarea" :rows="10" />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="false" type="primary" @click="saveClick()">保存</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import authorApi from '@/api/video/author'
import message from 'element-ui'
export default {
  data() {
    return {
      author: {
        sort: 0
      }
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
      if (this.author.id) {
        // 更新
        this.updateAuthor()
      } else {
        // 新增
        this.addAuthor()
      }
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
          this.$message({ type: 'success', message: response.message })
          // 跳转到列表页
          this.$router.push({ path: '/author/list' })
        } else {
          this.$message({ type: 'error', message: response.message })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
