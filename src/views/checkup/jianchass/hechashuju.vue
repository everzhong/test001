<template>
  <el-dialog
    class="hc-out-dialog"
    title="选择核查数据"
    :modal="true"
    :visible.sync="show"
    @closed="closeDrawer"
    width="90%">
      <el-form inline size="mini" :model="form" class="hc-form">
        <el-form-item label="明细项目编号">
          <el-input v-model="form.mxxmbm" clearable></el-input>
        </el-form-item>
        <el-form-item label="明细项目名称">
          <el-input v-model="form.mxxmmc" clearable></el-input>
        </el-form-item> <el-form-item label="通用名">
          <el-input v-model="form.tym" clearable></el-input>
        </el-form-item> <el-form-item label="明细项目类别">
          <el-select v-model="form.mxxmlb" clearable></el-select>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button plain @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button size="mini" type="primary" @click="setHechashuju">设为核查数据</el-button>
        <el-button size="mini" type="primary" @click="dialogHcVisible = true">新增诊疗相关耗材</el-button>
        <el-button size="mini" type="primary" @click="delHechashuju">删除诊疗相关耗材</el-button>
        <el-button v-if="this.$store.getters.roles[0]==='admin'" size="mini" type="primary" plain style="float:right">+新增相关诊疗项目</el-button>
      </div>
      <div style="display:flex;flex-direction:column;height:100%" v-loading="loading">
        <sTable class="hc-s-table" :data="gridData" :header="tableHeader" :fixedNum="1" @selection-change="handleSelectionChange">
          <el-table-column slot="fixed" type="selection" width="55" align="center"/>
        </sTable>
      </div>
      <pagination
        style="height:40px"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <el-dialog class="hc-dialog" append-to-body title="新增诊疗相关耗材" :visible.sync="dialogHcVisible" :modal="false" width="470px">
        <el-form :model="hCform" size="small" inline>
          <el-form-item label="明细项目名称">
            <el-input v-model="hCform.mxxmmc" autocomplete="off" style="width:77%;"></el-input>
          </el-form-item>
          <el-form-item label="相关诊疗项目">
            <el-input readonly v-model="hCform.xgzlxm" autocomplete="off" style="width:77%;margin-right:10px"></el-input>
            <el-button @click="selectXgzlxm" size="mini">选择...</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogHcVisible = false" size="mini">确 定</el-button>
          <el-button  @click="dialogHcVisible = false" size="mini">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog class="hc-add-dialog" append-to-body title="新增诊疗相关耗材" :visible.sync="dialogAddHcVisible" :modal="true" width="1000px">
          <div style="display:flex;flex-direction:column;height:100%" v-loading="addHcLoading">
            <sTable class="hc-s-table" :data="hcData" :header="tableHcHeader" :fixedNum="1">
              <el-table-column width="40px" label="序号" align="center" slot="fixed">
                <template slot-scope="scope">
                  <el-radio :label="scope.$index" v-model="roleCheck"></el-radio>
                </template>
              </el-table-column>
            </sTable>
            <pagination
            style="height:40px"
            :total="hcTotal"
            :page.sync="hcParams.pageNum"
            :limit.sync="hcParams.pageSize"
            @pagination="getHcList"
            />
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogAddHcVisible = false" size="mini">确 定</el-button>
              <el-button  @click="dialogAddHcVisible = false" size="mini">取 消</el-button>
            </div>
        </div>
      </el-dialog>
  </el-dialog>
</template>
<script>
import {getXgzlxm} from '@/api/renwu/renwuone.js'
import { listRenwufour, updateRenwufour, delRenwufour} from '@/api/renwu/renwufour'

export default {
  name:'Hechashuju',
  props:['isShow'],
  data(){
    return {
      show:false,
      dialogHcVisible:false,
      dialogAddHcVisible:false,
      gridData:[],
      hcData:[],
      tableHeader:[{
        label: '明细项目编号',
        prop: 'mxxmbm'
      },{
        label: '明细项目名称',
        prop: 'mxxmmc'
      },{
        label: '通用名',
        prop: 'tym'
      },{
        label: '明细项目单价(元)',
        prop: 'mxxmdj',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,3)
        }
      },{
        label: '明细项目单位',
        prop: 'mxxmdw',
      },{
        label: '明细项目数量',
        prop: 'mxxmsl'
      },{
        prop: 'mxxmbjsfy',
        label: '明细项目医保结算范围费用(元)',
        fixedWidth:-130,
        viewFun: (mxxmbjsfy)=>{
          return this.formatMoney(mxxmbjsfy,2)
        }  
      },{
        label: '明细项目类别',
        prop: 'mxxmlb'
      },{
        label: '相关诊疗项目',
        prop: 'xgzlxmmc'
      }],
      tableHcHeader:[{
        label: '明细项目编号',
        prop: 'mxxmbm'
      },{
        label: '明细项目名称',
        prop: 'mxxmmc'
      },{
        label: '通用名',
        prop: 'tym'
      },{
        label: '明细项目单价(元)',
        prop: 'mxxmdj',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,3)
        }
      },{
        label: '明细项目单位',
        prop: 'mxxmdw',
      },{
        label: '明细项目数量',
        prop: 'mxxmsl'
      },{
        prop: 'mxxmybjsfy',
        label: '明细项目医保结算范围费用(元)',
        fixedWidth:-130,
        viewFun: (mxxmybjsfy)=>{
          return this.formatMoney(mxxmybjsfy,2)
        }  
      },{
        label: '明细项目类别',
        prop: 'mxxmlb'
      }],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:50
      },
      hcTotal:0,
      hcParams:{
        pageNum:1,
        pageSize:50
      },
      form:{
        mxxmbm:'',
        mxxmmc:'',
        tym:'',
        mxxmlb:''
      },
      hCform:{
        mxxmmc:'',
        xgzlxm:''
      },
      roleCheck:'',
      addHcLoading:false,
      loading:false,
      selectHcIds:[]
    }
  },
  created(){
    this.show = this.isShow
    this.getList()
  },
  methods:{
    resetFrom(){
      this.form = {
        mxxmbm:'',
        mxxmmc:'',
        tym:'',
        mxxmlb:''
      }
      this.getList()
    },
    closeDrawer(){
      this.$emit('onClose')
    },
    setHechashuju(){
      if(this.selectHcIds.length===0){
        this.msgError('请至少选择一项');
        return 
      }
      const reqestList = []
      this.selectHcIds.forEach(id=>{
        reqestList.push(updateRenwufour({
          id,
          ischeck:1
        }))
      })
      this.loading = true
      Promise.all(reqestList).then(()=>{
        this.loading = false
        this.msgSuccess('操作成功')
        this.selectHcIds = []
        this.getList()
        this.$emit('update')
      }).catch(e=>{
        this.loading = false
      })
    },
    delHechashuju(){//删除相关耗材
      if(this.selectHcIds.length===0){
        this.msgError('请至少选择一项');
        return 
      }
      const reqestList = []
      this.selectHcIds.forEach(id=>{
        reqestList.push(delRenwufour(id))
      })
      this.loading = true
      Promise.all(reqestList).then(()=>{
        this.loading = false
        this.msgSuccess('删除成功')
        this.selectHcIds = []
        this.getList()
      }).catch(e=>{
        this.loading = false
      })
    },
    handleSelectionChange(selection){
      this.selectHcIds = selection.map(item=>item.id)
    },
    selectXgzlxm(){
      this.getHcList()
      this.dialogAddHcVisible = true
    },
    async getHcList(){//相关耗材
      this.addHcLoading = true
      try {
        const res = await getXgzlxm()
        if(res.code===200){
          this.hcTotal = res.total
          this.hcData = res.rows
        }
      } catch (error) {
        console.log(error)
      }
      this.addHcLoading = false
    },
    async getList(){//核查数据
      this.loading = true
      try {
        const res = await listRenwufour({
          ...this.form,
          ...this.queryParams,
          type:2,
          ischeck:0,
          jgdm:this.$route.query.jgdm,
          rwpcid:this.$route.query.rwpcid,
        })
        if(res.code===200){
          this.gridData = res.rows
          this.total = res.total
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
  }
}
</script>
<style lang="scss" scoped>
.fix-table {
  display: flex;
  flex-direction: column;
  &::v-deep .el-table {
    display: flex;
    flex:1 1 0px;
    flex-direction: column;
  }
}
.hc-s-table {
  &::v-deep .el-table {
    display: flex;
    flex:1 1 0px;
    flex-direction: column;
  }
}
.hc-out-dialog {
  // position: absolute;
  &::v-deep .el-dialog {
    margin-top: 4vh !important;
    height: 92% !important;
    .el-dialog__body {
      padding: 15px;
      height: calc(100% - 40px);
      display: flex;
      flex-direction: column;
    }
  }
}
.hc-form {
  &::v-deep .el-form-item {
    margin-bottom: 5px;
    .el-form-item__label {
      font-size: 12px;
    }
  }
}
.btns {
  margin: 10px 0;
}
.hc-dialog {
  &::v-deep  .el-form-item {
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;
    .el-form-item__content {
      width: calc(100% - 96px);
    }
  }
  &::v-deep .el-dialog:not(.is-fullscreen) {
    margin-top: 23vh !important;
  }
}
.hc-add-dialog {
  &::v-deep .el-dialog {
    .el-dialog__body { 
      padding: 15px;
      height: 600px;
      .el-radio__label {
        display: none !important;
      }
      .pagination-container {
        justify-content: start;
      }
      .el-pagination {
        width: auto !important;
        text-align: left;
      }
      .dialog-footer {
        text-align: right;
      }
    }
  }
}
</style>