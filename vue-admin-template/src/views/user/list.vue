<template>
  <div class="app-container">
    <!-- 表格 -->
    <!--表单查询-->
    <el-form :inline="true" :model="userQuery" class="demo-form-inline">
      <!--姓名-->
      <el-form-item label="昵称">
        <el-input v-model="userQuery.nickname" placeholder="昵称"/>
      </el-form-item>
      <!--下拉列表-->
      <el-form-item label="角色">
        <el-select v-model="userQuery.role" clearable placeholder="选择角色">
          <el-option label="学生" value="1"/>
          <el-option label="老师" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="userQuery.sex" clearable placeholder="选择性别">
          <el-option label="女" value="1"/>
          <el-option label="男" value="2"/>
        </el-select>
      </el-form-item>
      <!--日期选择-->
      <el-form-item>
        <el-date-picker
          v-model="userQuery.begin"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="userQuery.end"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择截止时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <!--绑定表格组件-->
    <el-table :data="list" border fit highlight-current-row>

      <el-table-column label="序号" min-width="5%" align="center">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickname" min-width="25%" align="center"/>
      <el-table-column label="年龄" prop="age" min-width="5%" align="center"/>
      <el-table-column label="角色" prop="role" min-width="5%" align="center">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{ scope.row.role === 1 ? "学生" : "老师" }}
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex" min-width="5%" align="center">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{ scope.row.sex === 1 ? "女" : "男" }}
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="mobile" min-width="10%" align="center"/>
      <el-table-column label="学习时长" prop="totalStudyTime" min-width="10%" align="center">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{ getStudyDuration(scope.row.totalStudyTime) }}
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="gmtCreate" min-width="15%"/>
      <el-table-column label="更新时间" prop="gmtModified" min-width="15%"/>
      <el-table-column label="操作" min-width="10%" align="center">
        <template slot-scope="scope">
          <!--修改的跳转  让其跳转到路由当中 编辑路由 页面和添加的是一样， 编辑当中是有参数
                      在定义一个编辑的路由
                  -->
          <!--          <router-link :to="'/author/edit/'+scope.row.id">-->
          <!--            <el-button v-if="hasBtnPermission('author.update')" type="primary" size="mini" icon="el-icon-edit">修改-->
          <!--            </el-button>-->
          <!--          </router-link>-->
          &nbsp;
          <el-button
            v-if="hasBtnPermission('user.remove')"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteUserWithId(scope.row.id)"
          >删除
          </el-button>
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
      @current-change="getUserList"
    />
  </div>
</template>

<script>
import user from '@/api/user/portal-user'
import {hasBtnPermission} from '@/utils/button-control'

export default {
  name: 'List',
  data() { // 定义变量与初始值
    return {
      list: null, // 查询的结果集
      current: 1, // 当前页
      size: 5, // 每页多少条记录
      total: 0, // 总记录数
      userQuery: {
        nickname: '',
        role: '',
        sex: '',
        begin: null, //
        end: null
      } // 查询封装的对象
    }
  },
  created() { // 页面渲染之前会自动调用此方法
    this.getUserList()
  },
  methods: { // 自定义方法
    hasBtnPermission,
    getStudyDuration(second) {
      const hour = parseInt(Number(second) / 3600)
      const minute = parseInt((second - hour * 3600) / 60)
      return hour + ' 小时 ' + minute + ' 分钟'
    },
    getUserList(current = 1) {
      this.current = current
      user.getUserListPage(this.current, this.size, this.userQuery)
        .then(response => {
          // 处理请求成功
          this.list = response.data.list
          this.total = response.data.total
        })
    },
    resetData() { /* 清空查询的数据*/
      this.userQuery = {} // 清空表单
      // 重新查询
      this.getUserList()
    },
    // 删除创作者
    deleteUserWithId(id) {
      // 用户提示
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除的api
        user.deleteUserWithId(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新加载数据
          this.getUserList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
