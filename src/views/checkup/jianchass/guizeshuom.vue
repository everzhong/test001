<template>
  <el-dialog 
  class="msg-dialog"
  title="规则说明"
  :visible.sync="options.show"
  width="800px">
    <el-form class="flex out-form" inline size="small">
      <div>
        <el-form-item label="规则名称：">
          <el-input type="text" clearable v-model="searchName" style="width:270px" @change="handleQuery"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item><el-button size="mini" type="primary">查询</el-button></el-form-item>
        <el-form-item style="margin-right:0"><el-button size="mini" type="primary" plain >重置</el-button></el-form-item>
      </div>
    </el-form>
    <div class="main">
        <el-table border :data="roleList">
          <el-table-column width="40px" align="center">
            <template slot-scope="scope">
              <el-radio :label="scope.row.id" v-model="roleCheck"></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="规则名称" prop="gzmc" align="center"></el-table-column>
          <el-table-column label="规则描述" prop="jczmc" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="paganation">
        <el-pagination
          v-if="total>0"
          small
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[50, 100, 150, 200]"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
  </el-dialog>
</template>
<script>
export default {
  name:'Guizeshuom',
  data(){
    return{
      roleCheck:'',
      searchName:'',
      innerDialogShow:false,
      roleList:[],
      currentPage:1,
      total:0,
      pageSize:50,
      addGroup:{
        jczbh:'',
        jczmc:'',
        jczcy:[]
      },
      roleSelection:[]
    }
  },
  methods:{
    handleQuery(){
      this.currentPage = 1
      this.getRoleList()
      console.log(11)
    },
    
    handleSizeChange(val){
      this.pageSize = val
      this.getRoleList()
    },
    handleCurrentChange(val){
      this.currentPage = val
      this.getRoleList()
    },
    getRoleList(){

    },
    confirm(){
      console.log(this.roleCheck)
      this.cancel()
    },
    cancel(){
      this.options.show = false
    },
  },
  props:['options']
}
</script>
<style lang="scss" scoped>
.main {
  margin-top: 18px;
  max-height: 350px;
  overflow: auto;
  margin-bottom: 10px;
}
.paganation {
  text-align: right;
}
.msg-dialog {
&::v-deep  .el-dialog {
    .el-dialog__header {
      padding:10px 20px;
      border-bottom:1px solid #ebeef5;
      .el-dialog__title {
        font-size: 16px;
        color: #606266;
      }
    }
    .el-table--medium td {
      padding:5px 0;
    }
    .el-dialog__body {
      padding:15px 20px;
      .el-radio__label {
        display: none;
      }
    }
    .out-form .el-form-item {
      margin-bottom: 0;
    }
    .inner {
      .el-select-dropdown {
        display: none;
      }
      .el-form-item {
        margin-right: 0;
      }
      &::v-deep .el-table--medium td {
        padding:2px 0;
      }
    } 
    .out-form .el-form-item__label {
        padding-right: 0px;
      }
    .el-dialog__headerbtn {
      top:12px;
      cursor: pointer;
    }
  }
}
.flex {
  display: flex;
  justify-content: space-between;
}
</style>