<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="从属哪一号令" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择从属哪一号令" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="行为编号" prop="xwbh">
        <el-input
          v-model="queryParams.xwbh"
          placeholder="请输入行为编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="违规行为" prop="wgxw">
        <el-input
          v-model="queryParams.wgxw"
          placeholder="请输入违规行为"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="违规从属行为" prop="lx">
        <el-input
          v-model="queryParams.lx"
          placeholder="请输入违规从属行为"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入ID"
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
          v-hasPermi="['renwu:xwrd:add']"
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
          v-hasPermi="['renwu:xwrd:edit']"
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
          v-hasPermi="['renwu:xwrd:remove']"
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
          v-hasPermi="['renwu:xwrd:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="xwrdList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="从属哪一号令" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="行为编号" align="center" prop="xwbh" :formatter="xwbhFormat" />
      <el-table-column label="违规行为" align="center" prop="wgxw" :formatter="wgxwFormat" />
      <el-table-column label="违规从属行为" align="center" prop="lx" :formatter="lxFormat" />
      <el-table-column label="ID" align="center" prop="id" :formatter="idFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['renwu:xwrd:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['renwu:xwrd:remove']"
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

    <!-- 添加或修改xwrd对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="从属哪一号令" prop="type">
          <el-select v-model="form.type" placeholder="请选择从属哪一号令">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行为编号" prop="xwbh">
          <el-input v-model="form.xwbh" placeholder="请输入行为编号" />
        </el-form-item>
        <el-form-item label="违规行为" prop="wgxw">
          <el-input v-model="form.wgxw" placeholder="请输入违规行为" />
        </el-form-item>
        <el-form-item label="违规从属行为" prop="lx">
          <el-input v-model="form.lx" placeholder="请输入违规从属行为" />
        </el-form-item>
        <el-form-item label="ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入ID" />
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
import { listXwrd, getXwrd, delXwrd, addXwrd, updateXwrd, exportXwrd } from "@/api/renwu/xwrd";

export default {
  name: "Xwrd",
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
      // xwrd表格数据
      xwrdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 从属哪一号令字典
      typeOptions: [],
      // 行为编号字典
      xwbhOptions: [],
      // 违规行为字典
      wgxwOptions: [],
      // 违规从属行为字典
      lxOptions: [],
      // ID字典
      idOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        xwbh: null,
        wgxw: null,
        lx: null,
        id: null
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
    this.getDicts("sys_renwu_wgfl").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xwbhOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.wgxwOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.lxOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.idOptions = response.data;
    });
  },
  methods: {
    /** 查询xwrd列表 */
    getList() {
      this.loading = true;
      listXwrd(this.queryParams).then(response => {
        this.xwrdList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 从属哪一号令字典翻译
    typeFormat(row, column) {
      return this.selectDictLabels(this.typeOptions, row.type);
    },
    // 行为编号字典翻译
    xwbhFormat(row, column) {
      return this.selectDictLabels(this.xwbhOptions, row.xwbh);
    },
    // 违规行为字典翻译
    wgxwFormat(row, column) {
      return this.selectDictLabels(this.wgxwOptions, row.wgxw);
    },
    // 违规从属行为字典翻译
    lxFormat(row, column) {
      return this.selectDictLabels(this.lxOptions, row.lx);
    },
    // ID字典翻译
    idFormat(row, column) {
      return this.selectDictLabels(this.idOptions, row.id);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        type: null,
        xwbh: null,
        wgxw: null,
        lx: null,
        id: null
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
      this.title = "添加xwrd";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getXwrd(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改xwrd";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateXwrd(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addXwrd(this.form).then(response => {
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
      this.$confirm('是否确认删除xwrd编号为"' + id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delXwrd(types);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有xwrd数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportXwrd(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>