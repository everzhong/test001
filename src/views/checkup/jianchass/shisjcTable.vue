/**项目流水号汇总 第四层数据*/
<template>
  <el-table :data="tableData" border  style="margin-top:10px">
    <el-table-column label="机构名称" align="center" prop="jgmc"  show-overflow-tooltip/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  show-overflow-tooltip/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  show-overflow-tooltip/>
    <el-table-column label="明细项目编号" align="center" prop="mxxmbm"  show-overflow-tooltip/>
    <el-table-column label="明细项目名称" align="center" prop="mxxmmc"  show-overflow-tooltip/>
    <el-table-column label="通用名" align="center" prop="tym"  show-overflow-tooltip/>
    <el-table-column label="明细项目单价(元)" align="center" prop="mxxmdj"  show-overflow-tooltip/>
    <el-table-column label="明细项目数量" align="center" prop="mxxmsl"  show-overflow-tooltip/>
    <el-table-column label="明细项目金额(元)" align="center" prop="mxxmje"  show-overflow-tooltip/>
    <el-table-column label="明细项目交易金额(元)" align="center" prop="mxxmjyfy"  show-overflow-tooltip/>
    <el-table-column label="明细项目医保结算金额(元)" align="center" prop="mxxmbjsfy"  show-overflow-tooltip/>
    <el-table-column label="费用类别" align="center" prop="xydm"  show-overflow-tooltip/>
    <el-table-column label="批次号" align="center" prop="fylb"  show-overflow-tooltip/>
    <el-table-column label="机构代码" align="center" prop="jgdm" show-overflow-tooltip/>
    <el-table-column label="机构代码" align="center" prop="jgdm" show-overflow-tooltip>
      <template slot-scope="scope">
        <el-button type="text" @click="checkdetail(scope.row)">操作记录</el-button>
      </template>
    </el-table-column>

  </el-table>
</template>
<script>
export default {
  name:'ShisjcTable',
  data(){
    return {}
  },
  props:['tableData'],
  methods:{
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.$emit('handleSelectionChange',selection)
    // },
    checkdetail(row){
      this.$emit('docheck',row)
    }
  }
}
</script>