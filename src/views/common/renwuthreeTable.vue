<template>
  <el-table :data="tableData" border>
    <!-- <el-table-column type="selection" width="55" align="center" /> -->
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="统一社会信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/>
     <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="行政区" align="center" prop="xzq"  :width="flexColumnWidth('xzq',tableData)"/>
    <el-table-column label="结算等级" align="center" prop="jsdj"  :width="flexColumnWidth('jsdj',tableData)"/>
    <el-table-column label="险种" align="center" prop="ybbf"  :width="flexColumnWidth('ybbf',tableData)"/>
    <el-table-column label="就医类型" align="center" prop="jslb"  :width="flexColumnWidth('jslb',tableData)"/>
    <el-table-column label="异地/本地" align="center" prop="ybd"  :width="flexColumnWidth('ybd',tableData)"/>
    <el-table-column label="数据开始日期" align="center" prop="datastarttime"  :width="flexColumnWidth('datastarttime',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.datastarttime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="数据结束日期" align="center" prop="dataendtime" :width="flexColumnWidth('dataendtime',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
    <el-table-column label="违反条数(违反规则的明细数量)" align="center" prop="xjmxs"  :width="flexColumnWidth('xjmxs',tableData)"/>
    <el-table-column label="疑点金额" align="center" prop="ydje"  :width="flexColumnWidth('ydje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.ydje,2)}}</span>
      </template>
    </el-table-column>
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
      // this.$emit('handleSelectionChange',selection)
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