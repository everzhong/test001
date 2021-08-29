/**项目流水号汇总 第四层数据*/
<template>
  <el-table :row-class-name="tableRowClassName" class="qztable" ref="multipleTable" :data="tableData" border  style="margin-top:10px">
    <!-- <el-table-column type="selection" width="55" align="center"  /> -->
    <el-table-column  align="center" width="55">
      <template slot-scope="scope">
        <el-radio :label="scope.row.id" v-model="wsCheck" @change="radioChange"></el-radio>
      </template>
    </el-table-column>
    <el-table-column label="案件来源" align="center" prop="ajly" :width="flexColumnWidth('ajly',tableData)"/>
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
    <el-table-column label="认定行为" align="center" prop="xwrd"  :width="flexColumnWidth('xwrd',tableData)"/>
    <el-table-column label="备注" align="center" prop="beizhu"  :width="flexColumnWidth('beizhu',tableData)"/>
    <el-table-column label="明细项目编号" align="center" prop="mxxmbm"  :width="flexColumnWidth('mxxmbm',tableData)"/>
    <el-table-column label="明细项目名称" align="center" prop="mxxmmc"  :width="flexColumnWidth('mxxmmc',tableData)"/>
    <el-table-column label="通用名" align="center" prop="tym"  :width="flexColumnWidth('tym',tableData)"/>
    <el-table-column label="明细项目单价(元)" align="center" prop="mxxmdj">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmdj,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目数量" align="center" prop="mxxmsl" />
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
    <el-table-column label="费用类别" align="center" prop="fylb"/>
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="操作" align="center"  width="180px">
      <template slot-scope="scope">
        <el-button type="text" @click="operateLog(scope.row)" size="mini">操作记录</el-button>
        <el-button type="text" @click="checkdetail(scope.row)" size="mini">相关明细</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name:'LiushuiTable',
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
    //操作记录
    operateLog(row){
      this.$emit('on-log',row,4)
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
      let className = ''
      if(row.xwrd){
        className = row.xwrd.indexOf('未发现违规')>-1?'xwrd-table-row-normal':'xwrd-table-row';
      } else {
        className = ''
      }
      return  className    
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