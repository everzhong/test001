<template>
  <div class="app-container">
    <el-form
      size="small"
      label-width="100px"
      class="top-search"
      style="display:block;overflow:auto;max-height:129px"
      ref="queryForm"
      :inline="true"
    >
      <el-form-item label="批次号" prop="rwpcid">
        <el-input readonly v-model="queryInfoFrom.rwpcid"></el-input>
      </el-form-item>
      <el-form-item label="案件来源" prop="ajly">
        <el-input readonly v-model="queryInfoFrom.ajly"></el-input>
      </el-form-item>
      <el-form-item label="险种" prop="ybbf">
        <el-input readonly v-model="queryInfoFrom.ybbf"></el-input>
      </el-form-item>
      <el-form-item label="就医类型" prop="jslb">
        <el-input readonly v-model="queryInfoFrom.jslb"></el-input>
      </el-form-item>
      <el-form-item label="数据开始日期" prop="datastarttime">
        <el-input readonly v-model="queryInfoFrom.datastarttime"></el-input>
      </el-form-item>
      <el-form-item label="数据结束日期" prop="dataendtime">
        <el-input readonly v-model="queryInfoFrom.dataendtime"></el-input>
      </el-form-item>
      <el-form-item label="机构代码" prop="jgmc">
        <el-input readonly v-model="queryInfoFrom.jgmc"></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="jgmc">
        <el-input readonly v-model="queryInfoFrom.jgmc"></el-input>
      </el-form-item>
      <el-form-item label="机构等级" prop="jgdj">
        <el-input readonly v-model="queryInfoFrom.cxjg"></el-input>
      </el-form-item>
      <el-form-item label="行政区" prop="xzq">
        <el-input readonly v-model="queryInfoFrom.jcz"></el-input>
      </el-form-item>
      <el-form-item label="监管阶段" prop="jgjd">
        <el-input readonly v-model="queryInfoFrom.jcz"></el-input>
      </el-form-item>
      <div
        style="
          position: absolute;
          right: 20px;
          top: -72px;
          background-color: #fff;
        "
      >
        <el-button
          type="primary"
          icon="el-icon-back"
          size="mini"
          @click="$router.back(-1)"
          >返回</el-button
        >
      </div>
    </el-form>
    <div class="table-main" v-loading="loading">
      <sTable :data="jcflList" :header="tableHeader" :fixedNum="1">
        <el-table-column label="序号" type="index" align="center"  slot="fixed"/>
        <el-table-column
          label="监管流程"
          align="center"
          prop="jglc"
          :width="flexColumnWidth('jglc', jcflList)"
        />
        <el-table-column
          label="关键信息"
          align="center"
          prop="gjxx"
          show-overflow-tooltip
        />
        <el-table-column
          label="最新操作人"
          align="center"
          prop="zhczr"
          :width="flexColumnWidth('zhczr', jcflList)"
        />
        <el-table-column
          label="最新操作时间"
          align="center"
          prop="zhczsj"
          show-overflow-tooltip
          width="300"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="150" slot="operate">
          <template slot-scope="scope">
            <el-button
              v-if="
                [1, 7, 8].indexOf(scope.row.sort * 1) > -1 ||
                (scope.row.sort == 6 && queryInfoFrom.isdayin == 1)
              "
              size="mini"
              type="text"
              @click="doCheck(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </sTable>
    </div>
    <pagination
      class="fixed-bottom"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import {
  listJcfl,
  getJcfl,
  delJcfl,
  addJcfl,
  updateJcfl,
  exportJcfl,
} from "@/api/renwu/jcfl";

export default {
  name: "Lulidetail",
  components: {},
  data() {
    return {
      tableHeader:[{
        prop: 'jglc',
        label: '监管流程',
        width:'auto',
      },{
        prop: 'gjxx',
        label: '关键信息',
        width:'auto',
      },{
        prop: 'zhczr',
        label: '最新操作人',
        width:'auto',
      },{
        prop: 'zhczsj',
        label: '最新操作时间',
        viewFun:(zhczsj)=>{
          return this.parseTime(zhczsj)
        },
        width:'auto'
      }],
      // 遮罩层
      loading: false,
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
      xzqOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      queryInfoFrom: {},
    };
  },
  created() {
    this.queryInfoFrom = this.$route.query;
    this.getList();
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
  },
  methods: {
    doCheck(row) {
      const { sort } = row;
      if (sort == 1) {
        this.$router.push(
          {
            path: `/renwu/checkdetail?rwpcid=${this.queryInfoFrom.rwpcid}&fromLuli=1`,
          },
          () => {}
        );
      } else if (sort == 6) {
        window.localStorage.setItem(
          "PRDATA",
          JSON.stringify([this.queryInfoFrom])
        );
        this.$router.push(
          {
            path: "/checkup/viewNotice",
          },
          () => {}
        );
      } else if (sort == 7) {
        this.$router.push(
          {
            path: "/checkup/jcss/shisjc",
            query: { ...this.queryInfoFrom, fromLuli: 1 },
          },
          () => {}
        );
      } else if (sort == 8) {
        this.$router.push(
          {
            path: "/checkup/chubujieguo",
            query: { ...this.queryInfoFrom, fromLuli: 1 },
          },
          () => {}
        );
      }
    },
    /** 查询jcfl列表 */
    async getList() {
      const { rwpcid, jgdm } = this.$route.query;
      const params = { ...this.queryParams, rwpcid, jgdm };
      this.loading = true;
      try {
        const res = await listJcfl(params);
        if (res.code === 200) {
          this.jcflList = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    // ID字典翻译
    idFormat(row, column) {
      return this.selectDictLabels(this.idOptions, row.id);
    },
    // 监管流程字典翻译
    jglcFormat(row, column) {
      return this.selectDictLabels(this.jglcOptions, row.jglc);
    },
    // 关键信息字典翻译
    gjxxFormat(row, column) {
      return this.selectDictLabels(this.gjxxOptions, row.gjxx);
    },
    // 最后操作人字典翻译
    zhczrFormat(row, column) {
      return this.selectDictLabels(this.zhczrOptions, row.zhczr);
    },
    // 最后操作时间字典翻译
    zhczsjFormat(row, column) {
      return this.selectDictLabels(this.zhczsjOptions, row.zhczsj);
    },
    // 备注字典翻译
    bzFormat(row, column) {
      return this.selectDictLabels(this.bzOptions, row.bz);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabels(this.rwpcidOptions, row.rwpcid);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabels(this.jgdmOptions, row.jgdm);
    },
    // 添加记录时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabels(this.addtimeOptions, row.addtime);
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
        addtime: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
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
      const id = row.id || this.ids;
      getJcfl(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改jcfl";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateJcfl(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJcfl(this.form).then((response) => {
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
        type: "warning",
      })
        .then(function () {
          return delJcfl(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有jcfl数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportJcfl(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top: 155px;
  bottom: 70px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom: 30px;
  right: 0px;
}
</style>