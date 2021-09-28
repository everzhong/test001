<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      layout="total, sizes,slot"
      :total="total"
      :small="small"
      :pager-count="5"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-button :disabled="firstDisabled" @click="toFirstPage" size="mini">首页</el-button>
    </el-pagination>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :total="total"
      :small="small"
      :pager-count="5"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
     <el-button :disabled="isLastDisabled" @click="toLastPage" size="mini">尾页</el-button>
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'prev, pager, next, slot,jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    small: {
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      totalPage: 0,
      firstDisabled: true
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    },
    isLastDisabled () {
      if(this.totalPage <= 0){
        return true;
      }
      return this.currentPage == this.totalPage ? true : false;
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { pageNum: this.currentPage, pageSize: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.firstDisabled = val == 1 ? true : false;
      this.$emit('pagination', { pageNum: val, pageSize: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    toFirstPage () {
      this.currentPage = 1;
      this.handleCurrentChange(1);
    },
    toLastPage () {
      this.currentPage = this.totalPage;
      this.handleCurrentChange(this.totalPage);
    }
  },
  watch:{
    total(n,o){
      if(n>0) {
        this.totalPage = Math.ceil(this.total / this.limit);
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
