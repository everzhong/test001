<template>
  <div class="app-container">
    <el-form class="top-search" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-row>
        <el-col :span="22">
          <el-form-item label="批次号" prop="rwpicd">
            <el-input
              v-model="queryParams.rwpicd"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="任务名称" prop="rwmc">
            <el-input
              v-model="queryParams.rwmc"
              placeholder="请输入，支持模糊搜索"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="任务推送日期" label-width="98px">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="委托机构" prop="wtjg">
            <el-input placeholder="请输入" v-model="queryParams.wtjg" clearable size="small" style="width: 240px"></el-input>
          </el-form-item>
          <el-form-item label="承办机构" prop="cbjg">
            <el-input placeholder="请输入" v-model="queryParams.cbjg" clearable size="small" style="width: 240px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item style="margin-right:0;text-align:right">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-table v-loading="loading" :data="renwuoneList" @selection-change="handleSelectionChange" border>
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="序号" type="index" align="center"  />
        <el-table-column label="任务批次号" align="center" prop="rwpcid"  show-overflow-tooltip/>
        <el-table-column label="任务名称" align="center" prop="rwmc"  show-overflow-tooltip/>
        <el-table-column label="检查方式" align="center" prop="jcfs"  show-overflow-tooltip/>
        <el-table-column label="数据开始日期" align="center" prop="datastarttime"  show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.datastarttime,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据结束日期" align="center" prop="dataendtime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构数量" align="center" prop="jgsl"  show-overflow-tooltip/>
        <el-table-column label="任务推送日期" align="center" prop="rwtssj" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.rwtssj,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务截止日期" align="center" prop="rwendtime" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.rwendtime,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="就医类型" align="center" prop="jslb"  show-overflow-tooltip/>
        <el-table-column label="任务描述" align="center" prop="rwms" show-overflow-tooltip/>
        <el-table-column label="异地/本地" align="center" prop="ybd"  show-overflow-tooltip/>
        <el-table-column label="险种" align="center" prop="ybbf"  show-overflow-tooltip/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="checkdetail(scope.row)"
            >查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="任务批次号" prop="rwpcid">
          <el-input v-model="form.rwpcid" placeholder="请输入任务批次号" />
        </el-form-item>
        <el-form-item label="机构名称" prop="rwmc">
          <el-input v-model="form.rwmc" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="检查方式" prop="jcfs">
          <el-input v-model="form.jcfs" placeholder="请输入检查方式" />
        </el-form-item>
        <el-form-item label="数据开始时间" prop="datastarttime">
          <el-date-picker clearable size="small"
            v-model="form.datastarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择数据开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="机构数量" prop="jgsl">
          <el-input v-model="form.jgsl" placeholder="请输入机构数量" />
        </el-form-item>
        <el-form-item label="任务截止时间" prop="rwendtime">
          <el-input v-model="form.rwendtime" placeholder="请输入任务截止时间" />
        </el-form-item>
        <el-form-item label="就医类型" prop="jslb">
          <el-input v-model="form.jslb" placeholder="请输入就医类型" />
        </el-form-item>
        <el-form-item label="任务描述" prop="rwms">
          <el-input v-model="form.rwms" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="异地/本地" prop="ybd">
          <el-input v-model="form.ybd" placeholder="请输入异地/本地" />
        </el-form-item>
        <el-form-item label="险种" prop="ybbf">
          <el-input v-model="form.ybbf" placeholder="请输入险种" />
        </el-form-item>
        <el-form-item label="第三方筛查状态" prop="disancha">
          <el-input v-model="form.disancha" placeholder="请输入第三方筛查状态" />
        </el-form-item>
        <el-form-item label="承办机构" prop="cbjg">
          <el-input v-model="form.cbjg" placeholder="请输入承办机构" />
        </el-form-item>
        <el-form-item label="任务推送时间" prop="rwtssj">
          <el-input v-model="form.rwtssj" placeholder="请输入任务推送时间" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addtime">
          <el-date-picker clearable size="small"
            v-model="form.addtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据结束时间" prop="dataendtime">
          <el-date-picker clearable size="small"
            v-model="form.dataendtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择数据结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="案件来源" prop="ajly">
          <el-input v-model="form.ajly" placeholder="请输入案件来源" />
        </el-form-item>
        <el-form-item label="更新时间" prop="uptime">
          <el-date-picker clearable size="small"
            v-model="form.uptime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listRenwuone, getRenwuone, delRenwuone, addRenwuone, updateRenwuone, exportRenwuone } from "@/api/renwu/renwuone";

export default {
  name: "Renwuone",
  components: {
  },
  data() {
    return {
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
      // 任务批次号字典
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
          { required: true, message: "任务批次号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    // this.getDicts("${column.dictType}").then(response => {
    //   this.rwpcidOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.rwmcOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jcfsOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.datastarttimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jgslOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.rwendtimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jslbOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.rwmsOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ybdOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ybbfOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.disanchaOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.cbjgOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.rwtssjOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.addtimeOptions = response.data;
    // });
    //任务状态字典
    // this.getDicts("sys_renwu_status").then(response => {
    //   this.statusOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.dataendtimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ajlyOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.uptimeOptions = response.data;
    // });
  },
  methods: {
    /** 查询renwuone列表 */
    getList() {
      this.loading = true;
      if(this.dateRange && this.dateRange.length){
        this.queryParams.rwtssj = this.dateRange[0]
        this.queryParams.rwendtime = this.dateRange[1]
      } else  {
        this.queryParams.rwtssj = ''
        this.queryParams.rwendtime = ''
      }
      listRenwuone(this.queryParams).then(response => {
        this.renwuoneList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(e=>{
        this.loading = false
      });
    },
    // 任务批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // 机构名称字典翻译
    rwmcFormat(row, column) {
      return this.selectDictLabel(this.rwmcOptions, row.rwmc);
    },
    // 检查方式字典翻译
    jcfsFormat(row, column) {
      return this.selectDictLabel(this.jcfsOptions, row.jcfs);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabel(this.datastarttimeOptions, row.datastarttime);
    },
    // 机构数量字典翻译
    jgslFormat(row, column) {
      return this.selectDictLabel(this.jgslOptions, row.jgsl);
    },
    // 任务截止时间字典翻译
    rwendtimeFormat(row, column) {
      return this.selectDictLabel(this.rwendtimeOptions, row.rwendtime);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabel(this.jslbOptions, row.jslb);
    },
    // 任务描述字典翻译
    rwmsFormat(row, column) {
      return this.selectDictLabel(this.rwmsOptions, row.rwms);
    },
    // 异地/本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabel(this.ybdOptions, row.ybd);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabel(this.ybbfOptions, row.ybbf);
    },
    // 第三方筛查状态字典翻译
    disanchaFormat(row, column) {
      return this.selectDictLabel(this.disanchaOptions, row.disancha);
    },
    // 承办机构字典翻译
    cbjgFormat(row, column) {
      return this.selectDictLabel(this.cbjgOptions, row.cbjg);
    },
    // 任务推送时间字典翻译
    rwtssjFormat(row, column) {
      return this.selectDictLabel(this.rwtssjOptions, row.rwtssj);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabel(this.addtimeOptions, row.addtime);
    },
    // 任务状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 数据结束时间字典翻译
    dataendtimeFormat(row, column) {
      return this.selectDictLabel(this.dataendtimeOptions, row.dataendtime);
    },
    // 案件来源字典翻译
    ajlyFormat(row, column) {
      return this.selectDictLabel(this.ajlyOptions, row.ajly);
    },
    // 更新时间字典翻译
    uptimeFormat(row, column) {
      return this.selectDictLabel(this.uptimeOptions, row.uptime);
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
      this.resetForm("queryForm");
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
    }
  }
};
</script>