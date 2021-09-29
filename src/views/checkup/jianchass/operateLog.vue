/**项目流水号汇总 第四、五层点操作记录*/
<template>
  <el-dialog 
  title="操作记录"
  :visible.sync="options.show"
  width="1100px"
  >
    <!-- <div class="head-close">
      <span class="title">操作记录</span>
      <span class="el-icon-close" @click="$emit('on-close')"></span>
    </div> -->
    <div style="height:500px" v-loading="logLoading">
      <el-table class="qztable" ref="multipleTable" max-height="500" :data="tableData" border>
        <el-table-column label="序号" align="center" type="index"  width="50"/>
        <el-table-column label="标记人" align="center" prop="bjr" />
        <el-table-column label="标记时间" align="center" prop="bjsj" width="160">
          <template slot-scope="scope" :width="flexColumnWidth('bjsj',tableData)">
            <span>{{parseTime(scope.row.bjsj, '{y}-{m}-{d} {h}:{s}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="行为认定" align="center" prop="xwrd" :width="flexColumnWidth('xwrd',tableData)"/>
        <el-table-column label="追款单价(元)" align="center" prop="zkdj">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.zkdj,3)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="违规数量" align="center" prop="wgsl" show-overflow-tooltip/>
        <el-table-column label="违规费用(元)" align="center" prop="wgfy">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.wgfy,2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="bz"   show-overflow-tooltip/>
      </el-table>
    </div>
    <pagination
        style="margin-top:0;margin-bottom:25px;"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  </el-dialog>
</template>
<script>
import {getRending} from '@/api/renwu/dcqz'
export default {
  name:"OperateLog",
  data(){
    return {
      logLoading:false,
      tableData:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total:0
    }
  },
  props:["options"],
  created(){
    this.getList();
  },
  methods:{
    async getList(){
      try {
        this.logLoading = true
        const {rwpcid,fid,type,xwrd} = this.options
        const params = {...this.queryParams,rwpcid,fid,type,xwrd}
        const res  = await getRending(params)
        if(res.code==200) {
          this.total = res.total
          this.tableData = res.rows
        }
      } catch (error) {}
      this.logLoading = false

    },
  }
}
</script>
