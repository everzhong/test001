<template>
  <sTable :data="tableData" :header="tableHeader" :fixedNum="1">
    <el-table-column label="序号" type="index" align="center" width="60" slot="fixed"/>
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
        label: '案件来源',
        fixedWidth:55,
        prop:'ajly'
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