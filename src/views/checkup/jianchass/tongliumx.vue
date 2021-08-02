/**项目流水号汇总 第5层数据*/
<template>
<div>
  <el-table v-show="!showLog" class="qztable" :row-class-name="tableRowClassName"  ref="multipleTable" :data="tableData" border style="margin-top:10px">
    <!-- <el-table-column type="selection" width="55" align="center" /> -->
    <el-table-column  align="center" width="55">
      <template slot-scope="scope">
        <el-radio :label="scope.row.id" v-model="wsCheck" @change="radioChange"></el-radio>
      </template>
    </el-table-column>
    <el-table-column label="案件来源" align="center" prop="ajly" :width="flexColumnWidth('ajly',tableData)"/>
    <el-table-column label="就医类型" align="center" prop="jslb" />
    <el-table-column label="险种" align="center" prop="ybbf" />
    <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
    <el-table-column label="交易流水号" align="center" prop="lsh"  :width="flexColumnWidth('lsh',tableData)"/>
    <el-table-column label="参保人卡号" align="center" prop="beizhu"  :width="flexColumnWidth('beizhu',tableData)"/>
    <el-table-column label="参保人姓名" align="center" prop="xm"/>
    <el-table-column label="科室代码" align="center" prop="ksdm"  :width="flexColumnWidth('ksdm',tableData)"/>
    <el-table-column label="科室名称" align="center" prop="ksmc"  :width="flexColumnWidth('ksmc',tableData)"/>
    <el-table-column label="医师代码" align="center" prop="mxxmdj"  :width="flexColumnWidth('mxxmdj',tableData)"/>
    <el-table-column label="医师姓名" align="center" prop="mxxmsl"  :width="flexColumnWidth('mxxmsl',tableData)"/>
    <el-table-column label="结算日期" align="center" prop="jsrqsj"  width="110">
       <template slot-scope="scope">
        <span>{{ parseTime(scope.row.jsrqsj, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结算日期时间" align="center" prop="jsrqsj"  :width="flexColumnWidth('jsrqsj',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.jsrqsj, '{y}-{m}-{d} {h}:{s}:{s}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目使用时间" align="center" prop="mxxmsysj"  :width="flexColumnWidth('mxxmsysj',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.mxxmsysj, '{y}-{m}-{d} {h}:{s}:{s}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="80px">
      <template slot-scope="scope">
        <el-button type="text" @click="checkdetail(scope.row)" size="mini">操作记录</el-button>
      </template>
    </el-table-column>
  </el-table>
  <operate-log v-if="showLog" @on-close="closedetail" :tableData="logList"></operate-log>
</div>
</template>
<script>
import OperateLog from './operateLog.vue'
export default {
  name:'Tongliumx',
  data(){
    return {
      wsCheck:'',
      showLog:false,
      logList:[]
    }
  },
  props:['tableData','options'],
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
      this.showLog = true
      this.logList = [row]
      this.$emit('checkdetail',row)
    },
    closedetail(){
      this.showLog = false
      this.$emit('on-close')
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
  },
  components:{
    OperateLog
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