<template>
  <div class="app-container">
    <el-form class="top-search" :model="queryParams" ref="searchForm" :inline="true" label-width="60px" style="max-height:80px;overflow:auto;margin-bottom:5px">
      <div>
        <el-form-item label="批次号" prop="rwpcid">
          <el-input
            v-model="queryParams.rwpcid"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 170px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务名称" prop="rwmc">
          <el-input
            v-model="queryParams.rwmc"
            placeholder="请输入，支持模糊搜索"
            clearable
            size="small"
            style="width: 170px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="承办机构" prop="cbjg">
          <el-input placeholder="请输入，支持模糊搜索" v-model="queryParams.cbjg" clearable size="small" style="width: 170px"></el-input>
        </el-form-item>
        <el-form-item label="任务推送日期" label-width="80px">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 210px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item style="margin-right:0;text-align:right">
          <el-button style="margin-right:10px;" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button style="margin-right:10px;" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
   
    <div class="table-main" :style="{top:tableHeight}" v-loading="loading">
      <sTable :data="renwuoneList" :header="tableHeader" :fixedNum="1" :checkAll="false">
        <el-table-column label="序号" type="index" align="center"  slot="fixed" width="55px"/>
        <el-table-column label="操作" align="center" min-width="200" slot="operate">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.jsstatus!=0"
              @click="handleRecive(scope.row)"
            >接收疑点数据</el-button>
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.jsstatus!=2"
              @click="checkdetail(scope.row)"
            >查看任务详情</el-button>
          </template>
        </el-table-column>
      </sTable>
    </div>
    <pagination
      class="fixed-bottom"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { listRenwuone } from "@/api/renwu/renwuone";
import {setYd} from "@/api/renwu/renwutwo"

export default {
  name: "Renwuone",
  data() {
    return {
      tableHeader:[{
        prop: 'jsstatus',
        label: '接收状态',
        viewFun:function(index){
          return ['未接收','接收中','已接收'][index||0]
        }
      },{
        prop: 'rwpcid',
        label: '批次号',
        fixedWidth:30
      },{
        prop: 'rwmc',
        label: '任务名称',
      },{
        prop: 'ajly',
        label: '案件来源',
        fixedWidth:55
      },{
        prop: 'datastarttime',
        label: '数据开始日期',
        viewFun: (time)=>{
          return this.parseTime(time,'{y}-{m}')
        }  
      },{
        prop: 'dataendtime',
        label: '数据结束日期',
        viewFun: (time)=>{
          return this.parseTime(time,'{y}-{m}')
        } 
      },{
        prop: 'jgsl',
        label: '机构数量',
      },{
        prop: 'uptime',
        label: '任务推送日期',
        viewFun: (time)=>{
          return this.parseTime(time,'{y}-{m}-{d}')
        } 
      },{
        prop: 'rwendtime',
        label: '计划完成日期',
        viewFun: (time)=>{
          return this.parseTime(time,'{y}-{m}-{d}')
        } 
      },{
        prop: 'jslb',
        label: '就医类型',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        }
      },{
        prop: 'rwms',
        label: '任务描述',
        viewFun:(rwms)=>{
          return (rwms||'无')
        }
      },{
        prop: 'ybbf',
        label: '险种',
        viewFun:(ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions,ybbf)
        }
      },{
        prop: 'cbjg',
        label: '承办机构',
      }],
      dateRange:[],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // renwuone表格数据
      renwuoneList: [],
      // 就医类型字典
      jslbOptions: [],
      // 险种字典
      ybbfOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rwmc: null,
        cbjg: null,
        rwpcid:'',
        rwtssj:null,
        rwendtime:null
      },
      // 表单校验
      rules: {
        rwpcid: [
          { required: true, message: "批次号不能为空", trigger: "blur" }
        ],
      },
      tableHeight:0,
      isRwcx:false,//任务列表，任务查询菜单都指向此页面，通过路由区分是任务列表还是任务查询
    };
  },
  created() {
    this.isRwcx = this.$route.name==='Rwcx'
    this.getList();
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  mounted(){
    this.tableHeight = this.calcTableHeight(5)
  },
  methods: {
    /** 查询renwuone列表 */
    getList(query) {
      this.loading = true;
      if(this.dateRange && this.dateRange.length){
        this.queryParams.rwtssj = this.dateRange[0]
        this.queryParams.rwendtime = this.dateRange[1]
      } else  {
        this.queryParams.rwtssj = ''
        this.queryParams.rwendtime = ''
      }
      const params =  query?{...this.queryParams,status:0,...query}:{...this.queryParams,status:0}
      this.isRwcx && (delete params.status)//任务查询菜单进来，查询所有状态数据
      listRenwuone(params).then(response => {
        this.renwuoneList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(e=>{
        this.loading = false
      });
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("searchForm");
      this.handleQuery();
    },
    /**
     * 查看明细
     */
    checkdetail(row){
      this.$router.push({
        path:`/renwu/checkdetail?rwpcid=${row.rwpcid}&isrwcx=${this.isRwcx?1:0}`,
      })
    },
    //数据提交
    handleRecive(row){
      setYd({
        id:row.id,
        rwpcid:row.rwpcid
      }).then(res=>{
        if(res.code===200){
          this.getList()
          this.msgSuccess('提交成功')
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
}
.table-main {
  position: absolute;
  top:160px;
  bottom:70px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:30px;
  right: 0px;
}
</style>