<template>
  <el-table ref="multipleTable" :data="tableData" border style="margin-top:10px">
    <el-table-column label="序号" type="index" width="55" align="center" />
    <el-table-column label="险种" align="ybbf" prop="jgmc"  show-overflow-tooltip/>
    <el-table-column label="就医类别" align="center" prop="jylb"  show-overflow-tooltip/>
    <el-table-column label="检查方式" align="center" prop="jcfx"  show-overflow-tooltip/>
    <el-table-column label="医保项目编码" align="center" prop="xwrd"  show-overflow-tooltip/>
    <el-table-column label="项目名称" align="center" prop="beizhu"  show-overflow-tooltip/>
    <el-table-column label="标准单价(元)" align="center" prop="mxxmdj"  show-overflow-tooltip/>
    <el-table-column label="计价单位" align="center" prop="mxxmje"  show-overflow-tooltip/>
    <el-table-column label="医院单价(元)" align="center" prop="mxxmjyfy"  show-overflow-tooltip/>
    <el-table-column label="追款单价(元)" align="center" prop="mxxmbjsfy"  show-overflow-tooltip/>
    <el-table-column label="违规数量" align="center" prop="xydm"  show-overflow-tooltip/>
    <el-table-column label="违规费用(元)" align="center" prop="fylb"  show-overflow-tooltip/>
    <el-table-column label="行为认定" align="center" prop="jgdm" show-overflow-tooltip/>
    <!-- <el-table-column label="操作" align="center" show-overflow-tooltip width="110px">
      <template slot-scope="scope">
        <el-button type="text" @click="checkdetail(scope.row)">同流水下明细</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
export default {
  name:'ViewTable',
  data(){
    return {}
  },
  props:['tableData']
}
</script>