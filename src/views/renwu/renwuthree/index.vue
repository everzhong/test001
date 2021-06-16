<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机构代码" prop="jgdm">
        <el-input
          v-model="queryParams.jgdm"
          placeholder="请输入机构代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构名称" prop="jgmc">
        <el-input
          v-model="queryParams.jgmc"
          placeholder="请输入机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规则分类" prop="gzfl">
        <el-input
          v-model="queryParams.gzfl"
          placeholder="请输入规则分类"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规则名称" prop="gzmc">
        <el-input
          v-model="queryParams.gzmc"
          placeholder="请输入规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="rwpcid">
        <el-input
          v-model="queryParams.rwpcid"
          placeholder="请输入批次号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="涉及就诊人数" prop="xjjzrs">
        <el-input
          v-model="queryParams.xjjzrs"
          placeholder="请输入涉及就诊人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="涉及明细数" prop="xjmxs">
        <el-input
          v-model="queryParams.xjmxs"
          placeholder="请输入涉及明细数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="涉及金额" prop="xjje">
        <el-input
          v-model="queryParams.xjje"
          placeholder="请输入涉及金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算费用" prop="jsfy">
        <el-input
          v-model="queryParams.jsfy"
          placeholder="请输入结算费用"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="险种" prop="ybbf">
        <el-input
          v-model="queryParams.ybbf"
          placeholder="请输入险种"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行政区" prop="xzq">
        <el-input
          v-model="queryParams.xzq"
          placeholder="请输入行政区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算等级" prop="jsdj">
        <el-input
          v-model="queryParams.jsdj"
          placeholder="请输入结算等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加时间" prop="addtime">
        <el-input
          v-model="queryParams.addtime"
          placeholder="请输入添加时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="就医类型" prop="jslb">
        <el-input
          v-model="queryParams.jslb"
          placeholder="请输入就医类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="异本地" prop="ybd">
        <el-input
          v-model="queryParams.ybd"
          placeholder="请输入异本地"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据开始时间" prop="datastarttime">
        <el-input
          v-model="queryParams.datastarttime"
          placeholder="请输入数据开始时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="信用代码" prop="xydm">
        <el-input
          v-model="queryParams.xydm"
          placeholder="请输入信用代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['renwu:renwuthree:add']"
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
          v-hasPermi="['renwu:renwuthree:edit']"
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
          v-hasPermi="['renwu:renwuthree:remove']"
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
          v-hasPermi="['renwu:renwuthree:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="renwuthreeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="机构代码" align="center" prop="jgdm" :formatter="jgdmFormat" />
      <el-table-column label="机构名称" align="center" prop="jgmc" :formatter="jgmcFormat" />
      <el-table-column label="规则分类" align="center" prop="gzfl" :formatter="gzflFormat" />
      <el-table-column label="规则名称" align="center" prop="gzmc" :formatter="gzmcFormat" />
      <el-table-column label="批次号" align="center" prop="rwpcid" :formatter="rwpcidFormat" />
      <el-table-column label="涉及就诊人数" align="center" prop="xjjzrs" :formatter="xjjzrsFormat" />
      <el-table-column label="涉及明细数" align="center" prop="xjmxs" :formatter="xjmxsFormat" />
      <el-table-column label="涉及金额" align="center" prop="xjje" :formatter="xjjeFormat" />
      <el-table-column label="结算费用" align="center" prop="jsfy" :formatter="jsfyFormat" />
      <el-table-column label="险种" align="center" prop="ybbf" :formatter="ybbfFormat" />
      <el-table-column label="行政区" align="center" prop="xzq" :formatter="xzqFormat" />
      <el-table-column label="结算等级" align="center" prop="jsdj" :formatter="jsdjFormat" />
      <el-table-column label="添加时间" align="center" prop="addtime" :formatter="addtimeFormat" />
      <el-table-column label="就医类型" align="center" prop="jslb" :formatter="jslbFormat" />
      <el-table-column label="异本地" align="center" prop="ybd" :formatter="ybdFormat" />
      <el-table-column label="数据开始时间" align="center" prop="datastarttime" :formatter="datastarttimeFormat" />
      <el-table-column label="信用代码" align="center" prop="xydm" :formatter="xydmFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['renwu:renwuthree:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['renwu:renwuthree:remove']"
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

    <!-- 添加或修改renwuthree对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机构代码" prop="jgdm">
          <el-input v-model="form.jgdm" placeholder="请输入机构代码" />
        </el-form-item>
        <el-form-item label="机构名称" prop="jgmc">
          <el-input v-model="form.jgmc" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="规则分类" prop="gzfl">
          <el-input v-model="form.gzfl" placeholder="请输入规则分类" />
        </el-form-item>
        <el-form-item label="规则名称" prop="gzmc">
          <el-input v-model="form.gzmc" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="批次号" prop="rwpcid">
          <el-input v-model="form.rwpcid" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="涉及就诊人数" prop="xjjzrs">
          <el-input v-model="form.xjjzrs" placeholder="请输入涉及就诊人数" />
        </el-form-item>
        <el-form-item label="涉及明细数" prop="xjmxs">
          <el-input v-model="form.xjmxs" placeholder="请输入涉及明细数" />
        </el-form-item>
        <el-form-item label="涉及金额" prop="xjje">
          <el-input v-model="form.xjje" placeholder="请输入涉及金额" />
        </el-form-item>
        <el-form-item label="结算费用" prop="jsfy">
          <el-input v-model="form.jsfy" placeholder="请输入结算费用" />
        </el-form-item>
        <el-form-item label="险种" prop="ybbf">
          <el-input v-model="form.ybbf" placeholder="请输入险种" />
        </el-form-item>
        <el-form-item label="行政区" prop="xzq">
          <el-input v-model="form.xzq" placeholder="请输入行政区" />
        </el-form-item>
        <el-form-item label="结算等级" prop="jsdj">
          <el-input v-model="form.jsdj" placeholder="请输入结算等级" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addtime">
          <el-input v-model="form.addtime" placeholder="请输入添加时间" />
        </el-form-item>
        <el-form-item label="就医类型" prop="jslb">
          <el-input v-model="form.jslb" placeholder="请输入就医类型" />
        </el-form-item>
        <el-form-item label="异本地" prop="ybd">
          <el-input v-model="form.ybd" placeholder="请输入异本地" />
        </el-form-item>
        <el-form-item label="数据开始时间" prop="datastarttime">
          <el-input v-model="form.datastarttime" placeholder="请输入数据开始时间" />
        </el-form-item>
        <el-form-item label="信用代码" prop="xydm">
          <el-input v-model="form.xydm" placeholder="请输入信用代码" />
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
import { listRenwuthree, getRenwuthree, delRenwuthree, addRenwuthree, updateRenwuthree, exportRenwuthree } from "@/api/renwu/renwuthree";

export default {
  name: "Renwuthree",
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
      // renwuthree表格数据
      renwuthreeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 机构代码字典
      jgdmOptions: [],
      // 机构名称字典
      jgmcOptions: [],
      // 规则分类字典
      gzflOptions: [],
      // 规则名称字典
      gzmcOptions: [],
      // 批次号字典
      rwpcidOptions: [],
      // 涉及就诊人数字典
      xjjzrsOptions: [],
      // 涉及明细数字典
      xjmxsOptions: [],
      // 涉及金额字典
      xjjeOptions: [],
      // 结算费用字典
      jsfyOptions: [],
      // 险种字典
      ybbfOptions: [],
      // 行政区字典
      xzqOptions: [],
      // 结算等级字典
      jsdjOptions: [],
      // 添加时间字典
      addtimeOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 异本地字典
      ybdOptions: [],
      // 数据开始时间字典
      datastarttimeOptions: [],
      // 信用代码字典
      xydmOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jgdm: null,
        jgmc: null,
        gzfl: null,
        gzmc: null,
        rwpcid: null,
        xjjzrs: null,
        xjmxs: null,
        xjje: null,
        jsfy: null,
        ybbf: null,
        xzq: null,
        jsdj: null,
        addtime: null,
        jslb: null,
        ybd: null,
        datastarttime: null,
        xydm: null
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
      this.jgdmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgmcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.gzflOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.gzmcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.rwpcidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xjjzrsOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xjmxsOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xjjeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jsfyOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ybbfOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xzqOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jsdjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.addtimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jslbOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ybdOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.datastarttimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xydmOptions = response.data;
    });
  },
  methods: {
    /** 查询renwuthree列表 */
    getList() {
      this.loading = true;
      listRenwuthree(this.queryParams).then(response => {
        this.renwuthreeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabel(this.jgmcOptions, row.jgmc);
    },
    // 规则分类字典翻译
    gzflFormat(row, column) {
      return this.selectDictLabel(this.gzflOptions, row.gzfl);
    },
    // 规则名称字典翻译
    gzmcFormat(row, column) {
      return this.selectDictLabel(this.gzmcOptions, row.gzmc);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // 涉及就诊人数字典翻译
    xjjzrsFormat(row, column) {
      return this.selectDictLabel(this.xjjzrsOptions, row.xjjzrs);
    },
    // 涉及明细数字典翻译
    xjmxsFormat(row, column) {
      return this.selectDictLabel(this.xjmxsOptions, row.xjmxs);
    },
    // 涉及金额字典翻译
    xjjeFormat(row, column) {
      return this.selectDictLabel(this.xjjeOptions, row.xjje);
    },
    // 结算费用字典翻译
    jsfyFormat(row, column) {
      return this.selectDictLabel(this.jsfyOptions, row.jsfy);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabel(this.ybbfOptions, row.ybbf);
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
    },
    // 结算等级字典翻译
    jsdjFormat(row, column) {
      return this.selectDictLabel(this.jsdjOptions, row.jsdj);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabel(this.addtimeOptions, row.addtime);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabel(this.jslbOptions, row.jslb);
    },
    // 异本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabel(this.ybdOptions, row.ybd);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabel(this.datastarttimeOptions, row.datastarttime);
    },
    // 信用代码字典翻译
    xydmFormat(row, column) {
      return this.selectDictLabel(this.xydmOptions, row.xydm);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        jgdm: null,
        jgmc: null,
        gzfl: null,
        gzmc: null,
        rwpcid: null,
        xjjzrs: null,
        xjmxs: null,
        xjje: null,
        jsfy: null,
        ybbf: null,
        xzq: null,
        jsdj: null,
        addtime: null,
        jslb: null,
        ybd: null,
        datastarttime: null,
        xydm: null
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
      this.title = "添加renwuthree";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const jgdm = row.id || this.ids
      getRenwuthree(jgdm).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwuthree";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenwuthree(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwuthree(this.form).then(response => {
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
      const jgdms = row.id || this.ids;
      this.$confirm('是否确认删除renwuthree编号为"' + jgdms + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwuthree(jgdms);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwuthree数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwuthree(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>