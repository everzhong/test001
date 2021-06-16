<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="添加记录时间" prop="addtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.addtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择添加记录时间">
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
          v-hasPermi="['renwu:jcfl:add']"
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
          v-hasPermi="['renwu:jcfl:edit']"
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
          v-hasPermi="['renwu:jcfl:remove']"
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
          v-hasPermi="['renwu:jcfl:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jcflList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" :formatter="idFormat" />
      <el-table-column label="监管流程" align="center" prop="jglc" :formatter="jglcFormat" />
      <el-table-column label="关键信息" align="center" prop="gjxx" :formatter="gjxxFormat" />
      <el-table-column label="最后操作人" align="center" prop="zhczr" :formatter="zhczrFormat" />
      <el-table-column label="最后操作时间" align="center" prop="zhczsj" :formatter="zhczsjFormat" />
      <el-table-column label="备注" align="center" prop="bz" :formatter="bzFormat" />
      <el-table-column label="批次号" align="center" prop="rwpcid" :formatter="rwpcidFormat" />
      <el-table-column label="机构代码" align="center" prop="jgdm" :formatter="jgdmFormat" />
      <el-table-column label="添加记录时间" align="center" prop="addtime" width="180">
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
            v-hasPermi="['renwu:jcfl:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['renwu:jcfl:remove']"
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

    <!-- 添加或修改jcfl对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="添加记录时间" prop="addtime">
          <el-date-picker clearable size="small"
            v-model="form.addtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加记录时间">
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
import { listJcfl, getJcfl, delJcfl, addJcfl, updateJcfl, exportJcfl } from "@/api/renwu/jcfl";

export default {
  name: "Jcfl",
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
      // jcfl表格数据
      jcflList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // ID字典
      idOptions: [],
      // 监管流程字典
      jglcOptions: [],
      // 关键信息字典
      gjxxOptions: [],
      // 最后操作人字典
      zhczrOptions: [],
      // 最后操作时间字典
      zhczsjOptions: [],
      // 备注字典
      bzOptions: [],
      // 批次号字典
      rwpcidOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 添加记录时间字典
      addtimeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        jglc: null,
        gjxx: null,
        zhczr: null,
        zhczsj: null,
        bz: null,
        rwpcid: null,
        jgdm: null,
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
      this.idOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jglcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.gjxxOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.zhczrOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.zhczsjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.bzOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.rwpcidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgdmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.addtimeOptions = response.data;
    });
  },
  methods: {
    /** 查询jcfl列表 */
    getList() {
      this.loading = true;
      listJcfl(this.queryParams).then(response => {
        this.jcflList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // ID字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // 监管流程字典翻译
    jglcFormat(row, column) {
      return this.selectDictLabel(this.jglcOptions, row.jglc);
    },
    // 关键信息字典翻译
    gjxxFormat(row, column) {
      return this.selectDictLabel(this.gjxxOptions, row.gjxx);
    },
    // 最后操作人字典翻译
    zhczrFormat(row, column) {
      return this.selectDictLabel(this.zhczrOptions, row.zhczr);
    },
    // 最后操作时间字典翻译
    zhczsjFormat(row, column) {
      return this.selectDictLabel(this.zhczsjOptions, row.zhczsj);
    },
    // 备注字典翻译
    bzFormat(row, column) {
      return this.selectDictLabel(this.bzOptions, row.bz);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 添加记录时间字典翻译
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
        id: null,
        jglc: null,
        gjxx: null,
        zhczr: null,
        zhczsj: null,
        bz: null,
        rwpcid: null,
        jgdm: null,
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
      this.title = "添加jcfl";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getJcfl(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改jcfl";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateJcfl(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJcfl(this.form).then(response => {
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
      this.$confirm('是否确认删除jcfl编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delJcfl(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有jcfl数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportJcfl(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>