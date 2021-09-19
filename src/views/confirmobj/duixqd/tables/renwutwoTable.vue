<template>
  <el-table :data="tableData" @selection-change="handleSelectionChange" border style="width:100%" height="100%">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="序号" type="index" align="center"  />
    <el-table-column label="网审意见" align="center" prop="wsyj"  :width="flexColumnWidth('wsyj',tableData)"/>
    <el-table-column label="网审人员" align="center" prop="wsry"  :width="flexColumnWidth('wsry',tableData)"/>
    <el-table-column label="监管状态" align="center" width="150"><template>待对象确定</template></el-table-column>
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="统一社会信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/>
     <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="行政区" align="center" prop="xzq"  :width="flexColumnWidth('xzq',tableData)"/>
    <el-table-column label="结算等级" align="center" prop="jsdj"  :width="flexColumnWidth('jsdj',tableData)"/>
    <el-table-column label="险种" align="center" prop="ybbf"  :width="flexColumnWidth('ybbf',tableData)"/>
    <el-table-column label="就医类型" align="center" prop="jslb"  :width="flexColumnWidth('jslb',tableData)"/>
    <el-table-column label="异地/本地" align="center" prop="ybd"  :width="flexColumnWidth('ybd',tableData)"/>
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
    <el-table-column label="结算金额" align="center" prop="jsje"  :width="flexColumnWidth('jsje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.jsje,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="涉及规则数" align="center" prop="sjwgs"  :width="flexColumnWidth('sjwgs',tableData)"/>
    <el-table-column label="第三方筛查状态" align="center">
      <template slot-scope="scope">
        <span>{{(scope.row.sancha && scope.row.sancha==1)?'已查':'未查'}}</span>
      </template>
    </el-table-column>
    <el-table-column label="疑点金额" align="center" prop="ydje"  :width="flexColumnWidth('ydje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.ydje,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="涉及就诊人次" align="center" prop="jsrc"  :width="flexColumnWidth('jsrc',tableData)"/>
    <!-- <el-table-column label="操作" align="center" width="150">
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
      this.$emit('check-mx',row)
    }
  },
}
</script>