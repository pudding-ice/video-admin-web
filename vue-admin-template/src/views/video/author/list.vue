<template>
  <div class="app-container">
    <!-- 表格 -->
    <!--绑定表格组件-->
    <el-table :data="list" border fit highlight-current-row>

      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="100" align="center"/>
      <el-table-column label="级别" prop="level" width="100">
        <template slot-scope="scope">  <!--通过slot拿到表格当中绑定的数据-->
          {{scope.row.level === 0 ? "普通创作者" : "管理员创作者"}}
        </template>
      </el-table-column>
      <el-table-column label="创作者简介" prop="intro"  />
      <el-table-column label="添加时间" prop="gmtCreate"  width="160"/>
      <el-table-column label="排序" prop="sort"  width="60" />
      <el-table-column label="操作" width="200" align="center">
        <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
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
  name: 'list',
  data(){  //定义变量与初始值
    return {
      list:null ,//查询的结果集
      current: 1, //当前页
      size: 5, //每页多少条记录
      total:0, //总记录数
      authorQuery:{}  //查询封装的对象
    }
  },

  methods:{   //自定义方法
    getAuthorList(current=1){
      this.current = current
      author.getAuthorListPage(this.current,this.size,this.authorQuery)
        .then(response => {
          //处理请求成功
          this.list = response.data.list
          this.total = response.data.total
        });
    }
  },

  created() {  //页面渲染之前会自动调用此方法
    this.getAuthorList();
  }

}
</script>

<style scoped>

</style>
