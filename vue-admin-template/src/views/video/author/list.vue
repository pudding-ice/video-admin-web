<template>
  <div class="app-container">
    <!-- 表格 -->
    <!--表单查询-->
    <el-form :inline="true" :model="authorQuery" class="demo-form-inline">
      <!--姓名-->
      <el-form-item label="姓名">
        <el-input v-model="authorQuery.name" placeholder="姓名" />
      </el-form-item>
      <!--下拉列表-->
      <el-form-item label="级别">
        <el-select v-model="authorQuery.level" clearable placeholder="选择级别">
          <el-option label="特约创作者" value="0" />
          <el-option label="普通创作者" value="1" />
        </el-select>
      </el-form-item>
      <!--日期选择-->
      <el-form-item>
        <el-date-picker
          v-model="authorQuery.begin"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="authorQuery.end"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择截止时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAuthorList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <!--绑定表格组件-->
    <el-table :data="list" border fit highlight-current-row>

      <el-table-column label="序号" min-width="5%" align="center">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" min-width="10%" align="center" />
      <el-table-column label="级别" prop="level" min-width="15%" align="center">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{ scope.row.level === 0 ? "普通创作者" : "管理员创作者" }}
        </template>
      </el-table-column>
      <el-table-column label="创作者简介" prop="introduction" min-width="30%" align="center" />
      <el-table-column label="添加时间" prop="gmtCreate" min-width="15%" />
      <el-table-column label="排序" prop="sort" min-width="5%" />
      <el-table-column label="操作" min-width="25%" align="center">
        <template slot-scope="scope">
          <!--修改的跳转  让其跳转到路由当中 编辑路由 页面和添加的是一样， 编辑当中是有参数
                      在定义一个编辑的路由
                  -->
          <router-link :to="'/author/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          &nbsp;
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAuthorWithId(scope.row.id)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      style="padding: 30px 0; text-align: center"
      background
      :current-page="current"
      :page-size="size"
      layout="total, prev, pager, next, jumper "
      :total="total"
      @current-change="getAuthorList"
    />
  </div>
</template>

<script>
import author from '@/api/video/author'

export default {
  name: 'List',
  data() { // 定义变量与初始值
    return {
      list: null, // 查询的结果集
      current: 1, // 当前页
      size: 5, // 每页多少条记录
      total: 0, // 总记录数
      authorQuery: {
        begin: null, //
        end: null
      } // 查询封装的对象
    }
  },
  created() { // 页面渲染之前会自动调用此方法
    this.getAuthorList()
  },
  methods: { // 自定义方法
    getAuthorList(current = 1) {
      this.current = current
      author.getAuthorListPage(this.current, this.size, this.authorQuery)
        .then(response => {
          // 处理请求成功
          this.list = response.data.list
          this.total = response.data.total
        })
    },
    resetData() { /* 清空查询的数据*/
      this.authorQuery = {} // 清空表单
      // 重新查询
      this.getAuthorList()
    },
    // 删除创作者
    deleteAuthorWithId(id) {
      // 用户提示
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除的api
        author.deleteAuthorWithId(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新加载数据
          this.getAuthorList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
