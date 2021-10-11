<template>
  <sTable :data="tableData" :header="tableHeader" :fixedNum="0">
    <el-table-column label="操作" align="center" width="180">
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
        prop: 'jgmc',
        label: '机构名称',
      },{
        prop: 'gzfl',
        label: '规则分类',
        align: 'left'
      },{
        prop: 'gzmc',
        label: '规则名称',
        align: 'left'
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
        width: 'auto'
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
        viewFun: (fylb)=>{
          return this.selectDictLabels(this.$store.getters.fyDic, fylb)
        },
        width: 'auto'
      },{
        prop: 'rwpcid',
        label: '批次号'
      },{
        prop: 'jgdm',
        label: '机构代码',
      },{
        prop: 'xydm',
        label: '统一社会信用代码',
      }]
    }
  },
  props:['tableData'],
  methods:{
    fylbFormat(row, column) {
      return this.selectDictLabels(this.$store.getters.fyDic, row.fylb);
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