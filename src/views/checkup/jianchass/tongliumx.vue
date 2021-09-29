/**项目流水号汇总 第5层数据*/
<template>
  <el-table v-show="!showLog" class="qztable" :row-class-name="tableRowClassName"  ref="multipleTable" :data="tableData" border height="100%" style="width:100%;margin-top:10px">
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="就医类型" align="center" prop="jslb" />
    <el-table-column label="险种" align="center" prop="ybbf" />
    <el-table-column label="交易流水号" align="center" prop="lsh"  :width="flexColumnWidth('lsh',tableData)"/>
    <el-table-column label="参保人卡号" align="center" prop="kh"  :width="flexColumnWidth('kh',tableData)"/>
    <el-table-column label="参保人姓名" align="center" prop="xm"/>
    <el-table-column label="科室代码" align="center" prop="ksdm"  :width="flexColumnWidth('ksdm',tableData)"/>
    <el-table-column label="科室名称" align="center" prop="ksmc"  :width="flexColumnWidth('ksmc',tableData)"/>
    <el-table-column label="医师代码" align="center" prop="ysgh"  :width="flexColumnWidth('ysgh',tableData)"/>
    <el-table-column label="医师姓名" align="center" prop="ysxm"  :width="flexColumnWidth('ysxm',tableData)"/>
    <el-table-column label="结算日期" align="center" prop="jyrq"  width="110">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.jyrq, '{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结算日期时间" align="center" prop="jsrqsj"  :width="flexColumnWidth('jsrqsj',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.jsrqsj) }}</span>
      </template>
    </el-table-column>
     <el-table-column label="明细项目使用时间" align="center" prop="mxxmsysj"  :width="flexColumnWidth('mxxmsysj',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.mxxmsysj) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目编号" align="center" prop="mxxmbm" :width="flexColumnWidth('mxxmbm',tableData)" />
    <el-table-column label="明细项目名称" align="center" prop="mxxmmc" :width="flexColumnWidth('mxxmmc',tableData)" />
    <el-table-column label="通用名" align="center" prop="tym" :width="flexColumnWidth('tym',tableData)" />
    <el-table-column label="明细项目单位" align="center" prop="mxxmdw"/>
    <el-table-column label="明细项目单价(元)" align="center" prop="mxxmdj" :width="flexColumnWidth('mxxmdj',tableData)">
        <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmdj,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目数量" align="center" prop="mxxmsl" :width="flexColumnWidth('mxxmsl',tableData)" />
    <el-table-column label="明细项目医保结算范围费用(元)" align="center" prop="mxxmbjsfy" :width="flexColumnWidth('mxxmbjsfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmbjsfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="费用类别" align="center" prop="fylb" :formatter="fylbFormat"  show-overflow-tooltip/>
  </el-table>
</template>
<script>
export default {
  name:'Tongliumx',
  data(){
    return {
      wsCheck:'',
      showLog:false,
      logList:[]
    }
  },
  props:['tableData','gzmc'],
  methods:{
    fylbFormat(row, column) {
      return this.selectDictLabel(this.$store.getters.fyDic, row.fylb);
    },
    radioChange(e){
      const selection = this.tableData.filter(item=>{
        return item.id === e
      })
      this.$emit('radio-change',selection)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
    },
    checkLog(row){
      // this.showLog = true
      // this.logList = [row]
      this.$emit('on-log',row,5)
    },
    checkMx(row){
      this.$emit('check-mx',row)
    },
    // closedetail(){
    //   this.showLog = false
    //   this.$emit('on-close')
    // },
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
        className = row.xwrd.indexOf('未发现违规')>-1?'xwrd-table-row-normal':'xwrd-table-row'
      } else {
        className = ''
      }
      if(row.isyd && row.isyd==1){
        className+=" isyd-row"
      }
      return  className
    }
  },
  components:{
    // OperateLog
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