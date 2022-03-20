<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <div class="left-info">总共{{total}}条&nbsp;&nbsp;显示{{viewIng}}条</div>
    <el-pagination
      class="pagination_1"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      layout="slot"
      :total="total"
      :small="small"
      :pager-count="5"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    <i v-if="currentPage!==1 && totalPage>1" class="slot-prev el-icon-arrow-left" @click="prevNextClick(1)"></i>
    </el-pagination>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :total="total"
      :small="small"
      :pager-count="5"
      :page-sizes="pageSizes"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    <i v-if="currentPage<totalPage && totalPage>1" class="slot-next el-icon-arrow-right" @click="prevNextClick(2)"></i>
     <!-- <el-button :disabled="isLastDisabled" @click="toLastPage" size="mini">尾页</el-button> -->
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
      default: 50
    },
    pageSizes: {
      type: Array,
      default() {
        return [50, 100, 200, 500]
      }
    },
    layout: {
      type: String,
      default: 'pager, slot, sizes,jumper'
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
      viewIng:0,
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
      this.calcView()
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.firstDisabled = val == 1 ? true : false;
      this.$emit('pagination', { pageNum: val, pageSize: this.pageSize })
      console.log(this.currentPage,this.totalPage,67676)
      this.calcView()
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
    },
    prevNextClick(type){
      if(this.currentPage>1 && type===1){
        this.currentPage--
      } else if(this.currentPage<this.totalPage && type===2){
        this.currentPage++
      }
      this.handleCurrentChange(this.currentPage);
    },
    calcView(){
      if(this.total>0){
        const viewStart = 1+this.limit*(this.currentPage-1)
        const viewEnd = this.currentPage<this.totalPage?this.limit*this.currentPage:this.currentPage===this.totalPage?this.total:0
       if(viewStart!==viewEnd){
          this.viewIng = `${viewStart}-${viewEnd}`
        }else if(viewStart){
          this.viewIng = viewStart
        }
      } else {
        this.viewIng = 0
      }
    }
  },
  watch:{
    total(n,o){
      if(n>0) {
        this.totalPage = Math.ceil(this.total / this.limit);
        this.calcView()
      }
    },

  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  padding: 10px 0;
  margin: 0 !important;
  height: 40px;
  line-height: 40px;
  background: #fff;
  width: 100%;
  &.fixed-bottom {
    padding:10px 20px;
  }
  &::v-deep .el-pagination {
    font-size: 13px;
    line-height: normal;
    &.pagination_1 {
      width: 20px;
    }
    &.is-background {
      .btn-prev,
      .btn-next {
        background: #fff;
        border: 1px solid #e5e5e5;
        min-width: 20px;
        height: 20px;
        margin: 0 5px;
      }
    }
    .el-select .el-input {
      width: 85px;
    }
    .el-input--mini .el-input__inner {
      height: 20px;
      line-height: 20px;
      padding-right: 15px;
      padding-left: 5px;
    }
    .el-pagination__editor.el-input .el-input__inner,
    button,
    .el-pagination__jump,
    .el-pagination__sizes,
    .el-pagination__total,
    .el-select .el-input .el-select__caret {
      height: 20px;
      line-height: 20px;
    }
    &.pagination_1 {
      margin-right: 5px;
    }
    .pagination-container.hidden {
      display: none;
    }
    .slot-prev,.slot-next {
      display: inline-block;
      width: 20px;
      line-height: 20px;
      height: 20px;
      text-align: center;
      border: 1px solid #e5e5e5;
      cursor: pointer;
    }
    .slot-next {
      margin:0 10px 0 5px;
    }
  }
  .left-info {
    font-size: 13px;
    color: #606266;
    line-height: 20px;
    text-align: left;
    width: 100%;
    padding-right: 15px;
  }
}

::v-deep .el-pager li {
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
  margin: 0;
  min-width: 18px;
  box-sizing: border-box;
} 
::v-deep .el-pagination.is-background .el-pager li {
  box-sizing: border-box;
  background-color: #fff;
  min-width: 18px;
  margin: 0 1px;
  border: 1px solid transparent;
  color: #303313;
  font-weight: normal;

}
::v-deep .el-pagination.is-background .el-pager li:not(.active) {
  &:hover {
    color: #1b65b9;
    border: 1px solid #1b65b9;
  }
}

</style>
