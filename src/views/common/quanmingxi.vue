<template>
<div style="height:100%">
  <div style="height:100%">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      height="100%"
      style="width:100%"
    >
      <el-table-column label="序号" type="index" align="center"  />
      <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
      <el-table-column label="机构名称" align="center" prop="jgmc" :width="flexColumnWidth('jgmc',tableData)"/>
      <el-table-column label="规则分类" align="center" prop="gzfl" :width="flexColumnWidth('gzfl',tableData)"/>
      <el-table-column label="规则名称" align="center" prop="gzmc" :width="flexColumnWidth('gzmc',tableData)"/>
      <el-table-column label="医师代码" align="center" prop="ysgh" :width="flexColumnWidth('ysgh',tableData)" />
      <el-table-column label="医师姓名" align="center" prop="ysxm" :width="flexColumnWidth('ysxm',tableData)" />
      <el-table-column label="参保人卡号" align="center" prop="kh" :width="flexColumnWidth('kh',tableData)" />
      <el-table-column label="参保人姓名" align="center" prop="xm" :width="flexColumnWidth('xm',tableData)" />
      <el-table-column label="险种" align="center" prop="ybbf" :width="flexColumnWidth('ybbf',tableData)" />
        <el-table-column label="就医类型" align="center" prop="jslb" :width="flexColumnWidth('jslb',tableData)" />
       <el-table-column label="结算日期" align="center" prop="jsrqsj" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.jsrqsj,'{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="明细项目编号" align="center" prop="mxxmbm" :width="flexColumnWidth('mxxmbm',tableData)" />
      <el-table-column label="明细项目名称" align="center" prop="mxxmmc" :width="flexColumnWidth('mxxmmc',tableData)" />
      <el-table-column label="通用名" align="center" prop="tym" :width="flexColumnWidth('tym',tableData)" />
      <el-table-column label="明细项目单价(元)" align="center" prop="mxxmdj" :width="flexColumnWidth('mxxmdj',tableData)">
        <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmdj,3)}}</span>
      </template>
      </el-table-column>
      <el-table-column label="明细项目数量" align="center" prop="mxxmsl" :width="flexColumnWidth('mxxmsl',tableData)" />
      <el-table-column label="明细项目金额(元)" align="center" prop="mxxmje" :width="flexColumnWidth('mxxmje',tableData)">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmje,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="明细项目交易金额(元)" align="center" prop="mxxmjyfy" :width="flexColumnWidth('mxxmjyfy',tableData)">
        <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmjyfy,2)}}</span>
      </template>
      </el-table-column>
      <el-table-column label="明细项目医保结算金额(元)" align="center" prop="mxxmbjsfy" :width="flexColumnWidth('mxxmbjsfy',tableData)">
        <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmbjsfy,2)}}</span>
      </template>
      </el-table-column>
      <el-table-column label="费用类别" align="center" prop="fylb" :formatter="fylbFormat"  show-overflow-tooltip/>
    </el-table>
  </div>
  <pagination
   style="float:right"
    :total="total"
    :page.sync="queryParams.pageNum"
    :limit.sync="queryParams.pageSize"
    :autoScroll="false"
    @pagination="getList" />
  </div>
</template>
<script>
import {getQMX} from '@/api/renwu/mingxi'
export default {
  name:"Quanmingxi",
  data(){
    return {
      loading:false,
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:10
      },
      tableData:[]
    }
  },
  props:['options'],
  created(){
    this.getList()
  },
  methods:{
    fylbFormat(row, column) {
      return this.selectDictLabel(this.$store.getters.fyDic, row.fylb);
    },
    async getList(){
      this.loading = true;
      const params = {...this.queryParams,...this.options.query}
      try {
        const res = await getQMX(params);
        if(res.code==200){
          this.tableData = res.rows
          this.total = res.total
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    }
  }
}
</script>