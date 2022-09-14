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
          <el-select v-model="form.mxxmlb" clearable>
            <el-option v-for="item in mxxmlbOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item> 
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button  @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button size="mini" type="primary" @click="setHechashuju">设为核查数据</el-button>
        <el-button size="mini" type="primary" @click="dialogHcVisible = true">新增诊疗相关耗材</el-button>
        <el-button size="mini" type="primary" @click="delHechashuju">删除诊疗相关耗材</el-button>
        <!-- <el-button v-if="this.$store.getters.roles[0]==='admin'" size="mini" type="primary"  style="float:right">+新增相关诊疗项目</el-button> -->
      </div>
      <div style="display:flex;flex-direction:column;height:100%" v-loading="loading">
        <sTable class="hc-s-table" :data="gridData" :header="tableHeader" :fixedNum="1" @selection-change="handleSelectionChange" @on-click="checkXghc">
          <el-table-column slot="fixed" type="selection" width="55" align="center" fixed/>
        </sTable>
      </div>
      <pagination
        style="height:40px"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <el-dialog @close="closeHcform" class="hc-dialog" append-to-body title="新增诊疗相关耗材" :visible.sync="dialogHcVisible" :modal="false" width="483px">
        <el-form :model="hCform" size="small" inline label-width="110px" :rules="hcRules" ref="hcForm">
          <el-form-item label="明细项目名称" prop="mxxmmc">
            <el-input readonly v-model="hCform.mxxmmc" autocomplete="off" style="width:77%;margin-right:10px"></el-input>
            <el-button @click="selectXgzlxm" size="mini">选择...</el-button>
          </el-form-item>
           <el-form-item label="相关耗材" prop="hc">
            <el-input v-model="hCform.hc" autocomplete="off" style="width:77%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addFour" size="mini">确 定</el-button>
          <el-button  @click="closeHcform" size="mini">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog class="hc-add-dialog" append-to-body title="新增诊疗相关耗材" :visible.sync="dialogAddHcVisible" :modal="true" width="1000px">
          <div style="display:flex;flex-direction:column;height:100%" v-loading="addHcLoading">
            <sTable class="hc-s-table" :data="hcData" :header="tableHcHeader" :fixedNum="1">
              <el-table-column width="40px" label="序号" align="center" slot="fixed" fixed>
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
              <el-button type="primary" @click="addHcConfim" size="mini">确 定</el-button>
              <el-button  @click="dialogAddHcVisible = false" size="mini">取 消</el-button>
            </div>
        </div>
      </el-dialog>
      <el-dialog append-to-body title="相关耗材" :visible.sync="checkXghcShow" :modal="true" width="400px">
        <el-row style="margin-bottom:10px">
          <el-col :span="9">诊疗项目名称：</el-col>
          <el-col :span="15">{{xghcDetail.mxxmmc}}</el-col>
        </el-row>
        <el-row style="margin-bottom:10px">
          <el-col :span="9">诊疗项目单价：</el-col>
          <el-col :span="15">{{xghcDetail.mxxmdj}}</el-col>
        </el-row>
        <el-row style="margin-bottom:10px">
          <el-col :span="9">诊疗项目单位：</el-col>
          <el-col :span="15">{{xghcDetail.mxxmdw}}</el-col>
        </el-row>
        <el-row style="margin-bottom:10px">
          <el-col :span="9">明细项目数量：</el-col>
          <el-col :span="15">{{xghcDetail.mxxmsl}}</el-col>
        </el-row>
        <el-row style="margin-bottom:10px">
          <el-col :span="14">明细项目医保结算范围费用(元)：</el-col>
          <el-col :span="10">{{xghcDetail.mxxmybjsfy}}</el-col>
        </el-row>
        <el-button style="margin:20px 0 0 155px" size="mini" type="primary" @click="checkXghcShow=false">关闭</el-button>
      </el-dialog>
  </el-dialog>
</template>
<script>
import {getXgzlxm,getXghc} from '@/api/renwu/renwuone.js'
import { listRenwufour, updateRenwufour, delRenwufour,addRenwufour} from '@/api/renwu/renwufour'

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
          return this.formatMoney(mxxmdj,2)
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
        prop: 'mxxmlb',
        viewFun: (mxxmlb)=>{
          return this.selectDictLabels(this.mxxmlbOptions, mxxmlb)
        }
      },{
        label:'相关耗材',
        prop:'hc',
        viewTemp:'button'
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
          return this.formatMoney(mxxmdj,2)
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
        hc:'',
        hcid:'',
        jgdm:'',
        rwpcid:''
      },
      hcRules:{
        mxxmmc:[{required:true,message:'必选项',trigger:'change'}],
        hc:[{required:true,message:'必填项',trigger:'change'}]
      },
      roleCheck:'',
      addHcLoading:false,
      loading:false,
      selectHcIds:[],
      mxxmlbOptions:[],
      checkXghcShow:false,
      xghcDetail:{}
    }
  },
  created(){
    this.getDicts("sys_renwu_mxxmlb").then(response => {
      this.mxxmlbOptions = response.data;
    });
    this.show = this.isShow
    this.getList()
   
  },
  methods:{
    checkXghc(row){
      console.log(row)
      getXghc(row.hcid).then(res=>{
        if(res.code===200||res.code===0) {
          this.xghcDetail = res.data
        }
      })
      this.checkXghcShow = true
    },
    addHcConfim(){
      const selected = this.hcData[this.roleCheck]
      this.hCform.mxxmmc = selected.mxxmmc
      this.hCform.hcid = selected.id
      this.hCform.rwpcid = selected.rwpcid
      this.hCform.jgdm = selected.jgdm
      this.dialogAddHcVisible = false
    },
    addFour(){
      this.$refs['hcForm'].validate(async valid => {
        if(valid){
          this.loading = true
          try {
            const res = await addRenwufour({...this.hCform,type:'2'})
            if(res.code===200||res.code===0){
              this.loading = false
              this.msgSuccess('新增成功')
              this.getList()
              this.closeHcform()
            }
          } catch (error) {
            console.log(error)
          }
          this.loading = false
        }
      })
    },
    closeHcform(){
      this.$refs['hcForm'].resetFields()
      this.dialogHcVisible=false
      this.hCform = {
        mxxmmc:'',
        hc:'',
        hcid:'',
        jgdm:'',
        rwpcid:''
      }
    },
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
      this.$confirm('确定设为核查数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
      }).catch(_=>{})
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
        const res = await getXgzlxm({
          jgdm:this.$route.query.jgdm,
          rwpcid:this.$route.query.rwpcid,
        })
        if(res.code===200||res.code===0){
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
      const params  = {
          ...this.form,
          ...this.queryParams,
          type:2,
          ischeck:0,
          jgdm:this.$route.query.jgdm,
          rwpcid:this.$route.query.rwpcid,
        }
        params.mxxmbm && (params.mxxmbm=`'${params.mxxmbm}'`)
      try {
        const res = await listRenwufour(params)
        if(res.code===200||res.code===0){
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
    margin-bottom: 15px;
    width: 100%;
    .el-form-item__content {
      width: calc(100% - 110px);
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