<template>
  <div style="width:100%;height:100%">
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span style="margin-right:10px;font-size:12px;color:#606266">{{options.title||'待选择'}}</span>
        <el-select v-model="queryGzForm.ybd" size="mini" @change="ybdChange" style="width:90px" v-if="tabsValue==1">
          <el-option label="本地" value="01"></el-option>
          <el-option label="异地" value="02"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="chaxunDialog = true">查询条件</el-button>
      </el-col>
      <div class="top-right-btn">
        <el-radio-group v-model="tabsValue" size="mini" @change="tabsLevelChange">
          <el-radio-button label="1">规则筛查</el-radio-button>
          <el-radio-button label="2">进销存核查</el-radio-button>
        </el-radio-group>
      </div>
    </el-row>
    <div style="height:calc(100% - 80px)" v-loading="loading">
      <sTable v-show="tabsValue==1" style="margin-top:8px;height:100%" :fixedNum="1" :data="tableData" @selection-change="handleSelectionChange" :header="gzHeader">
        <el-table-column type="selection" width="40" align="center" slot="fixed"/>
      </sTable>
      <sTable  v-show="tabsValue==2" style="margin-top:8px;height:100%" :fixedNum="1" :data="tableData" @selection-change="handleSelectionChange" :header="hcHeader">
        <el-table-column type="selection" width="40" align="center" slot="fixed"/>
      </sTable>
      <!-- </el-table> -->
      <pagination
      style="float:right"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :pageSizes="[50,100,150,200]"
      layout="prev, pager, next, slot"
      size="small"
      @pagination="getList"
    />
    </div>
    <!-- 查询条件 -->
    <el-dialog title="查询条件" class="check-dialog" :visible.sync="chaxunDialog" width="800px" :modal="true">
      <el-form ref="chaxunForm" :model="queryGzForm"  label-width="110px" size="small">
        <div class="form-group" v-if="tabsValue==1">
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
        <div class="form-group" v-if="tabsValue==2">
          <el-form-item label="明细项目编号" prop="mxxmbm" >
            <!-- <el-select v-model="queryHcForm.mxxmbm"></el-select> -->
            <xmbm @onChecked="mxxmbmChecked" ref="mxxmbmPopo"/>
          </el-form-item>
          <el-form-item label="明细项目名称" prop="mxxmmc">
            <el-input clearable v-model="queryHcForm.mxxmmc" placeholder="请输入"></el-input>
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
import { listRenwuthree,updateRenwuthree } from "@/api/renwu/renwuthree"
import { listRenwufour,updateRenwufour } from "@/api/renwu/renwufour"
import xmbm from './xmbm.vue'

export default {
  name:"TransferItem",
  props:['options'],
  components:{
    xmbm
  },
  data(){
    return{
      loading:false,
      tableData:[],
      total:0,
      gzHeader:[{
        prop: 'gzfl',
        label: '规则分类',
        fixedWidth:150
      },{
        prop: 'gzmc',
        label: '规则名称',
        fixedWidth:150
      },{
        prop: 'xjjzrs',
        label: '涉及结算人次数',
      },{
        prop: 'xjmxs',
        label: '涉及明细数',
      },{
        prop: 'xjje',
        label: '涉及金额(元)',
        viewFun: (xjje)=>{
          return this.formatMoney(xjje,2)
        }
      },{
        prop: 'jsfy',
        label: '结算总费用(元)',
        viewFun: (jsfy)=>{
          return this.formatMoney(jsfy,2)
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
          return this.formatMoney(dj,3)
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
          return this.formatMoney(zkdj,3)
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
        prop: 'fylb',
        label: '费用类别',
        viewFun: (fylb)=>{
          return this.selectDictLabels(this.$store.getters.fyDic, fylb)
        }
      }],
      chaxunDialog:false,
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
      guizefl:{
        search:'',
        gzfl:[],
        data:[],
        selection:[],
        total:0,
        pageNum:1,
        pageSize:10
      },
      ids:[],
      queryParams:{
        pageSize:50,
        pageNum:1
      },
      hsztOptions:[
        {dictValue:'1',dictLabel:'未核实'},
        {dictValue:'2',dictLabel:'核实中'},
        {dictValue:'3',dictLabel:'已核实'}
      ],
      xzqOptions:[],
      tabsValue:'1',
    }
  },
  created(){
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
    tabsLevelChange(val){
      this.$emit('on-change',val)
      this.getList()
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
    filterData(selection,cb){
      const request = []
      let count = 0
      selection.forEach((item,i)=>{
        request.push(this.tabsValue==='1'?updateRenwuthree({id:item.id,hs:2}):updateRenwufour({id:item.id,hs:2}))
        count++
        if(count===selection.length){
          this.loading= true
          Promise.all(request).then(()=>{
            this.getList()
            cb && cb()
            this.loading= false
          }).catch(e=>{
            this.loading= false
          })
        }
      })
    },
    addData(selection){
      this.tableData = this.tableData.concat(selection)
    },
    async getList(query){
      let params ={...this.queryParams,hs:1,jgdm:this.$route.query.jgdm,rwpcid:this.$route.query.rwpcid}
      query&&(params = {...params,...query})
      this.loading = true
      try {
        let res = ""
        if(this.tabsValue==='1'){
          params = {...params,...this.queryGzForm}
          res = await listRenwuthree(params)
        } else {
          params = {...params,...this.queryHcForm,type:2,ischeck:1}
          res = await listRenwufour(params)
        }
        if(res.code===200){
          this.tableData = res.rows;
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
    ybdChange(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    /**
     * 规则选择
    */
    handleGuizeChange(selection){
      this.guizefl.selection = selection
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.$emit('select',selection)
    },
  }
}
</script>
<style lang="scss" scoped>
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