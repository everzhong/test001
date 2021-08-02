<template>
  <el-table :data="tableData" border>
    <!-- <el-table-column type="selection" width="55" align="center" /> -->
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="案件来源" align="center" prop="ajly" :width="flexColumnWidth('ajly',tableData)"/>
    <el-table-column label="统一社会信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/>
     <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="行政区" align="center" prop="xzq"  :width="flexColumnWidth('xzq',tableData)"/>
    <el-table-column label="结算等级" align="center" prop="jsdj"  :width="flexColumnWidth('jsdj',tableData)"/>
    <el-table-column label="险种" align="center" prop="ybbf"/>
    <el-table-column label="就医类型" align="center" prop="jslb"/>
    <el-table-column label="异地/本地" align="center" prop="ybd"/>
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
    <el-table-column label="明细项目编号" align="center" prop="mxxmbm"  :width="flexColumnWidth('mxxmbm',tableData)"/>
    <el-table-column label="明细项目名称" align="center" prop="mxxmmc"  :width="flexColumnWidth('mxxmmc',tableData)"/>
    <el-table-column label="通用名" align="center" prop="tym"  :width="flexColumnWidth('tym',tableData)"/>
    <el-table-column label="明细违规数量" align="center" prop="wgsl"  :width="flexColumnWidth('wgsl',tableData)"/>
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
    <el-table-column label="违规费用" align="center" prop="wgfy"  :width="flexColumnWidth('wgfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.wgfy,2)}}</span>
      </template>
    </el-table-column>
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