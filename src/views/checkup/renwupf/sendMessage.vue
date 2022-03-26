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
        <el-table-column width="40px" align="center" fixed>
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="roleCheck"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="检查组编号" prop="jczbh" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="检查组名称" prop="deptName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="检查组成员" prop="jczcy" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{formateNickName(scope.row.jczcy)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"  fixed="right" align="center">
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
        <el-form size="small" inline :model="addGroup"  :rules="innerRules" ref="innerForm">
          <el-form-item label="检查组编号" prop="jczbh">
            <el-input style="width:365px" v-model="addGroup.jczbh"></el-input>
          </el-form-item>
          <el-form-item label="检查组名称" prop="deptName">
            <el-input style="width:365px" v-model="addGroup.deptName" :disabled="isEditInner"></el-input>
          </el-form-item>
          <el-form-item label="检查组成员" prop="jczcy">
            <el-popover
              ref="tablePopover"
              placement="bottom"
              width="600"
              popper-class="sys-popup"
              trigger="click">
              <div style="display:flex;align-items:center;margin-bottom:5px">
                <span style="font-size:12px">人员数：</span>
                <el-input min="2" size="mini" style="width:90px" v-model="randomCount" type="number"></el-input>
                <el-button type="primary" size="mini" style="margin-left:8px" @click="autoSelect">随机选择</el-button>
              </div>
              <div style="min-height:150px;max-height:270px;overflow:auto">
                <el-table ref="multipleTable" :data="gridData" border="" class="sys-small-table" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="50" align="center" fixed/>
                  <el-table-column property="jgdm" label="机构ID" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column property="jgmc" label="机构名称" align="center" show-overflow-tooltip></el-table-column>
                  <el-table-column property="roleName" label="人员类型" align="center" show-overflow-tooltip>
                    <!-- <template slot-scope="scope">
                      <span>{{scope.row.dept.leader}}</span>
                    </template> -->
                  </el-table-column>
                  <el-table-column property="nickName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
              <div style="text-align:right;margin-top:10px">
                <el-button size="mini" type="primary" plain @click="$refs.tablePopover.doClose()">返回</el-button>
                <el-button size="mini" type="primary" @click="selectedRole">确定</el-button>
              </div>
              <el-select multiple :popper-append-to-body="false" slot="reference" style="width:365px" v-model="addGroup.jczcy">
                <el-option v-for="item in gridData" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-popover>
          </el-form-item>
          <p style="padding:0;color:#999;padding-left:10px;margin:0">备注：需提前与医保基金监督执法部门确认后，方可进行相应执法人员的选择</p>
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
      randomCount:2,//默认随机选择2个人
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
      innerRules:{
        jczbh:[{ required: true, message: '请输入检查组编号', trigger: 'blur' }],
        deptName:[{ required: true, message: '请输入检查组名称', trigger: 'blur' }],
        jczcy:[{ required: true, message: '请选择检查组成员', trigger: 'change' }]
      }
    }
  },
  mounted(){
    this.getJanChaxz() //检查组
    this.getJanChacy() //检查组成员
  },
  methods:{
    handleSelectionChange (selection) {
      this.roleSelection = selection
    },
    randomObj (list,count) {
      if(list.length){
        const idxArr = []
        const selectObj = []
        const len = list.length - 1
        while (idxArr.length < count) {
          const idx = Math.round(Math.random() * (len - 0) + 0)
          if (idxArr.indexOf(idx) < 0) {
            idxArr.push(idx)
            selectObj.push(list[idx])
          }
        }
        return selectObj
      } else {
        return []
      }
    },
    autoSelect () {
      let jgRoleList = this.gridData.filter(item => {//4表示属于监管机构的人
        return item.roleId == 4
      })
      let selectRoleList = this.gridData.filter(item => {//9也是除2个监管机构的人之外需要随机选择的人
        return item.roleId == 9
      })

      let selected = []
      let otherObj = []
      if(!jgRoleList || jgRoleList.length==0){
        otherObj = this.randomObj(selectRoleList,this.randomCount*1)
      }else if(jgRoleList.length>2){
        selected = this.randomObj(jgRoleList,2)
        const left = jgRoleList.concat(selected).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
        })
        selectRoleList = [...selectRoleList,...left]//把roleId=4剩下未选择的人员添加到roleId=9列表中，一起作为剩余随机选择的列表
        otherObj = this.randomObj(selectRoleList,this.randomCount*1-selected.length)//剩下随机人员从roleId=9里面取
      } else {
        selected = jgRoleList
        otherObj = this.randomObj(selectRoleList,this.randomCount*1-selected.length)//剩下随机人员从roleId=9里面取
      }
      selected = [...selected,...otherObj]
      this.$refs.multipleTable.clearSelection()
      selected.forEach(element => {
        const tIdx = this.gridData.findIndex(data => {
          return data.roleId == element.roleId && data.userId == element.userId
        })
        this.$refs.multipleTable.toggleRowSelection(this.gridData[tIdx])
      })
    },
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
        const res = await listUser({pageNum:1,pageSize: 50000})
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
        chengyuan = typeof(row.jczcy)==="object"?row.jczcy:(JSON.parse(row.jczcy.replace(/'/g,'"').replace(/userId/g,'"userId"').replace(/nickName/g,'"nickName"').replace(/userName/g,'"userName"')))
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
      this.$refs['innerForm'].validate(async (valid) => {
        if (valid) {
          if(this.isEditInner) {
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
            const res = await updateDept({deptId,jczbh,parentId: 101,deptName})
            if(res.code===200){
              this.msgSuccess('更改成功')
              await this.getJanChaxz()
              const editIdx = this.roleList.findIndex(item=>{
                return item.deptId===this.addGroup.deptId
              })
              const jczList = []
              this.addGroup.jczcy.forEach(item=>{
                let targetZ = this.gridData.filter(subItem=>{
                  return item===subItem.userId
                })
                targetZ.length && (jczList.push(targetZ[0]))
              })
              this.roleList[editIdx].jczcy = jczList
              this.options.ids.forEach(id=>{
                updateRenwutwo({
                  id,
                  deptId,
                  jczid:jczcy.join(',')
                })
              })
              this.innerDialogShow=false
            }
          } else {
            const res = await addDept({jczbh,deptName,parentId: 101,jczcy:jczcy.join(',')})
            if(res.code===200) {
              this.msgSuccess('新增成功')
              this.getJanChaxz()
              this.innerBack()
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
    formateNickName(jczcy){
      if(!jczcy){
        return ''
      }
      let cyObj = null
      const names = []
      if(typeof(jczcy)==="object"){
        cyObj = jczcy
      } else {
        const str = jczcy.replace(/'/g,'"').replace(/userId/g,'"userId"').replace(/nickName/g,'"nickName"').replace(/userName/g,'"userName"')
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