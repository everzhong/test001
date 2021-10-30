<template>
<div class="app-container">
  <el-row :gutter="10">
      <el-col :span="1.5">
        <el-radio-group v-model="tabsValue" size="small" @change="tabsLevelChange">
          <el-radio-button label="three">规则筛查</el-radio-button>
          <el-radio-button label="four">进销核查</el-radio-button>
        </el-radio-group>
      </el-col>
  </el-row>
  <div class="table-main">
    <sTable :data="tableData" :header="tableHeader" :fixedNum="1" v-show="tabsValue==='three'">
      <el-table-column label="序号" type="index" align="center" min-width="65" slot="fixed"/>
      <el-table-column label="操作" align="center"  width="110" slot="operate">
        <template slot-scope="scope" >
          <el-button :disabled="scope.row.hs==4" size="mini" type="text" primary @click="submitHsyj(scope.row)">提交核实意见</el-button>
        </template> 
      </el-table-column>
    </sTable>
     <sTable :data="hcTableData" :header="hcHeader" :fixedNum="1" v-show="tabsValue==='four'">
      <el-table-column label="序号" type="index" align="center" min-width="65" slot="fixed"/>
      <el-table-column label="操作" align="center"  width="110" slot="operate">
        <template slot-scope="scope" >
          <el-button  :disabled="scope.row.hs==4" size="mini" type="text" primary @click="submitHsyj(scope.row)">提交核实意见</el-button>
        </template> 
      </el-table-column>
    </sTable>
  </div>
  <pagination
      class="fixed-bottom"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import {listRenwuthreeHs, updateRenwuthree} from '@/api/renwu/renwuthree'
import {listRenwufourHs, updateRenwufour } from '@/api/renwu/renwufour'

export default {
  name:'Listjg',
  data(){
    return {
      tabsValue:'three',
      total:0,
      tableData:[],
      hcTableData:[],
      queryParams: {
        pageNum: 1,
        pageSize: 50
      },
      xzqOptions:[],
      tableHeader:[{
        prop: 'rwpcid',
        label: '批次号',
        fixedWidth:30
      },{
        prop: 'xydm',
        label: '统一社会信用代码',
      },{
        prop: 'jgdm',
        label: '机构代码',
        fixedWidth:55,
      },{
        prop: 'jgmc',
        label: '机构名称',
        fixedWidth:60,
      },{
        prop: 'xzq',
        label: '行政区',
        width: 'auto',
        viewFun: (xzq)=>{
          return this.selectDictLabels(this.xzqOptions, xzq)
        }
      },{
        prop: 'jsdj',
        label: '结算等级',
        viewFun: (jsdj)=>{
          return this.selectDictLabels(this.$store.getters.jsdjDic, jsdj)
        }
      },{
        prop: 'ybbf',
        label: '险种',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        },
        width:'auto'
      },{
        prop: 'jslb',
        label: '就医类型',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        },
        width:'auto'
      },{
        prop: 'ybd',
        label: '异地/本地',
        width:'auto'
      },{
        label:"数据开始日期",
        prop:'datastarttime',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}')
        }
      },{
        label:"数据结束日期",
        prop:'dataendtime',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}')
        }
      },{
        prop: 'gzfl',
        label: '规则分类',
        align: 'left',
        width:'auto'
      },{
        prop: 'gzmc',
        label: '规则名称',
        align: 'left'
      },{
        prop: 'xjmxs',
        label: '违反条数(违反规则的明细数量)',
      },{
        prop: 'xjje',
        label: '疑点金额',
        viewFun: (xjje)=>{
          return this.formatMoney(xjje,2)
        }
      },{
        prop: 'hs',
        label: '核实状态',
        viewFun:(hszt)=>{
          return hszt==4?'已机构核实':'待机构核实'
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
        prop:'hssj',
        label:'确定核实时间',
        viewFun:(hssj)=>{
          return this.parseTime(hssj)
        }
      },{
        prop: 'hs',
        label: '核实状态',
        viewFun:(hszt)=>{
          return hszt==4?'已机构核实':'待机构核实'
        }
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
    }
  },
  created(){
    this.getList()
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  methods:{
    tabsLevelChange(){
      this.getList()
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
     // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.$emit('handleSelectionChange',selection)
      // this.ids = selection.map(item => item.rwpcid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
    checkdetail(row){
      this.$emit('checkdetail',row)
    },
    async getList(){
      const jgdm = this.$store.getters.remark
      let res = ''
      this.loading = true
      try {
        if(this.tabsValue==='three'){
          res = await listRenwuthreeHs({
            jgdm,
            hszt:'3,4',
            ...this.queryParams
          })
        } else {
          res = await listRenwufourHs({
            jgdm,
            hszt:'3,4',
            type:2,
            ...this.queryParams
          })
        }
        if(res.code === 200) {
          this.tabsValue==='three'? this.tableData = res.rows : this.hcTableData = res.rows
          this.total = res.total
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    submitHsyj(row){
      this.$prompt('机构核实意见', '核实意见填写', {
          inputType:'textarea',
          inputValidator:function(value){
            return !!value
          },
          inputErrorMessage: '请填写核实意见!',
          confirmButtonText: '确定',
          cancelButtonText: '返回',
        }).then(async ({ value }) => {
            let res = ''
            if(this.tabsValue==='three'){
              res = await updateRenwuthree({
              id:row.id,
              hs:'4',
              hsyj:value,
              hsr:this.$store.getters.name,
              hssj: this.parseTime(new Date(),'{y}-{m}-{d} {h}:{m}:{s}')
            })
          } else {
            res = await updateRenwufour({
              id:row.id,
              hs:'4',
              hsyj:value,
              hsr:this.$store.getters.name,
              hssj: this.parseTime(new Date(),'{y}-{m}-{d} {h}:{m}:{s}')
            })
          }
          if(res.code===200) { 
            this.msgSuccess('机构核实成功')
            this.getList()
          } 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:58px;
  bottom:70px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:30px;
  right: 0px;
}
</style>