<template>
  <el-dialog 
  class="msg-dialog"
  title="派发检查组"
  :visible.sync="options.show"
  width="800px">
    <el-form class="flex out-form" inline size="small">
      <div>
        <el-form-item style="margin-right:25px"><el-button size="mini" type="primary" @click="radomSelect">随机选择</el-button></el-form-item>
        <el-form-item label="检查组名称：">
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
              <el-radio :label="scope.$index" v-model="roleCheck"></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="检查组编号" prop="jczbh" align="center"></el-table-column>
          <el-table-column label="检查组名称" prop="jczmc" align="center"></el-table-column>
          <el-table-column label="检查组成员" prop="jczcy" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="editRole(scope.row)">更改组成员</el-button>
              <el-button type="text" size="mini" @click="deleteRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="paganation">
        <el-pagination
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
    <div slot="footer" class="msg-footer flex">
      <el-button size="mini" type="primary" @click="addNewGroup">新增检查组</el-button>
      <div>
        <el-button size="mini" type="primary" @click="confirm">确定</el-button>
        <el-button size="mini" type="primary" plain @click="cancel">取消</el-button>
      </div>
    </div>
    <el-dialog
      :modal="false"
      :close-on-click-modal="false"
      class="msg-dialog inner"
      title="新增检查组"
      :visible.sync="innerDialogShow"
      width="500px">
        <el-form size="small" inline :model="addGroup">
          <el-form-item label="检查组编号" prop="jczbh">
            <el-input style="width:370px" v-model="addGroup.jczbh"></el-input>
          </el-form-item>
          <el-form-item label="检查组名称" prop="jczmc">
            <el-input style="width:370px" v-model="addGroup.jczmc"></el-input>
          </el-form-item>
          <el-form-item label="检查组成员" prop="jczcy">
            <el-popover
              ref="tablePopover"
              placement="bottom"
              width="500"
              popper-class="sys-popup"
              trigger="click">
              <div style="min-height:150px;max-height:210px;overflow:auto">
                <el-table :data="gridData" border="" class="sys-small-table" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="50" align="center" />
                  <el-table-column property="jgdm" label="承办机构ID" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column property="jgmc" label="承办机构名称" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column property="ryxm" label="人员姓名" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
              <div style="text-align:right;margin-top:10px">
                <el-button size="mini" type="primary" plain @click="$refs.tablePopover.doClose()">返回</el-button>
                <el-button size="mini" type="primary" @click="selectedRole">确定</el-button>
              </div>
              <el-select multiple :popper-append-to-body="false" slot="reference" style="width:370px" v-model="addGroup.jczcy">
                <el-option v-for="item in roleSelection" :key="item.jgdm" :value="item.jgdm" :label="item.ryxm"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>
        </el-form>
        <div slot="footer" class="msg-footer-inner">
          <el-button size="mini" type="primary" plain @click="innerDialogShow=false">返回</el-button>
          <el-button size="mini" type="primary" @click="innerConfirm">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
export default {
  name:'SendMessage',
  data(){
    return{
      roleCheck:'',
      searchName:'',
      innerDialogShow:false,
      roleList:[{
        id:'1',
        jczbh:'99898',
        jczcy:"张三,里斯",
        jczmc:'aaa小组'
      },{
        id:'2',
        jczbh:'AD2222',
        jczcy:"张三,里斯",
        jczmc:'aaa小组'
      }],
      gridData: [{
          jgdm: '11',
          ryxm: '王小虎',
          jgmc: '上海市普陀区金沙江路 1518 弄'
        }, {
          jgdm: '22',
          ryxm: '王小',
          jgmc: '上海市普陀区金沙江路 1518 弄'
        }],
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
    editRole(row){
      console.log(row)
      this.addGroup = {...row}
      this.addGroup.jczcy = row.jczcy.split(',')
      this.innerDialogShow = true
    },
    deleteRole(row){

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
    radomSelect(){
      const role = this.roleList[Math.floor(Math.random()*this.roleList.length)]
      this.roleCheck =  role.id
    },
    confirm(){
      this.$emit('on-confirm',this.roleList[this.roleCheck])
      this.cancel()
    },
    cancel(){
      this.options.show = false
    },
    addNewGroup(){
      this.innerDialogShow = true
    },
    innerConfirm(){

    },
    selectedRole(){
      if(this.roleSelection.length<1){
        this.$message.warning({message:'请选择',showClose:true})
        return
      }
      console.log(this.roleSelection,this.addGroup)
      this.roleSelection.forEach(item=>{
        this.addGroup.jczcy.push(item.jgdm)
      })
      this.$refs.tablePopover.doClose()
    },
    handleSelectionChange(val){
      this.roleSelection = val
    }
  },
  props:['options']
}
</script>
<style lang="scss" scoped>
.main {
  margin-top: 18px;
  height: 350px;
  overflow: auto;
  margin-bottom: 10px;
}
.paganation {
  text-align: right;
}
.msg-dialog {
  &.inner {
    margin-top: 15vh !important;
  }
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