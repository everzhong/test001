<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="行政区" prop="xzq">
        <el-input
          v-model="queryParams.xzq"
          placeholder="请输入行政区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目金额" prop="mxxmje">
        <el-input
          v-model="queryParams.mxxmje"
          placeholder="请输入明细项目金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目交易金额" prop="mxxmjyfy">
        <el-input
          v-model="queryParams.mxxmjyfy"
          placeholder="请输入明细项目交易金额"
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
      <el-form-item label="明细项目编号" prop="mxxmbm">
        <el-input
          v-model="queryParams.mxxmbm"
          placeholder="请输入明细项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目名称" prop="mxxmmc">
        <el-input
          v-model="queryParams.mxxmmc"
          placeholder="请输入明细项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通用名" prop="tym">
        <el-input
          v-model="queryParams.tym"
          placeholder="请输入通用名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目单价" prop="mxxmdj">
        <el-input
          v-model="queryParams.mxxmdj"
          placeholder="请输入明细项目单价"
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
      <el-form-item label="明细项目数量" prop="mxxmsl">
        <el-input
          v-model="queryParams.mxxmsl"
          placeholder="请输入明细项目数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目医保结算金额" prop="mxxmbjsfy">
        <el-input
          v-model="queryParams.mxxmbjsfy"
          placeholder="请输入明细项目医保结算金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="费用类别" prop="fylb">
        <el-input
          v-model="queryParams.fylb"
          placeholder="请输入费用类别"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构代码" prop="jgdm">
        <el-input
          v-model="queryParams.jgdm"
          placeholder="请输入机构代码"
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
      <el-form-item label="添加时间" prop="addtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.addtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择添加时间">
        </el-date-picker>
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
          v-hasPermi="['renwu:renwufour:add']"
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
          v-hasPermi="['renwu:renwufour:edit']"
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
          v-hasPermi="['renwu:renwufour:remove']"
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
          v-hasPermi="['renwu:renwufour:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="renwufourList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="行为认定" align="center" prop="xwrd" :formatter="xwrdFormat" />
      <el-table-column label="追款单价" align="center" prop="zkdj">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.zkdj,3)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="违规数量" align="center" prop="wgsl" :formatter="wgslFormat" />
      <el-table-column label="违规费用" align="center" prop="wgfy">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.wgfy,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="bz" :formatter="bzFormat" />
      <el-table-column label="机构名称" align="center" prop="jgmc" :formatter="jgmcFormat" />
      <el-table-column label="规则分类" align="center" prop="gzfl" :formatter="gzflFormat" />
      <el-table-column label="行政区" align="center" prop="xzq" :formatter="xzqFormat" />
      <el-table-column label="明细项目金额" align="center" prop="mxxmje" :formatter="mxxmjeFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmje,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="明细项目交易金额" align="center" prop="mxxmjyfy" :formatter="mxxmjyfyFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmjyfy,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则名称" align="center" prop="gzmc" :formatter="gzmcFormat" />
      <el-table-column label="明细项目编号" align="center" prop="mxxmbm" :formatter="mxxmbmFormat" />
      <el-table-column label="明细项目名称" align="center" prop="mxxmmc" :formatter="mxxmmcFormat" />
      <el-table-column label="通用名" align="center" prop="tym" :formatter="tymFormat" />
      <el-table-column label="明细项目单价" align="center" prop="mxxmdj" :formatter="mxxmdjFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmdj,3)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算等级" align="center" prop="jsdj" :formatter="jsdjFormat" />
      <el-table-column label="明细项目数量" align="center" prop="mxxmsl" :formatter="mxxmslFormat" />
      <el-table-column label="明细项目医保结算金额" align="center" prop="mxxmbjsfy" :formatter="mxxmbjsfyFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmbjsfy,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用类别" align="center" prop="fylb" :formatter="fylbFormat" />
      <el-table-column label="机构代码" align="center" prop="jgdm" :formatter="jgdmFormat" />
      <el-table-column label="批次号" align="center" prop="rwpcid" :formatter="rwpcidFormat" />
      <el-table-column label="ID集" align="center" prop="ids" :formatter="idsFormat" />
      <el-table-column label="添加时间" align="center" prop="addtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['renwu:renwufour:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['renwu:renwufour:remove']"
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

    <!-- 添加或修改renwufour对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机构名称" prop="jgmc">
          <el-input v-model="form.jgmc" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="规则分类" prop="gzfl">
          <el-input v-model="form.gzfl" placeholder="请输入规则分类" />
        </el-form-item>
        <el-form-item label="行政区" prop="xzq">
          <el-input v-model="form.xzq" placeholder="请输入行政区" />
        </el-form-item>
        <el-form-item label="明细项目金额" prop="mxxmje">
          <el-input v-model="form.mxxmje" placeholder="请输入明细项目金额" />
        </el-form-item>
        <el-form-item label="明细项目交易金额" prop="mxxmjyfy">
          <el-input v-model="form.mxxmjyfy" placeholder="请输入明细项目交易金额" />
        </el-form-item>
        <el-form-item label="规则名称" prop="gzmc">
          <el-input v-model="form.gzmc" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="明细项目编号" prop="mxxmbm">
          <el-input v-model="form.mxxmbm" placeholder="请输入明细项目编号" />
        </el-form-item>
        <el-form-item label="明细项目名称" prop="mxxmmc">
          <el-input v-model="form.mxxmmc" placeholder="请输入明细项目名称" />
        </el-form-item>
        <el-form-item label="通用名" prop="tym">
          <el-input v-model="form.tym" placeholder="请输入通用名" />
        </el-form-item>
        <el-form-item label="明细项目单价" prop="mxxmdj">
          <el-input v-model="form.mxxmdj" placeholder="请输入明细项目单价" />
        </el-form-item>
        <el-form-item label="结算等级" prop="jsdj">
          <el-input v-model="form.jsdj" placeholder="请输入结算等级" />
        </el-form-item>
        <el-form-item label="明细项目数量" prop="mxxmsl">
          <el-input v-model="form.mxxmsl" placeholder="请输入明细项目数量" />
        </el-form-item>
        <el-form-item label="明细项目医保结算金额" prop="mxxmbjsfy">
          <el-input v-model="form.mxxmbjsfy" placeholder="请输入明细项目医保结算金额" />
        </el-form-item>
        <el-form-item label="费用类别" prop="fylb">
          <el-input v-model="form.fylb" placeholder="请输入费用类别" />
        </el-form-item>
        <el-form-item label="机构代码" prop="jgdm">
          <el-input v-model="form.jgdm" placeholder="请输入机构代码" />
        </el-form-item>
        <el-form-item label="批次号" prop="rwpcid">
          <el-input v-model="form.rwpcid" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="ID集" prop="ids">
          <el-input v-model="form.ids" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addtime">
          <el-date-picker clearable size="small"
            v-model="form.addtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
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
import { listRenwufour, getRenwufour, delRenwufour, addRenwufour, updateRenwufour, exportRenwufour } from "@/api/renwu/renwufour";

export default {
  name: "Renwufour",
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
      // renwufour表格数据
      renwufourList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 行为认定字典
      xwrdOptions: [],
      // 追款单价字典
      zkdjOptions: [],
      // 违规数量字典
      wgslOptions: [],
      // 违规费用字典
      wgfyOptions: [],
      // 备注字典
      bzOptions: [],
      // 机构名称字典
      jgmcOptions: [],
      // 规则分类字典
      gzflOptions: [],
      // 行政区字典
      xzqOptions: [],
      // 明细项目金额字典
      mxxmjeOptions: [],
      // 明细项目交易金额字典
      mxxmjyfyOptions: [],
      // 规则名称字典
      gzmcOptions: [],
      // 明细项目编号字典
      mxxmbmOptions: [],
      // 明细项目名称字典
      mxxmmcOptions: [],
      // 通用名字典
      tymOptions: [],
      // 明细项目单价字典
      mxxmdjOptions: [],
      // 结算等级字典
      jsdjOptions: [],
      // 明细项目数量字典
      mxxmslOptions: [],
      // 明细项目医保结算金额字典
      mxxmbjsfyOptions: [],
      // 费用类别字典
      fylbOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 批次号字典
      rwpcidOptions: [],
      // ID集字典
      idsOptions: [],
      // 添加时间字典
      addtimeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xwrd: null,
        zkdj: null,
        wgsl: null,
        wgfy: null,
        bz: null,
        jgmc: null,
        gzfl: null,
        xzq: null,
        mxxmje: null,
        mxxmjyfy: null,
        gzmc: null,
        mxxmbm: null,
        mxxmmc: null,
        tym: null,
        mxxmdj: null,
        jsdj: null,
        mxxmsl: null,
        mxxmbjsfy: null,
        fylb: null,
        jgdm: null,
        rwpcid: null,
        ids: null,
        addtime: null
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
      this.addtimeOptions = response.data;
    });
  },
  methods: {
    /** 查询renwufour列表 */
    getList(query) {
      this.loading = true;
      const params = query?{...this.queryParams,query}:this.queryParams
      listRenwufour(params).then(response => {
        this.renwufourList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 行为认定字典翻译
    xwrdFormat(row, column) {
      return this.selectDictLabel(this.xwrdOptions, row.xwrd);
    },
    // 追款单价字典翻译
    zkdjFormat(row, column) {
      return this.selectDictLabel(this.zkdjOptions, row.zkdj);
    },
    // 违规数量字典翻译
    wgslFormat(row, column) {
      return this.selectDictLabel(this.wgslOptions, row.wgsl);
    },
    // 违规费用字典翻译
    wgfyFormat(row, column) {
      return this.selectDictLabel(this.wgfyOptions, row.wgfy);
    },
    // 备注字典翻译
    bzFormat(row, column) {
      return this.selectDictLabel(this.bzOptions, row.bz);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabel(this.jgmcOptions, row.jgmc);
    },
    // 规则分类字典翻译
    gzflFormat(row, column) {
      return this.selectDictLabel(this.gzflOptions, row.gzfl);
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
    },
    // 明细项目金额字典翻译
    mxxmjeFormat(row, column) {
      return this.selectDictLabel(this.mxxmjeOptions, row.mxxmje);
    },
    // 明细项目交易金额字典翻译
    mxxmjyfyFormat(row, column) {
      return this.selectDictLabel(this.mxxmjyfyOptions, row.mxxmjyfy);
    },
    // 规则名称字典翻译
    gzmcFormat(row, column) {
      return this.selectDictLabel(this.gzmcOptions, row.gzmc);
    },
    // 明细项目编号字典翻译
    mxxmbmFormat(row, column) {
      return this.selectDictLabel(this.mxxmbmOptions, row.mxxmbm);
    },
    // 明细项目名称字典翻译
    mxxmmcFormat(row, column) {
      return this.selectDictLabel(this.mxxmmcOptions, row.mxxmmc);
    },
    // 通用名字典翻译
    tymFormat(row, column) {
      return this.selectDictLabel(this.tymOptions, row.tym);
    },
    // 明细项目单价字典翻译
    mxxmdjFormat(row, column) {
      return this.selectDictLabel(this.mxxmdjOptions, row.mxxmdj);
    },
    // 结算等级字典翻译
    jsdjFormat(row, column) {
      return this.selectDictLabel(this.jsdjOptions, row.jsdj);
    },
    // 明细项目数量字典翻译
    mxxmslFormat(row, column) {
      return this.selectDictLabel(this.mxxmslOptions, row.mxxmsl);
    },
    // 明细项目医保结算金额字典翻译
    mxxmbjsfyFormat(row, column) {
      return this.selectDictLabel(this.mxxmbjsfyOptions, row.mxxmbjsfy);
    },
    // 费用类别字典翻译
    fylbFormat(row, column) {
      return this.selectDictLabel(this.fylbOptions, row.fylb);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // ID集字典翻译
    idsFormat(row, column) {
      return this.selectDictLabel(this.idsOptions, row.ids);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabel(this.addtimeOptions, row.addtime);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        xwrd: null,
        zkdj: null,
        wgsl: null,
        wgfy: null,
        bz: null,
        jgmc: null,
        gzfl: null,
        xzq: null,
        mxxmje: null,
        mxxmjyfy: null,
        gzmc: null,
        mxxmbm: null,
        mxxmmc: null,
        tym: null,
        mxxmdj: null,
        jsdj: null,
        mxxmsl: null,
        mxxmbjsfy: null,
        fylb: null,
        jgdm: null,
        rwpcid: null,
        ids: null,
        addtime: null
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
      this.title = "添加renwufour";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const xwrd = row.id || this.ids
      getRenwufour(xwrd).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwufour";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenwufour(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwufour(this.form).then(response => {
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
      const xwrds = row.id || this.ids;
      this.$confirm('是否确认删除renwufour编号为"' + xwrds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwufour(xwrds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwufour数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwufour(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>