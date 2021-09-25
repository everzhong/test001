<template>
  <!-- <el-drawer :show-close="false" class="sys-drawer" direction="btt"  width="100%" :visible.sync="options.show"> -->
    <div style="height:100%;width:100%">
      <el-table border v-loading="loading" :data="tableData" height="100%" style="width:100%">
        <!-- <el-table-column label="序号" align="center" width="50"  type="index"/>
        <el-table-column label="案件来源" align="center" prop="ajly" :width="flexColumnWidth('ajly',tableData)"/>
        <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
        <el-table-column label="机构名称" align="center" prop="jgmc" :width="flexColumnWidth('jgmc',tableData)"/>
        <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
        <el-table-column label="规则名称" align="center" prop="gzmc" width="350" show-overflow-tooltip/>
        <el-table-column label="涉及就诊人员数" align="center" prop="xjjzrs"  :width="flexColumnWidth('xjjzrs',tableData)"/>
        <el-table-column label="涉及明细数" align="center" prop="xjmxs" :width="flexColumnWidth('xjmxs',tableData)"/>
        <el-table-column label="涉及金额" align="center" prop="xjje" :width="flexColumnWidth('xjje',tableData)"/>
        <el-table-column label="结算费用" align="center" prop="jsfy" :width="flexColumnWidth('jsfy',tableData)"/>
        <el-table-column label="险种" align="center" prop="ybbf" />
        <el-table-column label="行政区" align="center" prop="xzq" :width="flexColumnWidth('xzq',tableData)"/>
        <el-table-column label="就医类型" align="center" prop="jslb" />
        <el-table-column label="异本地" align="center" prop="ybd" />
        <el-table-column label="数据开始时间" align="center" prop="datastarttime" :width="flexColumnWidth('datastarttime',tableData)"/>
        <el-table-column label="信用代码" align="center" prop="xydm" :width="flexColumnWidth('xydm',tableData)"/>
        <el-table-column label="添加时间" align="center" prop="addtime" :width="flexColumnWidth('addtime',tableData)"/>
        <el-table-column label="结算等级" align="center" prop="jsdj" :width="flexColumnWidth('jsdj',tableData)"/>
        <el-table-column label="机构核实意见" align="center" prop="hsyj" :width="flexColumnWidth('hsyj',tableData)"/>
        <el-table-column label="核实状态" align="center" prop="hszt"  :width="flexColumnWidth('hszt',tableData)"/>
        <el-table-column label="核实时间" align="center" prop="hssj" :width="flexColumnWidth('hssj',tableData)"/>
        <el-table-column label="核实人" align="center" prop="hsr"  :width="flexColumnWidth('hsr',tableData)"/>
        <el-table-column label="核实派发时间" align="center" prop="hspfsj" :width="flexColumnWidth('hspfsj',tableData)"/>
        <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
        <el-table-column label="已发送回智审" align="center" prop="issend">
          <template slot-scope="scope">
            <span>{{scope.row.issend*1===1?'是':'否'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="序号" type="index" align="center"  />
        <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
        <el-table-column label="机构名称" align="center" prop="jgmc" :width="flexColumnWidth('jgmc',tableData)"/>
        <el-table-column label="规则分类" align="center" prop="gzfl" :width="flexColumnWidth('gzfl',tableData)"/>
        <el-table-column label="规则明称" align="center" prop="gzmc" :width="flexColumnWidth('gzmc',tableData)"/>
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