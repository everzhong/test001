<template>
  <sTable :data="tableData" :header="tableHeader" :fixedNum="1">
    <el-table-column label="序号" type="index" align="center" slot="fixed"/>
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
  name:'RenwufourTable',
  data(){
    return {
      tableHeader:[{
        prop: 'rwpcid',
        label: '批次号'
      },{
        prop: 'jgdm',
        label: '机构代码',
      },{
        prop: 'jgmc',
        label: '机构名称',
      },{
        prop: 'gzfl',
        label: '规则分类',
      },{
        prop: 'gzmc',
        label: '规则名称',
      },{
        prop: 'mxxmbm',
        label: '明细项目编号',
      },{
        prop: 'mxxmmc',
        label: '明细项目名称',
      },{
        prop: 'tym',
        label: '通用名',
      },{
        prop: 'mxxmdj',
        label: '明细项目单价(元)',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,3)
        }
      },{
        prop: 'mxxmsl',
        label: '明细项目数量',
      },{
        prop: 'mxxmje',
        label: '明细项目金额(元)',
        viewFun: (mxxmje)=>{
          return this.formatMoney(mxxmje,2)
        }  
      },{
        prop: 'mxxmjyfy',
        label: '明细项目交易金额(元)',
        viewFun: (mxxmjyfy)=>{
          return this.formatMoney(mxxmjyfy,2)
        }  
      },{
        prop: 'mxxmbjsfy',
        label: '明细项目医保结算金额(元)',
        viewFun: (mxxmbjsfy)=>{
          return this.formatMoney(mxxmbjsfy,2)
        }  
      },{
        prop: 'fylb',
        label: '费用类别',
        formatter: this.fylbFormat,
        width: 'auto'
      }]
    }
  },
  props:['tableData'],
  methods:{
    fylbFormat(row, column) {
      return this.selectDictLabel(this.$store.getters.fyDic, row.fylb);
    },
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