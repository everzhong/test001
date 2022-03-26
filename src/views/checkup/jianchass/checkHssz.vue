<template>
  <div class="hssz" style="height:100%">
    <div class="hssz-top">
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-radio-group v-model="gzTabsValue" size="small" @change="tabsLevelChange">
            <el-radio-button label="1">规则筛查</el-radio-button>
            <el-radio-button label="2">进销存核查</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue!=='three'">
          <el-button type="default"  size="small" @click="goBackUpLevel">返回上一层</el-button>
        </el-col>
        <div class="top-right-btn">
          <el-col :span="1.5" v-show="gzTabsValue==1">
            <span style="margin-right:10px;font-size:12px;color:#606266">参保地</span>
            <el-select v-model="queryGzForm.ybd" size="small" @change="ybdChange" style="width:100px">
              <el-option label="本地" value="01"></el-option>
              <el-option label="异地" value="02"></el-option>
            </el-select>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" size="small" @click="chaxunDialog = true">查询条件</el-button>
          </el-col>
        </div>
      </el-row>
    </div>
    <div :class="[tabsValue==='four'?'four-type':'nor-type']"  v-loading="loading"  style="margin-top:6px">
      <sTable v-show="tabsValue==='three'&&gzTabsValue==1" :data="renwuthreeList" :header="tableHeader" :fixedNum="1">
         <el-table-column type="index" label="序号"  align="center" width="55" slot="fixed">
        </el-table-column>
        <el-table-column label="操作"  fixed="right" align="center" width="150" slot="operate">
          <template>
            <el-button type="text" size="mini" @click="checkLiushui">流水号项目汇总</el-button>
          </template>
        </el-table-column>
      </sTable>
      <sTable v-show="gzTabsValue==2" :data="hcList" :header="hcHeader" :fixedNum="1">
         <el-table-column type="index" label="序号"  align="center" width="55" slot="fixed">
        </el-table-column>
      </sTable>
      <liushui-table ref="liuShuiTable" v-if="tabsValue==='four'" :tableData="renwufourList" :noLog="true"  @checkdetail="tongLiushuimx"></liushui-table>
      <tongliumx ref="tongLiumx" v-if="tabsValue==='five'" :tableData="renwufiveList"></tongliumx>
      <pagination
        style="float:right"
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :pageSizes="[50,100,150,200]"
        size="small"
        @pagination="getList"
      />
    </div>
    <div class="bottom-dec" v-if="tabsValue==='four'">
      <p>规则名称：{{selection.gzmc}}</p>
      <div><span>情况说明：{{selection.qksm}}</span><span>相关资料：{{selection.xgzl}}</span></div>
    </div>
    <!-- 查询条件 -->
    <el-dialog title="查询条件" class="check-dialog" :visible.sync="chaxunDialog" width="800px" :modal="true">
      <el-form ref="chaxunForm" :model="queryGzForm"  label-width="110px" size="small">
        <div class="form-group" v-if="gzTabsValue==1">
          <el-form-item label="规则分类" prop="gzfl">
            <el-select v-model="queryGzForm.gzfl">
              <el-option
                v-for="item in gzflOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规则名称" prop="gzmc">
              <el-input clearable v-model="queryGzForm.gzmc"></el-input>
          </el-form-item>
          <el-form-item label="涉及结算人次数" prop="xjjzrs">
            <div class="item-group">
              <el-input type="number" min="0"  v-model="queryGzForm.xjjzrs"></el-input>
              <span>-</span>
              <el-input type="number" min="0"  v-model="queryGzForm.sjrcs"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="涉及项目数" prop="xjmxs" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="queryGzForm.xjmxs"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="queryGzForm.bz"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="涉及金额" prop="xjje" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="queryGzForm.xjje"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="queryGzForm.ydsm"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="结算总费用" prop="jsfy" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="queryGzForm.jsfy"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="queryGzForm.jsdj"></el-input>
            </div>
          </el-form-item>
        </div>
        <div class="form-group" v-if="gzTabsValue==2">
          <el-form-item label="明细项目编号" prop="mxxmbm" >
            <xmbm @onChecked="mxxmbmChecked" ref="mxxmbmPopo"/>
          </el-form-item>
          <el-form-item label="明细项目名称" prop="mxxmmc">
            <el-input clearable v-model="queryHcForm.mxxmmc"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getList()" size="small">确 定</el-button>
        <el-button @click="resetCheckForm" size="small">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listRenwuthree } from '@/api/renwu/renwuthree'
import { listRenwufour } from '@/api/renwu/renwufour'
import { getTLS,getQMX} from '@/api/renwu/mingxi'
import LiushuiTable from './liushiTable.vue'
import Tongliumx from './tongliumx.vue'
import xmbm from './xmbm.vue'

export default {
  name:"CheckHssz",
  components:{
    LiushuiTable,
    Tongliumx,
    xmbm
  },
  data(){
    return {
      gzTabsValue:'1',
      tableHeader:[{
        prop:'gzfl',
        label:'规则分类',
        fixedWidth:80,
      },{
        prop:'gzmc',
        label:'规则名称',
        fixedWidth:66
      },{
        prop:'xjjzrs',
        label:'涉及结算人次数'
      },{
        prop:'xjmxs',
        label:'涉及明细数'
      },{
        prop:'xjje',
        label:'疑点金额(元)',
        viewFun:(xjje)=>{
          return this.formatMoney(xjje,2)
        }
      },{
        prop:'jsfy',
        label:'结算总费用',
        viewFun:(jsfy)=>{
          return this.formatMoney(jsfy,2)
        }
      },{
        prop:'hssj',
        label:'确定核实时间',
        viewFun:(hssj)=>{
          return this.parseTime(hssj)
        }
      },{
        prop: 'yy',
        label: '有无异议',
        viewFun:function(yy){
          return (yy?(yy==0?'未反馈':yy==1?'有异议':yy==2?'无异议':''):'')
        },
      },{
        prop:'hsyj',
        label:'核实意见'
      },{
        prop:'hsr',
        label:'核实人'
      },{
        prop:'hspfsj',
        label:'核实时间',
        viewFun:(hspfsj)=>{
          return this.parseTime(hspfsj)
        }
      }],
      hcHeader:[{
        prop: 'xwrd',
        label: '行为认定',
        fixedWidth:50
      },{
        prop: 'bz',
        label: '备注',
        fixedWidth:90
      },{
        prop: 'mxxmbm',
        label: '明细项目编号',
      },{
        prop: 'mxxmmc',
        label: '明细项目名称',
      },{
        prop: 'xgzlxmmc',
        label: '相关诊疗项目',
      },{
        prop: 'mxxmdj',
        label: '单价(元)',
        viewFun: (dj)=>{
          return this.formatMoney(dj,2)
        }
      },{
        prop: 'qckc',
        label: '期初库存数量',
      },{
        prop: 'bqgr',
        label: '本期购入数量',
      },{
        prop: 'qmkc',
        label: '期末库存数量',
      },{
        prop: 'xjxs',
        label: '现金销售数量',
      },{
        prop: 'sjxs',
        label: '实际销售',
      },{
        prop: 'ybjs',
        label: '医保结算数量',
      },{
        prop: 'cesl',
        label: '差额数量',
      },{
        prop: 'dzce',
        label: '对账差额费用(元)',
        viewFun: (dzcefy)=>{
          return this.formatMoney(dzcefy,2)
        }  
      },{
        prop: 'zkdj',
        label: '追款单价',
        viewFun: (zkdj)=>{
          return this.formatMoney(zkdj,2)
        }  
      },{
        prop: 'wgsl',
        label: '违规数量',
        width:'auto' 
      },{
        prop: 'wgfy',
        label: '违规费用(元)',
        width: 'auto',
        viewFun: (wgfy)=>{
          return this.formatMoney(wgfy,2)
        }
      },{
        prop:'hssj',
        label:'确定核实时间',
        viewFun:(hssj)=>{
          return this.parseTime(hssj)
        }
      },{
        prop: 'yy',
        label: '有无异议',
        viewFun:function(yy){
          return (yy?(yy==0?'未反馈':yy==1?'有异议':yy==2?'无异议':''):'')
        },
      },{
        prop:'hsr',
        label:'核实人'
      },{
        prop:'hspfsj',
        label:'核实时间',
        viewFun:(hspfsj)=>{
          return this.parseTime(hspfsj)
        }
      }],
      loading:false,
      chaxunDialog:false,
      rwCheck:'',
      renwuthreeList:[],
      renwufourList:[],
      renwufiveList:[],
      hcList:[],
      queryParams:{
        pageSize:50,
        pageNum:1
      },
      gzflOptions:[],
      queryGzForm:{
        gzfl:'',
        gzmc:'',
        xjjzrs:'',
        sjrcs:'',
        xjmxs:'',
        bz:'',
        xjje:'',
        ydsm:'',
        jsfy:'',
        jsdj:'',
        ybd:''
      },
      queryHcForm:{
        mxxmbm:'',
        mxxmmc:'',
      },
      total:0,
      hsztOptions:[
        {dictValue:'1',dictLabel:'未核实'},
        {dictValue:'2',dictLabel:'核实中'},
        {dictValue:'3',dictLabel:'已核实'}
      ],
      selection:{},
      queryInfoFrom:{},
      tabsValue:'three',
      lsh:''
    }
  },
  created(){
    this.queryInfoFrom = this.$route.query
    this.getList()
    this.getDicts('sys_renwu_gzfl').then(res=>{
      if(res.code==200){
        this.gzflOptions = res.data
      }
    })
  },
  methods:{
    mxxmbmChecked(val){
      this.queryHcForm.mxxmbm = val
    },
    resetCheckForm(){
      this.queryHcForm = {
        mxxmbm:'',
        mxxmmc:''
      }
      this.queryGzForm = {
        gzfl:'',
        gzmc:'',
        xjjzrs:'',
        sjrcs:'',
        xjmxs:'',
        bz:'',
        xjje:'',
        ydsm:'',
        jsfy:'',
        jsdj:'',
        ybd:''
      }
      this.$refs['chaxunForm'].resetFields()
      this.$refs.mxxmbmPopo && (this.$refs.mxxmbmPopo.clear())
    },
    tabsLevelChange(){
      this.getList()
    },
    //返回上一层
    goBackUpLevel(){
      this.selectedId = ''
      switch(this.tabsValue) {
        case ('five'):
          this.tabsValue = 'four'
          this.lsh = ''
          break
        case 'four':
          this.tabsValue = 'three'
          break
        default :
         break
      }
    },
    checkLiushui(){
      this.total = 0
      this.queryParams.pageNum=1
      this.tabsValue = 'four'
      const {jgdm,datastarttime,dataendtime} = this.queryInfoFrom
      this.searchNextParams = {
        jgdm:jgdm,
        zdbm:this.parseTime(datastarttime, '{y}{m}'),
        zdbm1:this.parseTime(dataendtime, '{y}{m}')
      }
      this.getList()
    },
    tongLiushuimx(row){
      this.tabsValue = 'five'
      this.lsh = row.lsh || ''
      this.searchNextParams = {lsh:row.lsh||''}
      this.getList()
    },
    async getList(query) {
      let params = this.gzTabsValue==1? {...this.queryGzForm,...this.queryParams}:{...this.queryHcForm,...this.queryParams}
      if(query){
        params = {...params,...query}
      } else {
        const {rwpcid,jgdm} = this.queryInfoFrom
        params = {rwpcid,jgdm,...params}
      }
      this.loading = true
      try {
        let  res = null
        switch(true) {
          case (this.gzTabsValue==='1' && this.tabsValue==='three'):
            res = await listRenwuthree({hszt:3,...params})
            break;
          case (this.gzTabsValue==='2'):
            res = await listRenwufour({hszt:3,...params,type:2,ischeck:1})
            break;
          case (this.tabsValue === 'four'):
            res = await listRenwufour(params)
            break;
          case (this.tabsValue ==='five'):
            res = await getTLS({...this.queryParams,...this.searchNextParams})
            break;
          default:
            // params.statu = 2 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
            // res = await listRenwutwo(params)
            break;
        }
        if(res.code===200){
          if(this.gzTabsValue==2){
            this.hcList = res.rows
          } else {
            this[`renwu${this.tabsValue}List`] = res.rows;
          }
          this.total = res.total;
          if(this.chaxunDialog){
            this.resetCheckForm()
            this.chaxunDialog = false
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // async getList(query){
    //   let params ={...this.queryParams,...this.queryGzForm}
    //   query&&(params = {...params,...query})
    //   this.loading = true
    //   const res = await listRenwuthree(params)
    //   if(res.code===200){
    //     this.tableData = res.rows;
    //     this.total = res.total;
    //   }
    //   this.loading = false
    // },
    ybdChange(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    radioChange(val){
      this.selection = this.tableData.filter(item=>{
        return item.id === val
      })[0]
    }
  }

}
</script>
<style lang="scss" scoped>
.hssz {
  .hssz-top {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    margin-top: 15px;
    .title {
      font-size: 14px;
      color: #606266;
    }
  }
  .bottom-dec {
    font-size: 14px;
    color:#606266;
    div>span{
      display: inline-block;
      width: 50%;
    }
  }
}
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
  }
  .four-type {
    height:calc(100% - 170px);
    margin-bottom:60px
  }
  .nor-type {
    height:calc(100% - 100px);
    margin-bottom:60px
  }
.check-dialog {
  &::v-deep .el-dialog__body {
    padding:30px 20px 5px;
  }
  &::v-deep .el-dialog__footer {
    text-align: center;
  }
  .form-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-select {
      width: 100%;
    }
    .el-form-item {
      width: 48%;
      display: block;
    }
    .long-label {
      &::v-deep .el-form-item__label {
        line-height: normal;
        font-size: 12px;
      }
    }
  }
  .item-group {
    width: 100%;
    display: flex;
  }
}
</style>