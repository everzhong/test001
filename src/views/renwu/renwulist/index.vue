<template>
  <div class="app-container">
    <el-form class="top-search" :model="queryParams" ref="searchForm" :inline="true" v-show="showSearch" label-width="60px" style="max-height:94px;overflow:auto;margin-bottom:5px">
      <div>
        <el-form-item label="批次号" prop="rwpicd">
          <el-input
            v-model="queryParams.rwpicd"
            placeholder="请输入"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务名称" prop="rwmc">
          <el-input
            v-model="queryParams.rwmc"
            placeholder="请输入，支持模糊搜索"
            clearable
            size="small"
            style="width: 180px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="委托机构" prop="wtjg">
          <el-input placeholder="请输入，支持模糊搜索" v-model="queryParams.wtjg" clearable size="small" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="承办机构" prop="cbjg">
          <el-input placeholder="请输入，支持模糊搜索" v-model="queryParams.cbjg" clearable size="small" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="任务推送日期" label-width="80px">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width: 220px"
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
    <!-- <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handleRecive"
        >接收数据</el-button>
      </el-col>
    </el-row> -->
    <div class="table-main" :style="{top:tableHeight}" v-loading="loading">
      <sTable :data="renwuoneList" :header="tableHeader" :fixedNum="1" :checkAll="false" @selection-change="handleSelectionChange">
        <!-- <el-table-column  align="center" width="55" slot="fixed">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="radioCheck" @change="radioChange"></el-radio>
          </template>
        </el-table-column> -->
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
import { listRenwuone, getRenwuone, delRenwuone, addRenwuone, updateRenwuone, exportRenwuone } from "@/api/renwu/renwuone";
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
        // hide: true
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
      }],
      dateRange:[],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // renwuone表格数据
      renwuoneList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 批次号字典
      rwpcidOptions: [],
      // 机构名称字典
      rwmcOptions: [],
      // 检查方式字典
      jcfsOptions: [],
      // 数据开始时间字典
      datastarttimeOptions: [],
      // 机构数量字典
      jgslOptions: [],
      // 任务截止时间字典
      rwendtimeOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 任务描述字典
      rwmsOptions: [],
      // 异地/本地字典
      ybdOptions: [],
      // 险种字典
      ybbfOptions: [],
      // 第三方筛查状态字典
      disanchaOptions: [],
      // 承办机构字典
      cbjgOptions: [],
      // 任务推送时间字典
      rwtssjOptions: [],
      // 添加时间字典
      addtimeOptions: [],
      // 任务状态字典
      statusOptions: [],
      // 数据结束时间字典
      dataendtimeOptions: [],
      // 案件来源字典
      ajlyOptions: [],
      // 更新时间字典
      uptimeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        rwmc: null,
        jcfs: null,
        datastarttime: null,
        jgsl: null,
        rwendtime: null,
        jslb: null,
        rwms: null,
        ybd: null,
        ybbf: null,
        disancha: null,
        cbjg: null,
        rwtssj: null,
        addtime: null,
        status: null,
        dataendtime: null,
        ajly: null,
        uptime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        rwpcid: [
          { required: true, message: "批次号不能为空", trigger: "blur" }
        ],
      },
      radioCheck:'',
      radioSelection:{},
      tableHeight:0
    };
  },
  created() {
    this.getList();
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  mounted(){
    this.tableHeight = this.calcTableHeight(7)
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
      listRenwuone(params).then(response => {
        this.renwuoneList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(e=>{
        this.loading = false
      });
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabels(this.rwpcidOptions, row.rwpcid);
    },
    // 机构名称字典翻译
    rwmcFormat(row, column) {
      return this.selectDictLabels(this.rwmcOptions, row.rwmc);
    },
    // 检查方式字典翻译
    jcfsFormat(row, column) {
      return this.selectDictLabels(this.jcfsOptions, row.jcfs);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabels(this.datastarttimeOptions, row.datastarttime);
    },
    // 机构数量字典翻译
    jgslFormat(row, column) {
      return this.selectDictLabels(this.jgslOptions, row.jgsl);
    },
    // 任务截止时间字典翻译
    rwendtimeFormat(row, column) {
      return this.selectDictLabels(this.rwendtimeOptions, row.rwendtime);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 任务描述字典翻译
    rwmsFormat(row, column) {
      return this.selectDictLabels(this.rwmsOptions, row.rwms);
    },
    // 异地/本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabels(this.ybdOptions, row.ybd);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 第三方筛查状态字典翻译
    disanchaFormat(row, column) {
      return this.selectDictLabels(this.disanchaOptions, row.disancha);
    },
    // 承办机构字典翻译
    cbjgFormat(row, column) {
      return this.selectDictLabels(this.cbjgOptions, row.cbjg);
    },
    // 任务推送时间字典翻译
    rwtssjFormat(row, column) {
      return this.selectDictLabels(this.rwtssjOptions, row.rwtssj);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabels(this.addtimeOptions, row.addtime);
    },
    // 任务状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabels(this.statusOptions, row.status);
    },
    // 数据结束时间字典翻译
    dataendtimeFormat(row, column) {
      return this.selectDictLabels(this.dataendtimeOptions, row.dataendtime);
    },
    // 案件来源字典翻译
    ajlyFormat(row, column) {
      return this.selectDictLabels(this.ajlyOptions, row.ajly);
    },
    // 更新时间字典翻译
    uptimeFormat(row, column) {
      return this.selectDictLabels(this.uptimeOptions, row.uptime);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        rwpcid: null,
        rwmc: null,
        jcfs: null,
        datastarttime: null,
        jgsl: null,
        rwendtime: null,
        jslb: null,
        rwms: null,
        ybd: null,
        ybbf: null,
        disancha: null,
        cbjg: null,
        rwtssj: null,
        addtime: null,
        status: "0",
        dataendtime: null,
        ajly: null,
        uptime: null
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.rwpcid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加renwuone";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rwpcid = row.id || this.ids
      getRenwuone(rwpcid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwuone";
      });
    },
    /**
     * 查看明细
     */
    checkdetail(row){
      this.$router.push({
        path:`/renwu/checkdetail?rwpcid=${row.rwpcid}`,
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenwuone(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwuone(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const rwpcids = row.id || this.ids;
      this.$confirm('是否确认删除renwuone编号为"' + rwpcids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwuone(rwpcids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwuone数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwuone(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    },
    radioChange(id){
      this.radioSelection = this.renwuoneList.filter(item=>{
        return item.id == id
      })[0]
    },
    //数据提交
    handleRecive(row){
      // if(this.radioCheck==''){
      //   this.msgError("请选择一项");
      //   return
      // }
      setYd({
        id:row.id,
        rwpcid:row.rwpcid
      }).then(res=>{
        if(res.code===200){
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