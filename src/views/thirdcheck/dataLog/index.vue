<template>
  <div class="app-container">
    <el-form class="top-search" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
      <el-row>
        <el-col :span="22">
          <el-form-item label="创建时间" prop="createDate">
            <el-input
              style="width: 180px"
              v-model="queryParams.createDate"
              placeholder="请输入创建时间"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="开始时间" prop="stime">
            <el-date-picker clearable size="small"
              style="width: 180px"
              v-model="queryParams.stime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="etime">
            <el-date-picker clearable size="small"
              style="width: 180px"
              v-model="queryParams.etime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务层ID" prop="jobId">
            <el-input
              style="width: 180px"
              v-model="queryParams.jobId"
              placeholder="请输入任务层ID"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="日志路径" prop="logFilePath">
            <el-input
              style="width: 180px"
              v-model="queryParams.logFilePath"
              placeholder="请输入日志路径"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="抽取分类" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择抽取分类" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="成功条数" prop="succ">
            <el-input
              style="width: 180px"
              v-model="queryParams.succ"
              placeholder="请输入成功条数"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="机构代码" prop="jgdm">
            <el-input
              style="width: 180px"
              v-model="queryParams.jgdm"
              placeholder="请输入机构代码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="总耗时" prop="ztime">
            <el-input
              style="width: 180px"
              v-model="queryParams.ztime"
              placeholder="请输入总耗时"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        
          <el-form-item label="失败条数" prop="fucc">
            <el-input
              style="width: 180px"
              v-model="queryParams.fucc"
              placeholder="请输入失败条数"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="抽取状态" prop="ends">
            <el-select v-model="queryParams.ends" placeholder="请选择抽取状态" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in endsOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item style="margin-right:0;text-align:right">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8" v-if="false">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['renwu:log:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['renwu:log:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['renwu:log:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
		  :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['renwu:log:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange" border>
      <el-table-column label="序号" type="index" width="55" align="center"/>
      <el-table-column label="创建时间" align="center" prop="createDate" width="180px">
         <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="stime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.stime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务层ID" align="center" prop="jobId" :width="flexColumnWidth('jobId',logList)"/>
      <el-table-column label="日志路径" align="center" prop="logFilePath" :width="flexColumnWidth('logFilePath',logList)"/>
      <el-table-column label="更新时间" align="center" prop="updateDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="抽取分类" align="center" prop="type" width="150px">
        <template slot-scope="scope">
          <span>{{scope.row.type==1?'住院明细抽取':scope.row.type==2?'住院主单抽取':scope.row.type==3?'门诊明细抽取':scope.row.type==4?'门诊主单抽取':scope.row.type==5?'据ID抽取明细':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功条数" align="center" prop="succ" />
      <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',logList)"/>
      <el-table-column label="年月份" align="center" prop="ny" show-overflow-tooltip width="300px"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{scope.row.status==1?'正常':scope.row.status==2?'禁用':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总耗时" align="center" prop="ztime"  />
      <el-table-column label="结束时间" align="center" prop="etime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.etime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败条数" align="center" prop="fucc" />
      <el-table-column label="抽取状态" align="center" prop="ends" width="150px">
        <template slot-scope="scope">
          <span>{{['未开始抽取数据','抽取中','成功抽取数据','抽取失败'][scope.row.ends*1]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['renwu:log:edit']"
          >修改</el-button>
        
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改数据抽取日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="创建时间" prop="createDate">
          <el-input v-model="form.createDate" placeholder="请输入创建时间" />
        </el-form-item> -->
        <el-form-item label="开始时间" prop="stime">
          <el-date-picker clearable size="small"
            v-model="form.stime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务层ID" prop="jobId">
          <el-input v-model="form.jobId" placeholder="请输入任务层ID" />
        </el-form-item>
        <el-form-item label="日志路径" prop="logFilePath">
          <el-input v-model="form.logFilePath" placeholder="请输入日志路径" />
        </el-form-item>
        <el-form-item label="抽取分类" prop="type">
          <el-select v-model="form.type" placeholder="请选择抽取分类">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成功条数" prop="succ">
          <el-input v-model="form.succ" placeholder="请输入成功条数" />
        </el-form-item>
        <el-form-item label="机构代码" prop="jgdm">
          <el-input v-model="form.jgdm" placeholder="请输入机构代码" />
        </el-form-item>
        <el-form-item label="年月份" prop="ny">
          <el-input v-model="form.ny" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="总耗时" prop="ztime">
          <el-input v-model="form.ztime" placeholder="请输入总耗时" />
        </el-form-item>
        <el-form-item label="结束时间" prop="etime">
          <el-date-picker clearable size="small"
            v-model="form.etime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失败条数" prop="fucc">
          <el-input v-model="form.fucc" placeholder="请输入失败条数" />
        </el-form-item>
        <el-form-item label="抽取状态">
          <el-radio-group v-model="form.ends">
            <el-radio
              v-for="dict in endsOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLog, getLog, delLog, addLog, updateLog, exportLog } from "@/api/renwu/log";

export default {
  name: "DataLog",
  components: {
  },
  data() {
    return {
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
      // 数据抽取日志表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // ID字典
      idOptions: [],
      // 创建时间字典
      createDateOptions: [],
      // 更新人字典
      updateByOptions: [],
      // 开始时间字典
      stimeOptions: [],
      // 任务层ID字典
      jobIdOptions: [],
      // 日志路径字典
      logFilePathOptions: [],
      // 更新时间字典
      updateDateOptions: [],
      // 抽取分类字典
      typeOptions: [
        {dictLabel:'住院明细抽取',dictValue:1},
        {dictLabel:'住院主单抽取',dictValue:2},
        {dictLabel:'门诊明细抽取',dictValue:3},
        {dictLabel:'门诊主单抽取',dictValue:4},
        {dictLabel:'据ID抽取明细',dictValue:5}
      ],
      // 成功条数字典
      succOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 年月份字典
      nyOptions: [],
      // 状态字典
      statusOptions: [
        {dictLabel:'正常',dictValue:1},
        {dictLabel:'禁用',dictValue:2}
      ],
      // 创建人字典
      createByOptions: [],
      // 总耗时字典
      ztimeOptions: [],
      // 结束时间字典
      etimeOptions: [],
      // 失败条数字典
      fuccOptions: [],
      // 抽取状态字典
      endsOptions: [
        {dictLabel:'未开始抽取数据',dictValue:0},
        {dictLabel:'抽取中',dictValue:1},
        {dictLabel:'成功抽取数据',dictValue:2},
        {dictLabel:'抽取失败',dictValue:3}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createDate: null,
        stime: null,
        jobId: null,
        logFilePath: null,
        updateDate: null,
        type: null,
        succ: null,
        jgdm: null,
        ny: null,
        status: null,
        ztime: null,
        etime: null,
        fucc: null,
        ends: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("${column.dictType}").then(response => {
      this.idOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.createDateOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.updateByOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.stimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jobIdOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.logFilePathOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.updateDateOptions = response.data;
    });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.typeOptions = response.data;
    // });
    this.getDicts("${column.dictType}").then(response => {
      this.succOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgdmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.nyOptions = response.data;
    });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.statusOptions = response.data;
    // });
    this.getDicts("${column.dictType}").then(response => {
      this.createByOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ztimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.etimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.fuccOptions = response.data;
    });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.endsOptions = response.data;
    // });
  },
  methods: {
    /** 查询数据抽取日志列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then(response => {
        this.logList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // ID字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // 创建时间字典翻译
    createDateFormat(row, column) {
      return this.selectDictLabel(this.createDateOptions, row.createDate);
    },
    // 更新人字典翻译
    updateByFormat(row, column) {
      return this.selectDictLabel(this.updateByOptions, row.updateBy);
    },
    // 开始时间字典翻译
    stimeFormat(row, column) {
      return this.selectDictLabel(this.stimeOptions, row.stime);
    },
    // 任务层ID字典翻译
    jobIdFormat(row, column) {
      return this.selectDictLabel(this.jobIdOptions, row.jobId);
    },
    // 日志路径字典翻译
    logFilePathFormat(row, column) {
      return this.selectDictLabel(this.logFilePathOptions, row.logFilePath);
    },
    // 更新时间字典翻译
    updateDateFormat(row, column) {
      return this.selectDictLabel(this.updateDateOptions, row.updateDate);
    },
    // 抽取分类字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 成功条数字典翻译
    succFormat(row, column) {
      return this.selectDictLabel(this.succOptions, row.succ);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 年月份字典翻译
    nyFormat(row, column) {
      return this.selectDictLabel(this.nyOptions, row.ny);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 创建人字典翻译
    createByFormat(row, column) {
      return this.selectDictLabel(this.createByOptions, row.createBy);
    },
    // 总耗时字典翻译
    ztimeFormat(row, column) {
      return this.selectDictLabel(this.ztimeOptions, row.ztime);
    },
    // 结束时间字典翻译
    etimeFormat(row, column) {
      return this.selectDictLabel(this.etimeOptions, row.etime);
    },
    // 失败条数字典翻译
    fuccFormat(row, column) {
      return this.selectDictLabel(this.fuccOptions, row.fucc);
    },
    // 抽取状态字典翻译
    endsFormat(row, column) {
      return this.selectDictLabel(this.endsOptions, row.ends);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        createDate: null,
        updateBy: null,
        stime: null,
        jobId: null,
        logFilePath: null,
        updateDate: null,
        type: null,
        succ: null,
        jgdm: null,
        ny: null,
        status: "0",
        createBy: null,
        ztime: null,
        etime: null,
        fucc: null,
        ends: "0"
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加数据抽取日志";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改数据抽取日志";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            const params = {...this.form}
            // params.createDate = this.parseTime(this.form.createDate, '{y}-{m}-{d} {h}:{m}:{s}')
            // params.updateDate = this.parseTime(this.form.updateDate, '{y}-{m}-{d} {h}:{m}:{s}')
            delete params.createDate
            delete params.updateDate
            updateLog(params).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLog(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除数据抽取日志编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据抽取日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportLog(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>