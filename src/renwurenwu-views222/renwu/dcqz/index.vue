<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检查开始时间" prop="jcstarttime">
        <el-date-picker clearable size="small"
          v-model="queryParams.jcstarttime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择检查开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检查结束时间" prop="jcendtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.jcendtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择检查结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable size="small">
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['renwu:dcqz:add']"
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
          v-hasPermi="['renwu:dcqz:edit']"
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
          v-hasPermi="['renwu:dcqz:remove']"
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
          v-hasPermi="['renwu:dcqz:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dcqzList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="qzid" :formatter="qzidFormat" />
      <el-table-column label="批次号" align="center" prop="rwpcid" :formatter="rwpcidFormat" />
      <el-table-column label="机构代码" align="center" prop="jgdm" :formatter="jgdmFormat" />
      <el-table-column label="类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="资料说明" align="center" prop="zlsm" :formatter="zlsmFormat" />
      <el-table-column label="上传者" align="center" prop="upman" :formatter="upmanFormat" />
      <el-table-column label="添加时间" align="center" prop="addtime" :formatter="addtimeFormat" />
      <el-table-column label="检查地点" align="center" prop="jcdd" :formatter="jcddFormat" />
      <el-table-column label="检查开始时间" align="center" prop="jcstarttime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.jcstarttime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查结束时间" align="center" prop="jcendtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.jcendtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位全称" align="center" prop="dwqc" :formatter="dwqcFormat" />
      <el-table-column label="单位地址" align="center" prop="addr" :formatter="addrFormat" />
      <el-table-column label="法人" align="center" prop="faren" :formatter="farenFormat" />
      <el-table-column label="联系电话" align="center" prop="tel" :formatter="telFormat" />
      <el-table-column label="执法人员" align="center" prop="zfry" :formatter="zfryFormat" />
      <el-table-column label="被询问人" align="center" prop="xwname" :formatter="xwnameFormat" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
      <el-table-column label="被询问人身份证号" align="center" prop="sfz" :formatter="sfzFormat" />
      <el-table-column label="被询问人联系地址" align="center" prop="lxdz" :formatter="lxdzFormat" />
      <el-table-column label="备注" align="center" prop="bz" :formatter="bzFormat" />
      <el-table-column label="文件地址" align="center" prop="wenjianurl" :formatter="wenjianurlFormat" />
      <el-table-column label="文件名称" align="center" prop="wenjian" :formatter="wenjianFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['renwu:dcqz:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['renwu:dcqz:remove']"
          >删除</el-button>
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

    <!-- 添加或修改调查取证对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查开始时间" prop="jcstarttime">
          <el-date-picker clearable size="small"
            v-model="form.jcstarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择检查开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查结束时间" prop="jcendtime">
          <el-date-picker clearable size="small"
            v-model="form.jcendtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择检查结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option
              v-for="dict in sexOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件地址">
          <fileUpload v-model="form.wenjianurl"/>
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
import { listDcqz, getDcqz, delDcqz, addDcqz, updateDcqz, exportDcqz } from "@/api/renwu/dcqz";
import FileUpload from '@/components/FileUpload';

export default {
  name: "Dcqz",
  components: {
    FileUpload,
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
      // 调查取证表格数据
      dcqzList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // ID字典
      qzidOptions: [],
      // 批次号字典
      rwpcidOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 类型字典
      typeOptions: [],
      // 资料说明字典
      zlsmOptions: [],
      // 上传者字典
      upmanOptions: [],
      // 添加时间字典
      addtimeOptions: [],
      // 检查地点字典
      jcddOptions: [],
      // 检查开始时间字典
      jcstarttimeOptions: [],
      // 检查结束时间字典
      jcendtimeOptions: [],
      // 单位全称字典
      dwqcOptions: [],
      // 单位地址字典
      addrOptions: [],
      // 法人字典
      farenOptions: [],
      // 联系电话字典
      telOptions: [],
      // 执法人员字典
      zfryOptions: [],
      // 被询问人字典
      xwnameOptions: [],
      // 性别字典
      sexOptions: [],
      // 被询问人身份证号字典
      sfzOptions: [],
      // 被询问人联系地址字典
      lxdzOptions: [],
      // 备注字典
      bzOptions: [],
      // 文件地址字典
      wenjianurlOptions: [],
      // 文件名称字典
      wenjianOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        qzid: null,
        rwpcid: null,
        jgdm: null,
        type: null,
        zlsm: null,
        upman: null,
        addtime: null,
        jcdd: null,
        jcstarttime: null,
        jcendtime: null,
        dwqc: null,
        addr: null,
        faren: null,
        tel: null,
        zfry: null,
        xwname: null,
        sex: null,
        sfz: null,
        lxdz: null,
        bz: null,
        wenjianurl: null,
        wenjian: null
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
      this.qzidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.rwpcidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgdmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.zlsmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.upmanOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.addtimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jcddOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jcstarttimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jcendtimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.dwqcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.addrOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.farenOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.telOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.zfryOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xwnameOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.sfzOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.lxdzOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.bzOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.wenjianurlOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.wenjianOptions = response.data;
    });
  },
  methods: {
    /** 查询调查取证列表 */
    getList() {
      this.loading = true;
      listDcqz(this.queryParams).then(response => {
        this.dcqzList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // ID字典翻译
    qzidFormat(row, column) {
      return this.selectDictLabels(this.qzidOptions, row.qzid);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabels(this.rwpcidOptions, row.rwpcid);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabels(this.jgdmOptions, row.jgdm);
    },
    // 类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabels(this.typeOptions, row.type);
    },
    // 资料说明字典翻译
    zlsmFormat(row, column) {
      return this.selectDictLabels(this.zlsmOptions, row.zlsm);
    },
    // 上传者字典翻译
    upmanFormat(row, column) {
      return this.selectDictLabels(this.upmanOptions, row.upman);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabels(this.addtimeOptions, row.addtime);
    },
    // 检查地点字典翻译
    jcddFormat(row, column) {
      return this.selectDictLabels(this.jcddOptions, row.jcdd);
    },
    // 检查开始时间字典翻译
    jcstarttimeFormat(row, column) {
      return this.selectDictLabels(this.jcstarttimeOptions, row.jcstarttime);
    },
    // 检查结束时间字典翻译
    jcendtimeFormat(row, column) {
      return this.selectDictLabels(this.jcendtimeOptions, row.jcendtime);
    },
    // 单位全称字典翻译
    dwqcFormat(row, column) {
      return this.selectDictLabels(this.dwqcOptions, row.dwqc);
    },
    // 单位地址字典翻译
    addrFormat(row, column) {
      return this.selectDictLabels(this.addrOptions, row.addr);
    },
    // 法人字典翻译
    farenFormat(row, column) {
      return this.selectDictLabels(this.farenOptions, row.faren);
    },
    // 联系电话字典翻译
    telFormat(row, column) {
      return this.selectDictLabels(this.telOptions, row.tel);
    },
    // 执法人员字典翻译
    zfryFormat(row, column) {
      return this.selectDictLabels(this.zfryOptions, row.zfry);
    },
    // 被询问人字典翻译
    xwnameFormat(row, column) {
      return this.selectDictLabels(this.xwnameOptions, row.xwname);
    },
    // 性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabels(this.sexOptions, row.sex);
    },
    // 被询问人身份证号字典翻译
    sfzFormat(row, column) {
      return this.selectDictLabels(this.sfzOptions, row.sfz);
    },
    // 被询问人联系地址字典翻译
    lxdzFormat(row, column) {
      return this.selectDictLabels(this.lxdzOptions, row.lxdz);
    },
    // 备注字典翻译
    bzFormat(row, column) {
      return this.selectDictLabels(this.bzOptions, row.bz);
    },
    // 文件地址字典翻译
    wenjianurlFormat(row, column) {
      return this.selectDictLabels(this.wenjianurlOptions, row.wenjianurl);
    },
    // 文件名称字典翻译
    wenjianFormat(row, column) {
      return this.selectDictLabels(this.wenjianOptions, row.wenjian);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        qzid: null,
        rwpcid: null,
        jgdm: null,
        type: null,
        zlsm: null,
        upman: null,
        addtime: null,
        jcdd: null,
        jcstarttime: null,
        jcendtime: null,
        dwqc: null,
        addr: null,
        faren: null,
        tel: null,
        zfry: null,
        xwname: null,
        sex: null,
        sfz: null,
        lxdz: null,
        bz: null,
        wenjianurl: null,
        wenjian: null
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
      this.ids = selection.map(item => item.qzid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加调查取证";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const qzid = row.qzid || this.ids
      getDcqz(qzid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改调查取证";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.qzid != null) {
            updateDcqz(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDcqz(this.form).then(response => {
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
      const qzids = row.qzid || this.ids;
      this.$confirm('是否确认删除调查取证编号为"' + qzids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDcqz(qzids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有调查取证数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportDcqz(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>