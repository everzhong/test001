/**项目流水号汇总 第5层数据*/
<template>
  <el-table class="qztable" :row-class-name="tableRowClassName"  ref="multipleTable" :data="tableData" border style="margin-top:10px">
    <!-- <el-table-column type="selection" width="55" align="center" /> -->
    <el-table-column  align="center" width="55">
      <template slot-scope="scope">
        <el-radio :label="scope.row.id" v-model="wsCheck" @change="radioChange"></el-radio>
      </template>
    </el-table-column>
    <el-table-column label="就医类型" align="center" prop="jglx"  show-overflow-tooltip/>
    <el-table-column label="险种" align="center" prop="gzfl"  show-overflow-tooltip/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  show-overflow-tooltip/>
    <el-table-column label="交易流水号" align="center" prop="xwrd"  show-overflow-tooltip/>
    <el-table-column label="参保人卡号" align="center" prop="beizhu"  show-overflow-tooltip/>
    <el-table-column label="参保人姓名" align="center" prop="mxxmbm"  show-overflow-tooltip/>
    <el-table-column label="科室代码" align="center" prop="mxxmmc"  show-overflow-tooltip/>
    <el-table-column label="科室名称" align="center" prop="tym"  show-overflow-tooltip/>
    <el-table-column label="医师代码" align="center" prop="mxxmdj"  show-overflow-tooltip/>
    <el-table-column label="医师姓名" align="center" prop="mxxmsl"  show-overflow-tooltip/>
    <el-table-column label="结算日期" align="center" prop="mxxmje"  show-overflow-tooltip/>
    <el-table-column label="结算日期时间" align="center" prop="mxxmjyfy"  show-overflow-tooltip/>
    <el-table-column label="明细项目使用时间(元)" align="center" prop="mxxmbjsfy"  show-overflow-tooltip/>
    <el-table-column label="操作" align="center" show-overflow-tooltip width="110px">
      <template slot-scope="scope">
        <el-button type="text" @click="checkdetail(scope.row)">操作记录</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name:'Tongliumx',
  data(){
    return {
      wsCheck:''
    }
  },
  props:['tableData'],
  methods:{
    radioChange(e){
      const selection = this.tableData.filter(item=>{
        return item.id === e
      })
      this.$emit('radio-change',selection)
    },
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
    selectAll(){
      this.tableData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    clearAll(){
      this.$refs.multipleTable.clearSelection()
    },
    tableRowClassName({row}){
      if(row.xwrd){
        return 'xwrd-table-row'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
}
</style>