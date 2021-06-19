/**项目流水号汇总 第四层数据*/
<template>
  <div class="operate-log">
    <div class="head-close">
      <span class="title">操作记录</span>
      <span class="el-icon-close" @click="$emit('on-close')"></span>
    </div>
    <el-table class="qztable" ref="multipleTable" :data="tableData" border>
      <el-table-column label="序号" align="center" type="index"  width="50"/>
      <el-table-column label="标记人" align="center" prop="jgmc" />
      <el-table-column label="标记时间" align="center" prop="jsrqsj">
        <template slot-scope="scope" :width="flexColumnWidth('jsrqsj',tableData)">
          <span>{{parseTime(scope.row.jsrqsj, '{y}-{m}-{d} {h}:{s}')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="追款单价(元)" align="center" prop="zkdj"  />
      <el-table-column label="违规数量" align="center" prop="wgsl"  />
      <el-table-column label="违规费用(元)" align="center" prop="wgfy">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.wgfy,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="行为认定" align="center" prop="xwrd"  />
      <el-table-column label="备注" align="center" prop="bz"  :width="flexColumnWidth('bz',tableData)"/>
    </el-table>
  </div>
</template>
<script>
export default {
  name:"OperateLog",
  data(){
    return {
    }
  },
  props:["tableData"]
}
</script>
<style lang="scss" scoped>
.operate-log{
  margin-top:10px;
  .head-close {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
    line-height: 32px;
    padding-left:15px;
    padding-right:10px;
    // background-color: #f8f8f9;
    border-top:1px solid #cecece;
    border-left:1px solid #cecece;
    border-right:1px solid #cecece;
    .title {
      font-size: 14px;
      font-weight: 600;
    }
    .el-icon-close {
      cursor: pointer;
    }
  }
}
</style>

