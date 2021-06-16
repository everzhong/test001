<template>
  <div class="app-container">
    <div style="position:absolute;right:20px;top:-31px;background-color:#fff">
      <el-button type="primary" icon="el-icon-back" size="mini" @click="dayinBack">返回</el-button>
    </div>
    
    <div class="zhizuo-port">
        <div class="zhizuo">
          <el-table v-if="zhzList.length>1" :data="zhzList" border style="margin-bottom:10px">
            <el-table-column label="机构代码" prop="jgdm" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="机构名称" prop="jgmc" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="行政区" prop="xzq" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="检查开始时间" prop="dayinstarttime" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{parseTime(scope.row.dayinstarttime,'{y}年{m}月{d}日}')}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="zhizuo-item" v-if="zhzList.length===1">
            <span>检查开始日期</span>
            <el-date-picker
              v-model="zhizuo.dayinstarttime"
              type="date"
              size="small"
              placeholder="选择检查开始日期"
              format="yyyy-MM-dd"
              >
            </el-date-picker>
          </div>
          <div class="zhizuo-item">
            <span>联系人</span>
            <el-input size="small" v-model="zhizuo.dayinname"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.dayintel" maxlength="11"></el-input>
            <span>(检查通知书)</span>
          </div>
          <div class="zhizuo-item">
            <span>制作日期</span>
            <el-date-picker
              v-model="zhizuo.dayinriqi"
              type="date"
              size="small"
              placeholder="选择制作日期"
              format="yyyy-MM-dd"
              >
            </el-date-picker>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.dayinphone" maxlength="11"></el-input>
            <span>(纪律告知书)</span>
          </div>
          <div style="text-align:right;padding:5px 15px 0 0">
            <el-button size="mini" type="primary" @click="submitForm">保存</el-button>
          </div>
        </div>
        <div class="pre-view">
          <p class="top-tip">预览通知书</p>
          <single-notice v-if="zhzList.length<2" :pageData="zhizuo"></single-notice>
          <mutile-notice v-else :zhizuo="zhizuo" :noticeList="zhzList"></mutile-notice>
        </div>
    </div>
  </div>
</template> 

<script>
import { listDcqz, getDcqz, delDcqz, addDcqz, } from "@/api/renwu/dcqz";
import { listRenwutwo, getRenwutwo, delRenwutwo, addRenwutwo, updateRenwutwo, exportRenwutwo,setDytz } from "@/api/renwu/renwutwo"

import SingleNotice from './singleNotice.vue'
import mutileNotice from './mutilNotice.vue'

export default {
  name: "AddNotice",
  components: {
    SingleNotice,
    mutileNotice
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
      zhizuo:{},
      zhzList:[],
    };
  },
  created() {
    let printData = localStorage.getItem('PRDATA')
    if(printData){
      printData = JSON.parse(printData)
      this.zhzList = printData
      //不管批量还是单个，首先默认编辑的都是第一份
      this.zhizuo = printData[0]
      this.ids = printData.map(item => item.id)
    }
    // this.getList();
    // this.gitDic();
  },
  methods: {
    dayinBack(){
      this.zhzList = []
      window.localStorage.removeItem('PRDATA')
      this.$router.back(-1)
    },
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
      const {
        dayinstarttime,
        dayintel,
        dayinname,
        dayinphone,
        dayinriqi
      } = this.zhizuo
      if(!(dayintel&&dayinname&&dayinphone&&dayinriqi)){
        this.msgError('请填完所有项目后再点保存')
        return false
      } 
      setDytz({
        ids:this.ids,
        isdayin:1,
        dayinstarttime,
        dayintel,
        dayinname,
        dayinphone,
        dayinriqi,
        rwpcid:this.zhizuo.rwpcid,
        jgdm:this.zhizuo.jgdm
        }).then(response => {
        this.msgSuccess("制作成功");
        this.getList();
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
    width: 600px;
    color:#606266;
    .zhizuo-item {
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 5px;
      width: 450px;
      &::v-deep .el-input__inner {
        color:#303313;
        width: 300px;
        margin-right: 10px;
      }
      &::v-deep .el-date-editor.el-input {
        width: 300px;
      }
      >span {
        display: block;
        width: 100px;
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
      width: 595px;
      padding:10px 20px;
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
        margin-bottom: 10px;
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
        font-size: 14px;
        border:1px solid #303313;
        .content-title {
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          margin-bottom: 45px;
        }
        .company {
          text-align: left;
          display: inline-block;
          border-bottom: 1px solid #313303;
          margin-bottom: 30px;
        }
        .jianchaqk {
          text-indent: 2em;
          letter-spacing:2px;
          margin-top:10px;
          margin-bottom: 20px;
          text-align: justify;
          >span {
            text-indent: 0;
            text-align: center;
            display: inline-block;
            min-width: 150px;
            border-bottom: 1px solid #303310;
          }
        }
        .extra {
          margin-bottom:60px;
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
