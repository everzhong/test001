<template>
<div :style="{minHeight:'300px',height:tableHeight}">
  <el-table :data="tableData" @selection-change="handleSelectionChange" height="100%" border>
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="监管状态" align="center"><template>待网审</template></el-table-column>
    <el-table-column label="案件来源" align="center" prop="ajly" />
    <el-table-column label="机构名称 " align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="行政区" align="center" prop="xzq"  :width="flexColumnWidth('xzq',tableData)"/>
    <el-table-column label="涉及规则数" align="center" prop="sjwgs"/>
    <el-table-column label="疑点金额" align="center" prop="ydje"  :width="flexColumnWidth('ydje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.ydje,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="涉及就诊人员数" align="center" prop="jsrc"/>
    <el-table-column label="驳回意见" align="center" prop="dxqdbh"  :width="flexColumnWidth('dxqdbh',tableData)"/>
    <el-table-column label="操作" align="center" width="150">
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
      tableHeight:0
    }
  },
  props:['tableData'],
  mounted(){
    this.tableHeight = document.body.offsetHeight - 50-34-118-32-70-50-40+'px';
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
    }
  }
}
</script>