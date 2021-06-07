<template>
  <div class="app-container">
    <div style="position:absolute;right:20px;top:-31px">
      <el-button type="primary" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
    </div>
    <div class="zhizuo-port">
        <div class="zhizuo">
          <div class="zhizuo-item">
            <span>检查开始日期</span>
            <el-input size="small" v-model="zhizuo.jcstarttime"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系人</span>
            <el-input size="small" v-model="zhizuo.lxr"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>制作日期</span>
            <el-input size="small" v-model="zhizuo.zzstattime"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.tel"></el-input>
          </div>
          <div style="text-align:right">
            <el-button size="mini" type="primary" @click="submitForm">保存</el-button>
          </div>
        </div>
        <div class="pre-view">
          <p class="top-tip">预览检查笔录</p>
          <div id="docPart" class="doc-part" ref="docPart">
            <h1 class="doc-title">上海市静安区医疗保障局</h1>
            <p class="sub-doc-title">行政执法文书</p>
            <div class="pagation">第<span></span>页&nbsp;&nbsp;&nbsp;&nbsp;共<span></span>页</div>
            <div class="content">
              <p class="content-title">检查笔录</p>
              <div class="item">检查地点：{{zhizuo.jcdd}}</div>
              <!-- <div class="item">检查时间：{{parseTime(zhizuo.jcsj[0],'{y}年{m}月{d}日{h}时{m}分')}}&nbsp;至&nbsp;{{parseTime(zhizuo.jcsj[1],'{y}年{m}月{d}日{h}时{m}分')}}</div> -->
              <p class="item">被检查人（被检查单位）信息：</p>
              <div class="item item-info">单位全称：{{zhizuo.dwqc}}</div>
              <div class="item item-info">类别/性质：定点医疗机构</div>
              <div class="item item-info">单位地址：{{zhizuo.addr}}</div>
              <div class="item item-info">法定代表人：{{zhizuo.faren}}</div>
              <div class="item item-info">记录人：{{zhizuo.jlry}}</div>
              <p class="jianchaqk">我们（至少2人）是上海市医疗保险监督检查所的行政执法人员负责辖区内的医疗保障行政执法工作，这是我们的执法证件，现对&nbsp; &nbsp;进行检查。<br>检查情况：{{zhizuo.jcqk}}</p>
              <div class="sign"><span>被检查人（被检查单位）（签名）：</span><span>见证人（签名）：</span></div>
              <div class="sign"><span>执法人员（签名）：</span><span>记录人（签名）：</span></div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template> 

<script>
import { listDcqz, getDcqz, delDcqz, addDcqz, updateDcqz, exportDcqz } from "@/api/renwu/dcqz";

export default {
  name: "AddNotice",
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
      // 调查取证表格数据
      dcqzList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // ID字典
      qzidOptions: [],
      // 任务批次号字典
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
      //上页带过来的参数
      queryInfoFrom:{},
      zhizuo:{}
    };
  },
  created() {
    // this.getList();
    this.queryInfoFrom = this.$route.query
    this.gitDic();
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
    // 任务批次号字典翻译
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
<style lang="scss" scoped>
.app-container  {
  .zhizuo-outer {
    height:380px;
    overflow: auto;
    margin-bottom: 15px;
  }
  .zhizuo-port {
    display: flex;
    padding-left:10px;
  }
  .zhizuo {
    flex-shrink: 0;
    width: 500px;
    color:#606266;
    .zhizuo-item {
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 10px;
      width: 350px;
      &::v-deep .el-input__inner {
        color:#303313;
      }
      >span {
        display: block;
        width: 130px;
        color:#606266;
        flex-shrink: 0;
      }
    }
  }
  .pre-view {
    padding-left:60px;
    p {
      padding: 0;
      margin: 0;
    }
    .top-tip {
      font-size: 12px;
      color:#606266;
      padding-left: 30px;
    }
    .doc-part {
      width: 800px;
      padding:20px 30px;
      flex-shrink: 0;
      .doc-title {
        margin: 0;
        font-size: 18px;
        font-weight: normal;
        text-align: center;
        margin-bottom: 12px;
      }
      .sub-doc-title {
        font-size: 14px;
        text-align: center;
        letter-spacing:5px;
      }
      .pagation{
        text-align: right;
        font-size: 12px;
        margin-bottom: 10px;
        margin-right: 10px;
        margin-top: 10px;
        >span {
          padding:0 5px;
        }
      }
      .content {
        padding:20px;
        font-size: 16px;
        border:1px solid #303313;
        letter-spacing:1px;
        .content-title {
          font-weight: 600;
          text-align: center;
        }
        .item {
          line-height: 36px;
          &.item-info {
            margin-left: 16px;
          }
        }
        .jianchaqk {
          text-indent: 2em;
          letter-spacing:2px;
          margin-top:10px;
          margin-bottom: 40px;
          text-align: justify;
        }
        .sign {
          margin-bottom: 40px;
          padding-right:90px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
