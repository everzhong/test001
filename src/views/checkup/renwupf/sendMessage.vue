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
    <div class="main" v-loading="loading">
      <el-table border :data="roleList">
        <el-table-column width="40px" align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="roleCheck"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="检查组编号" prop="jczbh" align="center"></el-table-column>
        <el-table-column label="检查组名称" prop="deptName" align="center"></el-table-column>
        <el-table-column label="检查组成员" prop="jczcy" align="center">
          <template slot-scope="scope">
            <span>{{formateNickName(scope.row.jczcy)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editRole(scope.row,scope.$index)">更改组成员</el-button>
            <el-button type="text" size="mini" @click="deleteRole(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      :title="isEditInner?'修改检查成员':'新增检查组'"
      :visible.sync="innerDialogShow"
      @close="innerBack"
      width="500px">
        <el-form size="small" inline :model="addGroup"  ref="innerForm">
          <el-form-item label="检查组编号" prop="jczbh">
            <el-input style="width:370px" v-model="addGroup.jczbh"></el-input>
          </el-form-item>
          <el-form-item label="检查组名称" prop="deptName">
            <el-input style="width:370px" v-model="addGroup.deptName" :disabled="isEditInner"></el-input>
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
                  <el-table-column property="nickName" label="人员姓名" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
              <div style="text-align:right;margin-top:10px">
                <el-button size="mini" type="primary" plain @click="$refs.tablePopover.doClose()">返回</el-button>
                <el-button size="mini" type="primary" @click="selectedRole">确定</el-button>
              </div>
              <el-select multiple :popper-append-to-body="false" slot="reference" style="width:370px" v-model="addGroup.jczcy">
                <el-option v-for="item in gridData" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>
        </el-form>
        <div slot="footer" class="msg-footer-inner">
          <el-button size="mini" type="primary" plain @click="innerBack">返回</el-button>
          <el-button size="mini" type="primary" @click="innerConfirm">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import {listDept,addDept,updateDept,delDept} from '@/api/system/dept.js'
import {updateRenwutwo} from '@/api/renwu/renwutwo.js'
import { listUser } from "@/api/system/user";

export default {
  name:'SendMessage',
  data(){
    return {
      loading:false,
      roleCheck:'',
      searchName:'',
      innerDialogShow:false,
      isEditInner:false,
      roleList:[],
      currentPage:1,
      total:0,
      pageSize:50,
      addGroup:{
        jczbh:'',
        deptName:'',
        jczcy:[]
      },
      roleSelection:[],
      gridData:[],
      editTarget:null,//更改组成员（哪一组）
    }
  },
  mounted(){
    this.getJanChaxz() //检查组
    this.getJanChacy() //检查组成员
  },
  methods:{
    async getJanChaxz(){
      this.loading = true
      try {
        const res = await listDept()
      if(res.code === 200) {
        this.roleList = res.data
      }
      } catch (error) { 
        console.log(error)
      }
      this.loading = false
    },
    async getJanChacy(){
      try {
        const res = await listUser({pageNum:1,pageSize: 10000})
      if(res.code === 200) {
        this.gridData = res.rows
      }
      } catch (error) { 
        console.log(error)
      }
    },
    handleQuery(){
      this.currentPage = 1
      this.getRoleList()
    },
    editRole(row,index){
      let chengyuan = null
      if(row.jczcy){
        chengyuan = typeof(row.jczcy)==="object"?row.jczcy:(JSON.parse(row.jczcy.replace(/'/g,'"').replace(/userId/g,'"userId"').replace(/nickName/g,'"nickName"')))
      }
      this.addGroup = {...row}
      this.addGroup.jczcy = []
      this.editTarget = index;
      if(chengyuan){
        chengyuan.forEach(item=>{
          let has = this.gridData.filter(subItem=>{
            return subItem.userId===item.userId
          })
          if(!(has&&has.length)){
            this.gridData.push(item)
          }
          this.addGroup.jczcy.push(item.userId*1)
        })
      }
      this.innerDialogShow = true
      this.isEditInner = true
    },
    deleteRole(row){
      this.$confirm('确定删除该检查组？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDept(row.deptId).then(res=>{
          if(res.code===200) {
            this.msgSuccess('删除成功')
            this.getJanChaxz();
          }
        })
      })
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
      // const role = this.roleList[random]
      this.roleCheck =  Math.floor(Math.random()*this.roleList.length)
    },
    confirm(){
      if(this.roleCheck!==''){
        this.$emit('on-confirm',this.roleList[this.roleCheck])
        this.cancel()
      } else {
        this.msgError('请选择一个小组')
      }
    },
    cancel(){
      this.options.show = false
    },
    addNewGroup(){
      this.innerDialogShow = true
      this.isEditInner = false
    },
    async innerConfirm(){
      if(this.addGroup.jczcy.length&&this.isEditInner) {
        const selected = []
        this.addGroup.jczcy.forEach(item=>{
          let has  = this.gridData.filter(sitem=>{
            return item == sitem.userId
          })
          selected.push(has[0])
        })
        this.roleList[this.editTarget].jczcy = [...selected]
      }
      const {jczbh,deptName,jczcy,deptId} = this.addGroup
      if(this.isEditInner){
        this.options.ids.forEach(id=>{
          updateRenwutwo({
            // parentId: 101,
            // jczbh,
            // deptName,
            id,
            deptId,
            jczid:jczcy.join(',')
          })
        })
        this.innerDialogShow=false
      } else {
        const res = await addDept({jczbh,deptName,parentId: 101,jczcy:jczcy.join(',')})
        if(res.code===200) {
          this.msgSuccess('新增成功')
          this.getJanChaxz()
          this.innerBack()
        }
      }
    },
    innerBack(){
      this.innerDialogShow=false
      this.addGroup = {
        jczbh:'',
        deptName:'',
        jczcy:[]
      }
    },
    selectedRole(){
      if(this.roleSelection.length<1){
        this.$message.warning({message:'请选择',showClose:true})
        return
      }
      const roleList = []
      this.roleSelection.forEach(item=>{
        roleList.push(item.userId)
      })
      this.addGroup.jczcy = Array.from(new Set([...this.addGroup.jczcy,...roleList]))
      this.$refs.tablePopover.doClose()
    },
    handleSelectionChange(val){
      this.roleSelection = val
    },
    formateNickName(jczcy){
      if(!jczcy){
        return ''
      }
      let cyObj = null
      const names = []
      if(typeof(jczcy)==="object"){
        cyObj = jczcy
      } else {
        const str = jczcy.replace(/'/g,'"').replace(/userId/g,'"userId"').replace(/nickName/g,'"nickName"')
        cyObj = JSON.parse(str)
      }
      cyObj.forEach(item=>{
        names.push(item.nickName)
      })
      return names.join('，')
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