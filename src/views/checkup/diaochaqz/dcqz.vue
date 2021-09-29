<template>
  <div class="app-container">
    <el-form size="small" label-width="100px" ref="queryForm" :inline="true" v-show="showSearch">
          <el-form-item label="险种" prop="ybbf">
            <el-input readonly v-model="queryInfoFrom.ybbf"></el-input>
          </el-form-item>
          <el-form-item label="就医类型" prop="jslb">
            <el-input readonly v-model="queryInfoFrom.jslb"></el-input>
          </el-form-item>
          <el-form-item label="批次号" prop="rwpcid">
            <el-input readonly v-model="queryInfoFrom.rwpcid"></el-input>
          </el-form-item>
          <el-form-item label="数据开始日期" prop="datastarttime">
            <el-input readonly v-model="queryInfoFrom.datastarttime"></el-input>
          </el-form-item>
          <el-form-item label="数据结束日期" prop="dataendtime">
            <el-input readonly v-model="queryInfoFrom.dataendtime"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="jgmc">
            <el-input readonly v-model="queryInfoFrom.jgmc"></el-input>
          </el-form-item>
            <el-form-item label="检查机构" prop="jcjg">
            <el-input readonly v-model="queryInfoFrom.jcjg"></el-input>
          </el-form-item>
            <el-form-item label="检查组" prop="jcz">
            <el-input readonly v-model="queryInfoFrom.jcz"></el-input>
          </el-form-item>
          <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
            <el-button type="primary" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
          </div>
    </el-form>
    <el-radio-group v-model="tabsValue" size="small">
      <el-radio-button label="1">证据资料</el-radio-button>
      <el-radio-button label="2">检查笔录</el-radio-button>
      <el-radio-button label="3">询问笔录</el-radio-button>
    </el-radio-group>
    <!-- <el-tabs type="card" v-model="tabsValue">
      <el-tab-pane label="证据资料" name="1"></el-tab-pane>
      <el-tab-pane label="检查笔录" name="2"></el-tab-pane>
      <el-tab-pane label="询问笔录" name="3"></el-tab-pane>
    </el-tabs> -->
    <zhengjuzl v-if="tabsValue==='1'"/>
    <jcbl v-else-if="tabsValue==='2'" />
    <xunwbl v-else/>
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
import Zhengjuzl from './zhengjuzl.vue'
import Jcbl from './jcbl.vue'
import Xunwbl from './xunwbl.vue'

export default {
  name: "Dcqz",
  components: {
    FileUpload,
    Zhengjuzl,
    Jcbl,
    Xunwbl
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
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      tabsValue:'1',
      //上页带过来的参数
      queryInfoFrom:{}
    };
  },
  created() {
    this.queryInfoFrom = this.$route.query
    // this.gitDic();
  },
  methods: {
    /** 查询调查取证列表 */
    async getList() {
      const {query} = this.$route
      const params = query?{...query,...this.queryParams}:this.queryParams
      this.loading = true;
      try {
        const res = await listDcqz(params)
        if(res.code===200){
          this.dcqzList = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // ID字典翻译
    qzidFormat(row, column) {
      return this.selectDictLabel(this.qzidOptions, row.qzid);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 资料说明字典翻译
    zlsmFormat(row, column) {
      return this.selectDictLabel(this.zlsmOptions, row.zlsm);
    },
    // 上传者字典翻译
    upmanFormat(row, column) {
      return this.selectDictLabel(this.upmanOptions, row.upman);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabel(this.addtimeOptions, row.addtime);
    },
    // 检查地点字典翻译
    jcddFormat(row, column) {
      return this.selectDictLabel(this.jcddOptions, row.jcdd);
    },
    // 检查开始时间字典翻译
    jcstarttimeFormat(row, column) {
      return this.selectDictLabel(this.jcstarttimeOptions, row.jcstarttime);
    },
    // 检查结束时间字典翻译
    jcendtimeFormat(row, column) {
      return this.selectDictLabel(this.jcendtimeOptions, row.jcendtime);
    },
    // 单位全称字典翻译
    dwqcFormat(row, column) {
      return this.selectDictLabel(this.dwqcOptions, row.dwqc);
    },
    // 单位地址字典翻译
    addrFormat(row, column) {
      return this.selectDictLabel(this.addrOptions, row.addr);
    },
    // 法人字典翻译
    farenFormat(row, column) {
      return this.selectDictLabel(this.farenOptions, row.faren);
    },
    // 联系电话字典翻译
    telFormat(row, column) {
      return this.selectDictLabel(this.telOptions, row.tel);
    },
    // 执法人员字典翻译
    zfryFormat(row, column) {
      return this.selectDictLabel(this.zfryOptions, row.zfry);
    },
    // 被询问人字典翻译
    xwnameFormat(row, column) {
      return this.selectDictLabel(this.xwnameOptions, row.xwname);
    },
    // 性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    // 被询问人身份证号字典翻译
    sfzFormat(row, column) {
      return this.selectDictLabel(this.sfzOptions, row.sfz);
    },
    // 被询问人联系地址字典翻译
    lxdzFormat(row, column) {
      return this.selectDictLabel(this.lxdzOptions, row.lxdz);
    },
    // 备注字典翻译
    bzFormat(row, column) {
      return this.selectDictLabel(this.bzOptions, row.bz);
    },
    // 文件地址字典翻译
    wenjianurlFormat(row, column) {
      return this.selectDictLabel(this.wenjianurlOptions, row.wenjianurl);
    },
    // 文件名称字典翻译
    wenjianFormat(row, column) {
      return this.selectDictLabel(this.wenjianOptions, row.wenjian);
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
    },
    gitDic(){
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
    }
  }
};
</script>
