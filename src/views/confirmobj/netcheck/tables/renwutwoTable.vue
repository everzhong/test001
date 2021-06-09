<template>
  <el-table :data="tableData" @selection-change="handleSelectionChange" border>
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="监管状态" align="center" prop="jgzt"  show-overflow-tooltip/>
    <el-table-column label="驳回意见" align="center" prop="dxqd"  show-overflow-tooltip/>
    <el-table-column label="案件来源" align="center" prop="ajly"  show-overflow-tooltip/>
    <el-table-column label="机构名称 " align="center" prop="jgmc"  show-overflow-tooltip/>
    <el-table-column label="行政区" align="center" prop="xzq"  show-overflow-tooltip/>
    <el-table-column label="涉及规则数" align="center" prop="sjwgs"  show-overflow-tooltip/>
    <el-table-column label="涉及就诊人数" align="center" prop="sjjzrs"  show-overflow-tooltip/>
    <el-table-column label="涉及金额(元)" align="center" prop="ydje"  show-overflow-tooltip/>
    <el-table-column label="批次号" align="center" prop="rwpcid"  show-overflow-tooltip/>
    <el-table-column label="机构代码" align="center" prop="jgdm" show-overflow-tooltip/>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row)"
        >查看相关明细</el-button>
        <el-button
          size="mini"
          type="text"
          @click="checkdetailAll(scope.row)"
        >全明细</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name:'RenwutwoTable',
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
    },
    checkdetailAll(row){
      this.$emit('checkdetailAll',row)
    }
  }
}
</script>