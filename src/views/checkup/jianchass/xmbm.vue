<template>
  <el-popover
    ref="bmPopover"
    placement="bottom"
    width="680"
    popper-class="mxbm-popover"
    trigger="click"
    @show="handleShowPopover">
    <div class="table-close">
      <i class="el-icon-close" @click="closePopover"></i>
    </div>
    <section class="content">
      <el-row>
        <el-col :span="15">
          <div class="search-part">
            <span>明细项目编号</span><el-input v-model="searchMxxmbm" size="mini"></el-input>
          </div>
        </el-col>
        <el-col :span="3" :offset="4">
          <el-button @click="getList" style="margin-left:20px" size="mini" type="primary">搜索</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="searchMxxmbm='',getList()" size="mini" type="primary">重置</el-button>
        </el-col>
      </el-row>
      <div class="table-main" v-loading="loading">
        <el-table :data="tableData" @selection-change="handleSelectionChange" border  style="width:100%" height="100%">
          <el-table-column width="55" type="selection"></el-table-column>
          <el-table-column property="mxxmbm" label="明细项目编号"></el-table-column>
        </el-table>
      </div>
        <pagination
          style="float:left;width:587"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <el-button @click="popoConfirm" style="float:right;margin:11px 5px 0 0"  type="primary" size="mini">确定</el-button>
    </section>
    <el-button slot="reference" style="height:32px;width:100%;text-align:left;padding:0px 9px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">{{mxxmbm}}</el-button>
  </el-popover>
</template>
<script>
import { listXmbm } from '@/api/renwu/renwufour'

export default {
  name:'Xmbm',
  data(){
    return{
      loading:false,
      tableData:[],
      mxxmbm:'',
      searchMxxmbm:'',
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:50
      },
      selection:[]
    }
  },
  props:['gridData'],
  methods:{
    clear(){
      this.mxxmbm = ''
      this.$emit('onChecked',this.mxxmbm)
    },
    closePopover(){
      this.$refs.bmPopover.doClose()
    },
    handleShowPopover(){
      this.tableData.length===0 && (this.getList())
    },
    handleSelectionChange(val){
      this.selection = val
    },
    popoConfirm(){
      const bmList = this.selection.map(item=>`'${item.mxxmbm}'`)
      this.mxxmbm = bmList.join(',')
      this.$emit('onChecked',this.mxxmbm)
      this.closePopover()
    },
    async getList(){
      try {
        this.loading = true
        const res = await listXmbm({...this.bmQueryParams,rwpcid:this.$route.query.rwpcid,jgdm:this.$route.query.jgdm,mxxmbm:this.searchMxxmbm})
        if(res.code===200) {
          this.tableData = res.rows
          this.total =  res.total
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
  }
}
</script>
<style lang="scss">
.mxbm-popover {
  height: 460px;
  padding:0;
  .content {
    padding:0 15px 10px;
    height: calc(100% - 42px);
  }
  .table-close {
    height: 32px;
    line-height: 32px;
    text-align: right;
    margin-bottom: 10px;
    background-color: #f6f7f9;
    padding:0 10px;
    i {
      cursor: pointer;
    }
  }
  .search-part {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    span{
      display: block;
      width: 90px;
      flex-shrink: 0;
    }
  }
  .table-main {
    height: calc(100% - 80px);
    td,th {
      padding:5px 0 !important;
    }
  }
  .el-pagination__total {
    margin-right: 0px;
  }
  .el-pager li {
    margin: 0 2px !important;
  }
  .el-pagination button {
    padding:0 !important;
  }
  .pagination-container {
    padding:5px 0 !important
  }
}

</style>