<template>
  <sTable :data="tableData" :header="tableHeader" :fixedNum="1">
    <el-table-column label="序号" type="index" align="center" width="60" slot="fixed"/>
    <el-table-column label="批次号" align="center" prop="rwpcid" :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="统一社会信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/>
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  width="350" show-overflow-tooltip/>
    <el-table-column label="涉及就诊人员数" align="center" prop="xjjzrs"  :width="flexColumnWidth('xjjzrs',tableData)"/>
    <el-table-column label="涉及明细数" align="center" prop="xjmxs"  :width="flexColumnWidth('xjmxs',tableData)"/>
    <el-table-column label="疑点金额(元)" align="center" prop="xjje"  :width="flexColumnWidth('xjje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.xjje,2)}}</span>
      </template>
    </el-table-column>
     <el-table-column label="结算费用(元)" align="center" prop="jsfy"  :width="flexColumnWidth('jsfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.jsfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" min-width="150" slot="operate">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row)"
        >查看相关明细</el-button>
      </template>
    </el-table-column>
  </sTable>
</template>
<script>
export default {
  name:'RenwuthreeTable',
  data(){
    return {
      tableHeader:[{
        label: '批次号',
        fixedWidth:30,
        prop:'rwpcid'
      },{
       label: '机构代码',
        fixedWidth:55,
        prop:'jgdm'
      },{
        label:"统一社会信用代码",
        prop:'xydm',
      },{
        label: '机构名称',
        fixedWidth:60,
        prop:'jgmc'
      },{
        label:"规则分类",
        prop:'gzfl',
        width:'auto'
      },{
        label:"规则名称",
        prop:'gzmc'
      },{
        label:"涉及就诊人员数",
        prop:'xjjzrs',
        hide:true
      },{
        prop: 'sjrcs',
        label: '涉及就诊人次数',
      },{
        label:"涉及明细数",
        prop:'xjmxs'
      },{
        label:"疑点金额(元)",
        prop:'xjje',
        viewFun:(xjje)=>{
          return this.formatMoney(xjje,2)
        }
      },{
        label:"结算费用(元)",
        prop:'jsfy',
        viewFun:(jsfy)=>{
          return this.formatMoney(jsfy,2)
        }
      },{
        label: '任务来源',
        fixedWidth:55,
        prop:'ajly'
      }]
    }
  },
  props:['tableData'],
  methods:{
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
      // this.ids = selection.map(item => item.rwpcid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
    checkdetail(row){
      this.$emit('check-xgmx',row)
    }
  }
}
</script>