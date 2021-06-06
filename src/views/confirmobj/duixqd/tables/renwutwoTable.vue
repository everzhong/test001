<template>
  <el-table :data="tableData" @selection-change="handleSelectionChange" border>
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="网审意见" align="center" prop="wsyj"  show-overflow-tooltip/>
    <el-table-column label="网审人员" align="center" prop="wsry"  show-overflow-tooltip/>
    <el-table-column label="监管状态" align="center" prop="jgzt"  show-overflow-tooltip/>
    <!-- <el-table-column label="案件来源" align="center" prop="ajly"  show-overflow-tooltip/>
    <el-table-column label="检查方式" align="center" prop="jcfs"  show-overflow-tooltip/> -->
    <!-- <el-table-column label="统一社会信用代码" align="center" prop="xydm"  show-overflow-tooltip/> -->
     <!-- <el-table-column label="机构代码" align="center" prop="jgdm" show-overflow-tooltip/> -->
    <el-table-column label="批次号" align="center" prop="rwpcid"  show-overflow-tooltip/>
    <el-table-column label="任务名称" align="center" prop="rwmc"  show-overflow-tooltip/>
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
    <el-table-column label="机构数量" align="center" prop="jgsl"  show-overflow-tooltip/>
    <el-table-column label="任务推送日期" align="center" prop="dataendtime" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="任务截止日期" align="center" prop="dataendtime" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="就医类型" align="center" prop="jslb"  show-overflow-tooltip/>
    <el-table-column label="任务描述" align="center" prop="rwms"  show-overflow-tooltip/>
    <el-table-column label="异地/本地" align="center" prop="ybd"  show-overflow-tooltip/>
    <el-table-column label="险种" align="center" prop="ybbf"  show-overflow-tooltip/>
    <el-table-column label="涉及金额(元)" align="center" prop="ydje"  show-overflow-tooltip/>
    <el-table-column label="状态" align="center" prop="status"  show-overflow-tooltip/>
    <el-table-column label="承办机构" align="center" prop="jgmc"  show-overflow-tooltip/>
    <el-table-column label="状态更新时间" align="center" prop="uptime" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.uptime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row)"
        >调查取证</el-button>
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
    }
  }
}
</script>