<template>
  <el-table :data="tableData" border @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
    <el-table-column label="明细项目编号" align="center" prop="mxxmbm"  :width="flexColumnWidth('mxxmbm',tableData)"/>
    <el-table-column label="明细项目名称" align="center" prop="mxxmmc"  :width="flexColumnWidth('mxxmmc',tableData)"/>
    <el-table-column label="通用名" align="center" prop="tym"  :width="flexColumnWidth('tym',tableData)"/>
    <el-table-column label="明细项目单价(元)" align="center" prop="mxxmdj"  :width="flexColumnWidth('mxxmdj',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmdj,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目数量" align="center" prop="mxxmsl"  :width="flexColumnWidth('mxxmsl',tableData)"/>
    <el-table-column label="明细项目金额(元)" align="center" prop="mxxmje"  :width="flexColumnWidth('mxxmje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmje,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目交易金额(元)" align="center" prop="mxxmjyfy"  :width="flexColumnWidth('mxxmjyfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmjyfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目医保结算金额(元)" align="center" prop="mxxmbjsfy"  :width="flexColumnWidth('mxxmbjsfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmbjsfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="费用类别" align="center" prop="xydm" />
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
  </el-table>
</template>
<script>
export default {
  name:'RenwufourTable',
  data(){
    return {}
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
      this.$emit('checkdetail',row)
    }
  }
}
</script>