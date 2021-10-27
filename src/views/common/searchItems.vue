<template>
<div style="max-height:102px;overflow:auto">
  <el-form class="top-search" :model="query" ref="queryForm" :inline="true"  label-width="68px">
      <div>
          <el-form-item label="机构名称" prop="jgmc">
            <el-input
              v-model="query.jgmc"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="结算等级" prop="jsdj">
            <el-select v-model="query.jsdj" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in jsdjOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="就医类型" prop="jslb">
            <el-select v-model="query.jslb" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in jslbOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="第三方筛查状态" prop="dsfsc" label-width="113px">
            <el-select v-model="query.dsfsc" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in cbjgOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="行政区" prop="xzq">
            <el-select v-model="query.xzq" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in xzqOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="险种" prop="ybbf">
            <el-select v-model="query.ybbf" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in ybbfOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="任务状态" prop="status">
            <el-select v-model="query.status" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item> -->
      </div>
      <div>
        <el-form-item style="margin-right:0;text-align:right">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
  </el-form>
</div>
</template>
<script>
export default {
  name:'SearchItem',
  data() { 
    return {
     query:{
        jgmc:'',//机构名称
        jsdj:'',//机构等级
        jslb:'',//就医类别
        dsfsc:'',//第三方筛查
        ybbf:'',//险种
        xzq:'',//行政区
        status:'',//任务状态
        ajly:'',//案件来源
        rwpcid:'',//任务批次号
        jglb:'',//机构类型
        jgxz:''//机构性质
      },
      cbjgOptions:[],
      ybbfOptions:[],
      jslbOptions:[],
      jsdjOptions:[],//机构等级
      statusOptions:[],//机构性质
      xzqOptions:[],//行政区
      
    }
  },
  props:[],
  created(){
    this.getDic()
  },
  methods:{
    /** 搜索按钮操作 */
    handleQuery() {
      this.$emit('handleQuery',this.query)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getDic(){
      // this.getDicts("renwu_ss_ybbf").then(response => {
        // this.ybbfOptions = response.data;
      this.ybbfOptions = this.$store.getters.ybbfDic;
      // });
      this.getDicts("renwu_ss_jslb").then(response => {
        this.jslbOptions = response.data;
      });
      this.getDicts("sys_job_jgxx").then(response => {
        this.xzqOptions = response.data;
      });
      this.jsdjOptions = this.$store.getters.jsdjDic
      this.getDicts("sys_job_status").then(response => {
        this.statusOptions = response.data;
      });
    }
  }
}
</script>