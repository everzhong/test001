<template>
  <el-drawer :show-close="false" class="sys-drawer" direction="btt"  width="100%" :visible.sync="options.show">
    <div style="height:320px" v-loading="loading">
      <el-table border v-loading="loading" :data="renwuthreeList" height="100%">
        <el-table-column label="序号" align="center" width="50" prop="id" show-overflow-tooltip/>
        <el-table-column label="机构代码" align="center" prop="jgdm" show-overflow-tooltip/>
        <el-table-column label="机构名称" align="center" prop="jgmc" show-overflow-tooltip/>
        <el-table-column label="规则分类" align="center" prop="gzfl"  show-overflow-tooltip/>
        <el-table-column label="规则名称" align="center" prop="gzmc" show-overflow-tooltip/>
        <el-table-column label="涉及就诊人数" align="center" prop="xjjzrs"  show-overflow-tooltip/>
        <el-table-column label="涉及明细数" align="center" prop="xjmxs" show-overflow-tooltip/>
        <el-table-column label="涉及金额" align="center" prop="xjje" show-overflow-tooltip/>
        <el-table-column label="结算费用" align="center" prop="jsfy" show-overflow-tooltip/>
        <el-table-column label="险种" align="center" prop="ybbf"  show-overflow-tooltip/>
        <el-table-column label="行政区" align="center" prop="xzq" show-overflow-tooltip/>
        <el-table-column label="就医类型" align="center" prop="jslb"  show-overflow-tooltip/>
        <el-table-column label="异本地" align="center" prop="ybd"  show-overflow-tooltip/>
        <el-table-column label="数据开始时间" align="center" prop="datastarttime"  show-overflow-tooltip/>
        <el-table-column label="信用代码" align="center" prop="xydm" show-overflow-tooltip/>
        <el-table-column label="添加时间" align="center" prop="addtime"  show-overflow-tooltip/>
        <el-table-column label="结算等级" align="center" prop="jsdj"  show-overflow-tooltip/>
        <el-table-column label="机构核实意见" align="center" prop="hsyj" show-overflow-tooltip/>
        <el-table-column label="核实状态" align="center" prop="hszt"  show-overflow-tooltip/>
        <el-table-column label="核实时间" align="center" prop="hssj"  show-overflow-tooltip/>
        <el-table-column label="核实人" align="center" prop="hsr"  show-overflow-tooltip/>
        <el-table-column label="核实派发时间" align="center" prop="hspfsj"  show-overflow-tooltip/>
        <el-table-column label="任务批次号" align="center" prop="rwpcid"  show-overflow-tooltip/>
        <el-table-column label="已发送回智审" align="center" prop="issend"  show-overflow-tooltip/>
      </el-table>
    </div>
    <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :pageSizes="[50,100,150,200]"
        size="small"
        @pagination="getList"
      />
    </el-drawer>
</template>
<script>
import { listRenwuthree } from "@/api/renwu/renwuthree";
export default {
  name:'Quanmx',
  data() {
    return{
      loading:false,
      renwuthreeList:[],
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
    async getList() {
      this.loading = true
      const params = {...this.options.query,...this.queryParams}
      try {
        const res = await listRenwuthree(params)
        this.renwuthreeList = res.rows;
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