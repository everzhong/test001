<template>
<div :style="{minHeight:'300px',height:tableHeight}">
  <el-table :data="tableData" @selection-change="handleSelectionChange" height="100%" border>
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="监管状态" align="center"><template>待网审</template></el-table-column>
    <el-table-column label="驳回意见" align="center" prop="dxqdbh"  :width="flexColumnWidth('dxqdbh',tableData)"/>
    <el-table-column label="案件来源" align="center" prop="ajly" show-overflow-tooltip/>
    <el-table-column label="检查方式" align="center" >
      <template><span>规则筛查</span></template>
    </el-table-column>
    <el-table-column label="机构名称 " align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="险种" align="center" prop="ybbf" />
      <el-table-column label="就医类型" align="center" prop="jslb"  :width="flexColumnWidth('jslb',tableData)"/>
      <el-table-column label="数据开始日期" align="center" prop="datastarttime"  :width="flexColumnWidth('datastarttime',tableData)">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.datastarttime,'{y}-{m}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据结束日期" align="center" prop="dataendtime" :width="flexColumnWidth('dataendtime',tableData)">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="行政区" align="center" prop="xzq" :formatter="xzqFormat"  show-overflow-tooltip/>
         <el-table-column label="涉及规则数" align="center" prop="sjwgs"  :width="flexColumnWidth('sjwgs',tableData)"/>
        <el-table-column label="涉及就诊人员数" align="center" prop="jsrc"  :width="flexColumnWidth('jsrc',tableData)"/>
        <el-table-column label="涉及金额(元)" align="center" prop="ydje"  :width="flexColumnWidth('ydje',tableData)">
            <template slot-scope="scope">
            <span>{{formatMoney(scope.row.ydje,2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
        <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="checkdetail(scope.row,'xgmx')"
          >查看相关明细</el-button>
          <el-button
            size="mini"
            type="text"
            @click="checkdetail(scope.row,'qmx')"
          >全明细</el-button>
        </template>
      </el-table-column>
  </el-table>
</div>
</template>
<script>
export default {
  name:'RenwutwoTable',
  data(){
    return {
      tableHeight:0,
      xzqOptions:[]
    }
  },
  props:['tableData'],
  created(){
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
  },
  mounted(){
    this.tableHeight = document.body.offsetHeight - 50-34-118-40-70-50-35+'px';
  },
  methods:{
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
    },
    checkdetail(row,key){
      this.$emit('check-mx',row,key)
    },
    checkdetailAll(row){
      this.$emit('check-mx',row,key)
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
    },
  }
}
</script>