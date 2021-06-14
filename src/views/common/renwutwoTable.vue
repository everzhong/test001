<template>
  <el-table :data="tableData" @selection-change="handleSelectionChange" border>
    <el-table-column type="selection" width="55" align="center"/>
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="任务批次号" align="center" prop="rwpcid"  show-overflow-tooltip/>
    <el-table-column label="统一社会信用代码" align="center" prop="xydm"  show-overflow-tooltip/>
     <el-table-column label="机构代码" align="center" prop="jgdm" show-overflow-tooltip/>
    <el-table-column label="机构名称" align="center" prop="jgmc"  show-overflow-tooltip/>
    <el-table-column label="行政区" align="center" prop="xzq"  show-overflow-tooltip/>
    <el-table-column label="结算等级" align="center" prop="jsdj"  show-overflow-tooltip/>
    <el-table-column label="险种" align="center" prop="ybbf"  show-overflow-tooltip/>
    <el-table-column label="就医类型" align="center" prop="jslb"  show-overflow-tooltip/>
    <el-table-column label="异地/本地" align="center" prop="ybd"  show-overflow-tooltip/>
    <el-table-column label="数据开始日期" align="center" prop="datastarttime"  show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.datastarttime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="数据结束日期" align="center" prop="dataendtime" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结算金额" align="center" prop="jsje"  show-overflow-tooltip/>
    <el-table-column label="结算人次" align="center" prop="jsrc"  show-overflow-tooltip/>
    <el-table-column label="涉及违规数" align="center" prop="sjwgs"  show-overflow-tooltip/>
    <el-table-column label="第三方查询状态" align="center">
      <template slot-scope="scope">
        <span>{{(scope.row.sancha && scope.row.sancha==1)?'已查':'未查'}}</span>
      </template>
    </el-table-column>
    <el-table-column label="疑点金额" align="center" prop="ydje"  show-overflow-tooltip/>
    <!-- <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row)"
        >查看明细</el-button>
      </template>
    </el-table-column> -->
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
    }
  }
}
</script>