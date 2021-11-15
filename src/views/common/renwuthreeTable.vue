<template>
  <sTable :data="tableData" :header="tableHeader" :fixedNum="1"  @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" slot="fixed"/>
    <!-- <el-table-column label="序号" type="index" align="center"  slot="fixed"/> -->
    <el-table-column label="操作" align="center" width="180" slot="operate">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row,'xgmx')"
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
        prop: 'rwpcid',
        label: '批次号',
        fixedWidth:30
      },{
        prop: 'jgdm',
        label: '机构代码',
        fixedWidth:55,
      },{
        prop: 'jgmc',
        label: '机构名称',
        fixedWidth:60,
      },{
        prop: 'gzfl',
        label: '规则分类',
        align: 'left'
      },{
        prop: 'gzmc',
        label: '规则名称',
        align: 'left'
      },{
        prop: 'xjjzrs',
        label: '涉及就诊人员数',
        hide:true
      },{
        prop: 'sjrcs',
        label: '涉及结算人次数',
      },{
        prop: 'xjmxs',
        label: '涉及项目数',
      },{
        prop: 'xjje',
        label: '疑点金额(元)',
        viewFun: (xjje)=>{
          return this.formatMoney(xjje,2)
        }
      },{
        prop: 'jsfy',
        label: '医保结算费用(元)',
        viewFun: (jsfy)=>{
          return this.formatMoney(jsfy,2)
        }  
      },{
        prop: 'ajly',
        label: '案件来源'
      },{
        label: '规则来源',
        fixedWidth:55,
        prop:'gzly'
      }]
    }
  },
  props:['tableData'],
  methods:{
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.$emit('handleSelectionChange',selection)
      // this.ids = selection.map(item => item.rwpcid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
      this.$emit('selection-change',selection)
    },
    checkdetail(row){
      this.$emit('check-xgmx',row)
    }
  }
}
</script>