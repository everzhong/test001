<template>
  <el-drawer direction="btt"  width="100%" :visible.sync="options.show">
    <div style="padding-bottom:100px">
      <el-table v-loading="loading" :data="renwuthreeList">
        <el-table-column label="序号" align="center" prop="id" />
        <el-table-column label="机构代码" align="center" prop="jgdm" />
        <el-table-column label="机构名称" align="center" prop="jgmc" />
        <el-table-column label="规则分类" align="center" prop="gzfl"  />
        <el-table-column label="规则名称" align="center" prop="gzmc" />
        <el-table-column label="涉及就诊人数" align="center" prop="xjjzrs"  />
        <el-table-column label="涉及明细数" align="center" prop="xjmxs"/>
        <el-table-column label="涉及金额" align="center" prop="xjje" />
        <el-table-column label="结算费用" align="center" prop="jsfy" />
        <el-table-column label="险种" align="center" prop="ybbf"  />
        <el-table-column label="行政区" align="center" prop="xzq"/>
        <el-table-column label="就医类型" align="center" prop="jslb"  />
        <el-table-column label="异本地" align="center" prop="ybd"  />
        <el-table-column label="数据开始时间" align="center" prop="datastarttime"  />
        <el-table-column label="信用代码" align="center" prop="xydm" />
        <el-table-column label="添加时间" align="center" prop="addtime"  />
        <el-table-column label="结算等级" align="center" prop="jsdj"  />
        <el-table-column label="机构核实意见" align="center" prop="hsyj" />
        <el-table-column label="核实状态" align="center" prop="hszt"  />
        <el-table-column label="核实时间" align="center" prop="hssj"  />
        <el-table-column label="核实人" align="center" prop="hsr"  />
        <el-table-column label="核实派发时间" align="center" prop="hspfsj"  />
        <el-table-column label="任务批次号" align="center" prop="rwpcid"  />
        <el-table-column label="已发送回智审" align="center" prop="issend"  />
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :pageSizes="[50,100,150,200]"
        size="small"
        @pagination="getList"
      />
    </div>
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
        pageSize:10
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
  }
}
</script>