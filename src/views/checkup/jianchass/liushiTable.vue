/**项目流水号汇总 第四层数据*/
<template>
<div class="liushui-table" :style="{height:tableHeight,marginTop:'10px'}">
  <el-table :row-class-name="tableRowClassName" class="qztable" ref="multipleTable" :data="tableData" border height="100%">
    <!-- <el-table-column type="selection" width="55" align="center"  /> -->
    <el-table-column  align="center" width="55">
      <template slot-scope="scope">
        <el-radio :label="scope.row.id" v-model="wsCheck" @change="radioChange"></el-radio>
      </template>
    </el-table-column>
    <!-- <el-table-column label="案件来源" align="center" prop="ajly" :width="flexColumnWidth('ajly',tableData)"/> -->
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  width="350" show-overflow-tooltip/>
    <el-table-column label="认定行为" align="center" prop="xwrd"  :width="flexColumnWidth('xwrd',tableData)"/>
    <el-table-column label="备注" align="center" prop="bz"  :width="flexColumnWidth('bz',tableData)"/>
    <el-table-column label="就医类型" align="center" prop="jslb"  :width="flexColumnWidth('jslb',tableData)"/>
    <el-table-column label="险种" align="center" prop="ybbf" />
    <el-table-column label="交易流水号" align="center" prop="lsh"  :width="flexColumnWidth('lsh',tableData)"/>
    <el-table-column label="参保人卡号" align="center" prop="kh"  :width="flexColumnWidth('kh',tableData)"/>
    <el-table-column label="参保人姓名" align="center" prop="xm"  :width="flexColumnWidth('xm',tableData)"/>
    <el-table-column label="身份证号" align="center" prop="sfzh"  :width="flexColumnWidth('sfzh',tableData)"/>
    <el-table-column label="科室代码" align="center" prop="ksbm"  :width="flexColumnWidth('ksbm',tableData)"/>
    <el-table-column label="科室名称" align="center" prop="ksmc"  :width="flexColumnWidth('ksmc',tableData)"/>
    <el-table-column label="明细项目编号" align="center" prop="mxxmbm"  :width="flexColumnWidth('mxxmbm',tableData)"/>
    <el-table-column label="明细项目名称" align="center" prop="mxxmmc"  :width="flexColumnWidth('mxxmmc',tableData)"/>
    <el-table-column label="通用名" align="center" prop="tym"  :width="flexColumnWidth('tym',tableData)"/>
    <!-- <el-table-column label="明细项目单位(次)" align="center" prop="mxxmdw"  :width="flexColumnWidth('mxxmdw',tableData)"/> -->
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
    <el-table-column label="明细项目交易费用(元)" align="center" prop="mxxmjyfy"  :width="flexColumnWidth('mxxmjyfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmjyfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目医保结算费用(元)" align="center" prop="mxxmbjsfy"  :width="flexColumnWidth('mxxmbjsfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmbjsfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="结算日期" align="center" prop="jyrq"/>
    <el-table-column label="追款单价" align="center" prop="zkdj" :width="flexColumnWidth('zkdj',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.zkdj,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="违规数量" align="center" prop="wgsl"/>
    <el-table-column label="违规费用(元)" align="center" prop="wgfy">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.wgfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="费用类别" align="center" prop="fylb" :formatter="fylbFormat"  show-overflow-tooltip/>
    <!-- <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/> -->
    <el-table-column label="操作" align="center"  width="180px">
      <template slot-scope="scope">
        <el-button v-if="!noLog" type="text" @click="operateLog(scope.row)" size="mini">操作记录</el-button>
        <el-button type="text" @click="checkdetail(scope.row)" size="mini">同流水号明细</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
export default {
  name:'LiushuiTable',
  data(){
    return {
      wsCheck:'',
      tableHeight:0
    }
  },
  props:['tableData','fromLog','noLog'],
  mounted(){
    const th = document.body.offsetHeight - 50-34-138-32-152;
    this.tableHeight = this.fromLog?`${th+90}px`:`${th}px` ;
  },
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
.liushui-table {
  min-height: 300px;
}
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
}
</style>