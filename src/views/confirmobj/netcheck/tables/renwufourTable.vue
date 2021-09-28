<template>
<div :style="{minHeight:'360px',height:tableHeight}">
  <el-table :data="tableData" border @selection-change="handleSelectionChange" height="100%" style="width:100%">
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  width="350" show-overflow-tooltip/>
    <el-table-column label="明细项目编号" align="center" prop="mxxmbm"  :width="flexColumnWidth('mxxmbm',tableData)"/>
    <el-table-column label="明细项目名称" align="center" prop="mxxmmc"  :width="flexColumnWidth('mxxmmc',tableData)"/>
    <el-table-column label="通用名" align="center" prop="tym"  :width="flexColumnWidth('tym',tableData)"/>
    <el-table-column label="明细项目单价(元)" align="center" prop="mxxmdj" :width="flexColumnWidth('mxxmdj',tableData)">
        <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmdj,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目数量" align="center" prop="mxxmsl"  show-overflow-tooltip/>
    <el-table-column label="明细项目金额(元)" align="center" prop="mxxmje"  :width="flexColumnWidth('mxxmje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmje,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目交易金额(元)" align="center" prop="mxxmjyfy"  :width="flexColumnWidth('mxxmjyfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmjyfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="明细项目医保结算金额(元)" align="center" prop="mxxmbjsfy"  :width="flexColumnWidth('mxxmbjsfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmbjsfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="费用类别" align="center" prop="fylb" />
    <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="统一社会信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/>
    <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="checkdetail(scope.row)"
          >查看相关明细</el-button>
        </template>
      </el-table-column>
  </el-table>
</div>
</template>
<script>
export default {
  name:'RenwufourTable',
  data(){
    return {
      tableHeight:0
    }
  },
  props:['tableData'],
  mounted(){
    this.tableHeight = document.body.offsetHeight - 50-34-118-40-70-20+'px';
  },
  methods:{
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
      // this.ids = selection.map(item => item.rwpcid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
    checkdetail(row){
      this.$emit('check-xgmx',row)
    }
  }
}
</script>