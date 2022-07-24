<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="categoryTree"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import cateApi from '@/api/category/category'
export default {

  data() {
    return {
      filterText: '',
      categoryTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getCategoryTree()
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getCategoryTree() {
      cateApi.getCategoryTree().then((response) => {
        if (response.success) {
          this.categoryTree = response.data.categoryTree
        } else {
          this.$message(response.message)
        }
      })
    }
  }
}
</script>

