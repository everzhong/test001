<template>
  <el-table :data="tableData" border @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="疑点类型" align="center" prop="ydlb" />
    <el-table-column label="疑点说明" align="center" prop="ydsm" />
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
    <el-table-column label="涉及就诊人员数" align="center" prop="xjjzrs"/>
    <el-table-column label="涉及明细数" align="center" prop="xjmxs"/>
    <el-table-column label="涉及金额(元)" align="center" prop="ydje"  :width="flexColumnWidth('ydje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.ydje,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="批次号" align="center" prop="rwpcid" :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
  </el-table>
</template>
<script>
export default {
  name:'RenwuthreeTable',
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