<template>
    <div style="height:100%;width:100%">
      <el-table border v-loading="loading" :data="tableData" height="100%" style="width:100%">
        <el-table-column label="序号" type="index" align="center"  />
        <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
        <el-table-column label="机构名称" align="center" prop="jgmc" :width="flexColumnWidth('jgmc',tableData)"/>
        <el-table-column label="规则分类" align="center" prop="gzfl" :width="flexColumnWidth('gzfl',tableData)"/>
        <el-table-column label="规则名称" align="center" prop="gzmc" :width="flexColumnWidth('gzmc',tableData)"/>
        <el-table-column label="医师代码" align="center" prop="ysgh" :width="flexColumnWidth('ysgh',tableData)" />
        <el-table-column label="医师姓名" align="center" prop="ysxm" :width="flexColumnWidth('ysxm',tableData)" />
        <el-table-column label="参保人卡号" align="center" prop="kh" :width="flexColumnWidth('kh',tableData)" />
        <el-table-column label="参保人姓名" align="center" prop="xm" :width="flexColumnWidth('xm',tableData)" />
        <el-table-column label="结算日期" align="center" prop="jsrqsj" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.jsrqsj,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细项目编号" align="center" prop="mxxmbh" :width="flexColumnWidth('mxxmbh',tableData)" />
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
        <el-table-column label="费用类别" align="center" prop="fylb" />
      </el-table>
    <pagination
      style="float:right"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :pageSizes="[50,100,150,200]"
        size="small"
        @pagination="getList"
      />
    </div>
    <!-- </el-drawer> -->
</template>
<script>
import { getXGMX } from "@/api/renwu/mingxi";
export default {
  name:'Quanmx',
  data() {
    return{
      loading:false,
      tableData:[],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:50
      }
    }
  },
  props:['options'],
  created(){
    this.getList()
  },
  methods:{
    /** 查询renwuthree列表 */
    async getList(query) {
      this.loading = true
      let params = {...this.options.query,...this.queryParams}
      query && (params={...params,...query})
      try {
        const res = await getXGMX(params)
        this.tableData = res.rows;
        this.total = res.total;
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
  },
  watch:{
    'options.show'(n){
      if(n){
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sys-drawer {
  &::v-deep .el-drawer {
    height: 400px !important;
    .el-drawer__header {
      padding: 0;
      margin-bottom: 0;
    }
  }
}
</style>