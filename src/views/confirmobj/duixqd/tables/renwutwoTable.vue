<template>
  <sTable :data="tableData" :header="tableHeader" :fixedNum="2" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" slot="fixed"/>
    <el-table-column label="序号" type="index" align="center"  slot="fixed"/>
    <el-table-column label="操作" align="center" width="150" slot="operate">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row,'xgmx')"
        >查看相关明细</el-button>
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row,'qmx')"
        >全明细</el-button>
      </template>
    </el-table-column>
  </sTable>
</template>
<script>
export default {
  name:'RenwutwoTable',
  data(){
    return {
      xzqOptions:[],
      tableHeader:[{
        label:"网审意见",
        prop:"wsyj",
      },{
        label:"网审人员",
        prop:'wsry'
      },{
        label:"监管状态",
        prop:'jgzt',
        width: '150px',
        viewFun: (status)=>{
          return this.selectDictLabels(this.statusOptions, status+'')
        }
      },{
        label: '批次号',
        fixedWidth:30,
        prop:'rwpcid'
      },{
         label: '案件来源',
        fixedWidth:50,
        prop:'ajly',
        width:'auto'
      },{
        label:"检查方式",
        prop:'jcfs',
        width:'auto',
        viewFun:()=>{
          return '规则筛查'
        }
      },{
        label:"险种",
        prop:'ybbf',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        }
      },{
        label:"就医类型",
        prop:'jslb',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        }
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
       label: '机构代码',
        fixedWidth:55,
        prop:'jgdm'
      },{
        label:"统一社会信用代码",
        prop:'xydm'
      },{
        label: '机构名称',
        fixedWidth:60,
        prop:'jgmc'
      },{
        label: "行政区",
        prop:'xzq',
        width:'auto',
        viewFun: (xzq)=>{
          return this.selectDictLabels(this.xzqOptions, xzq)
        }
      },{
        label:"结算等级",
        prop:'jsdj',
      },{
        label:"涉及规则数",
        prop:'sjwgs'
      },{
        label:"涉及就诊人员数",
        prop:'jsry',
        hide:true
      },{
        prop: 'jsrc',
        label: '涉及就诊人次数',
      },{
        label:"疑点金额(元)",
        prop:'ydje',
        viewFun:(ydje)=>{
          return this.formatMoney(ydje,2)
        }
      }],
      jslbOptions:[],
      ybbfOptions:[],
      statusOptions:[]
    }
  },
  props:['tableData'],
  created(){
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
    this.getDicts("sys_renwu_status").then(response => {
      this.statusOptions = response.data;
    });
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  methods:{
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
      // this.ids = selection.map(item => item.rwpcid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
    checkdetail(row,key){
      this.$emit(`check-${key}`,row)
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
  },
}
</script>