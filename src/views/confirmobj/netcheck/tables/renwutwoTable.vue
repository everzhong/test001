<template>
<div :style="{minHeight:'300px',height:tableHeight}">
  <sTable :data="tableData" :header="tableHeader" :fixedNum="2" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" slot="fixed"/>
    <el-table-column label="序号" type="index" align="center"  slot="fixed"/>
    <el-table-column label="操作" align="center" width="180" slot="operate">
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
</div>
</template>
<script>
export default {
  name:'RenwutwoTable',
  data(){
    return {
      tableHeight:0,
      xzqOptions:[],
      tableHeader:[{
        label:"监管状态",
        prop:"status",
        width:'auto',
        viewFun:()=>{
          return '待网审'
        }
      },{
        label:"驳回意见",
        prop:'dxqdbh'
      },{
        label:"案件来源",
        prop:'ajly'
      },{
        label:"检查方式",
        prop:'jcfs',
        width:'auto',
        viewFun:()=>{
          return '规则筛查'
        }
      },{
        label:"机构名称",
        prop:'jgmc'
      },{
        label:"险种",
        prop:'ybbf'
      },{
        label:"就医类型",
        prop:'jslb'
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
        label:"行政区",
        prop:'xzq',
        width:'auto',
        formatter:this.xzqFormat
      },{
        label:"涉及规则数",
        prop:'sjwgs'
      },{
        label:"涉及就诊人员数",
        prop:'jsrc'
      },{
        label:"涉及金额(元)",
        prop:'ydje',
        viewFun:(ydje)=>{
          return this.formatMoney(ydje,2)
        }
      },{
        label:"批次号",
        prop:'rwpcid'
      },{
        label:"机构代码",
        prop:'jgdm'
      }]
    }
  },
  props:['tableData'],
  created(){
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
  },
  mounted(){
    this.tableHeight = document.body.offsetHeight - 50-34-118-40-70-50-35+'px';
  },
  methods:{
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
    },
    checkdetail(row,key){
      this.$emit('check-mx',row,key)
    },
    checkdetailAll(row){
      this.$emit('check-mx',row,key)
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
    },
  }
}
</script>