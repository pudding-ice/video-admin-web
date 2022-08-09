<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="作品分类" prop="categoryId">
        <div class="block">
          <el-cascader
            v-model="contentQuery.categoryId"
            placeholder="请选择分类"
            clearable
            :options="categoryTree"
            :props="{ value: 'id', expandTrigger: 'hover' }"
          />
        </div>
      </el-form-item>
      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="contentQuery.title" clearable placeholder="作品标题"/>
      </el-form-item>
      <!-- 作者 -->
      <el-form-item>
        <el-select
          v-model="contentQuery.authorId"
          clearable
          placeholder="请选择作者"
        >
          <el-option
            v-for="author in authorList"
            :key="author.id"
            :label="author.name"
            :value="author.id"
          />
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getData(1)">查询</el-button>
      <el-button type="warning" icon="el-icon-search" @click="resetData">清空</el-button>
    </el-form>
    <el-row :gutter="24">
      <el-col v-for="item in list" :span="6">
        <div class="grid-content bg-purple">
          <img :src="item.cover" alt="scope.row.title" width="100%" height="180px">
          <a href="#" style="font-size: 14px; color: #333">{{ item.title }}</a>
          <p style="margin-top: 0px">
            <router-link :to="'/content/add/'+item.id">
              <el-button v-if="hasBtnPermission('content.update')" type="text" size="mini" icon="el-icon-edit">编辑作品信息
              </el-button>
            </router-link>
            <el-button
              v-if="hasBtnPermission('content.remove')"
              style="margin-left: 10px"
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteContentById(item.id)"
            >删除
            </el-button>
          </p>
          <p style="font-size: 14px; color: red; margin-top: -15px; ">
            价格: {{ Number(item.price) === 0 ? '免费' : '¥' + item.price.toFixed(2) }}
          </p>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="size"
      :total="total"
      style="padding: 30px 0; text-align: center; margin-top: 30px;  "
      layout="total, prev, pager, next, jumper"
      @current-change="getData"
    />
  </div>
</template>

<script>
import categoryApi from '@/api/video/category'
import contentApi from '@/api/video/content'
import {hasBtnPermission} from '@/utils/button-control'

export default {
  data() {
    return {
      categoryTree: [],
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      current: 1, // 页码
      size: 10, // 每页记录数
      contentQuery: {
        categoryId: null,
        title: null,
        authorId: null
      }, // 查询条件
      authorList: [] // 作者列表
    }
  },
  created() {
    this.getCategoryTree()
    this.getAuthorList()
    this.getData(1)
  },
  methods: {
    hasBtnPermission,
    // 加载所有的分类
    getCategoryTree() {
      categoryApi.getCategoryTree().then((response) => {
        if (response.success) {
          this.categoryTree = response.data.categoryTree
        } else {
          this.$message(response.message)
        }
      })
    },
    getAuthorList() {
      contentApi.getAuthorList().then((response) => {
        this.authorList = response.data.authorList
      })
    },
    deleteContentById(id) {
      // debugger
      this.$confirm('真的的要删除该 作品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return contentApi.deleteContentById(id)
      }).then(() => {
        this.getData(1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    getData(current) {
      this.current = current
      contentApi.getContentPageList(current, this.size, this.contentQuery).then(response => {
        this.list = response.data.contentList
        this.total = response.data.total
      })
    },
    resetData() {
      this.contentQuery = {}
      this.getData(1)
    }
  }
}
</script>

<style scoped>
.app-container {
  width: 1260px;
}

.el-col {
  margin-top: 10px;
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 250px;

}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
