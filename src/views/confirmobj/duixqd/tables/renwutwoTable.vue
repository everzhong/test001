<template>
  <el-table :data="tableData" @selection-change="handleSelectionChange" border>
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="网审意见" align="center" prop="wsyj"  :width="flexColumnWidth('wsyj',tableData)"/>
    <el-table-column label="网审人员" align="center" prop="wsry"  :width="flexColumnWidth('wsry',tableData)"/>
    <el-table-column label="监管状态" align="center" prop="jgzt"  :width="flexColumnWidth('jgzt',tableData)"/>
    <!-- <el-table-column label="案件来源" align="center" prop="ajly"  :width="flexColumnWidth('ajly',tableData)"/>
    <el-table-column label="检查方式" align="center" prop="jcfs"  :width="flexColumnWidth('jcfs',tableData)"/> -->
    <!-- <el-table-column label="统一社会信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/> -->
     <!-- <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/> -->
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="任务名称" align="center" prop="rwmc"  :width="flexColumnWidth('rwmc',tableData)"/>
    <el-table-column label="数据开始日期" align="center" prop="datastarttime"  :width="flexColumnWidth('datastarttime',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.datastarttime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="数据结束日期" align="center" prop="dataendtime" :width="flexColumnWidth('dataendtime',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="机构数量" align="center" prop="jgsl"  :width="flexColumnWidth('jgsl',tableData)"/>
    <el-table-column label="任务推送日期" align="center" prop="dataendtime" :width="flexColumnWidth('dataendtime',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="任务截止日期" align="center" prop="dataendtime" :width="flexColumnWidth('dataendtime',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="就医类型" align="center" prop="jslb"  :width="flexColumnWidth('jslb',tableData)"/>
    <el-table-column label="任务描述" align="center" prop="rwms"  :width="flexColumnWidth('rwms',tableData)"/>
    <el-table-column label="异地/本地" align="center" prop="ybd"  :width="flexColumnWidth('ybd',tableData)"/>
    <el-table-column label="险种" align="center" prop="ybbf"  :width="flexColumnWidth('ybbf',tableData)"/>
    <el-table-column label="涉及金额(元)" align="center" prop="ydje"  :width="flexColumnWidth('ydje',tableData)"/>
    <el-table-column label="状态" align="center" prop="status"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="承办机构" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="状态更新时间" align="center" prop="uptime" :width="flexColumnWidth('uptime',tableData)">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.uptime,'{y}-{m}-{d}') }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" width="150">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row)"
        >查看明细</el-button>
        <el-button
          size="mini"
          type="text"
          @click="checkdetail(scope.row)"
        >全明细</el-button>
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
      this.$emit('check-mx',row)
    }
  },
}
</script>