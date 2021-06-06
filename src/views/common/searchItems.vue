<template>
  <el-form class="top-search" :model="query" ref="queryForm" :inline="true"  label-width="68px">
      <el-form-item label="机构名称" prop="jgmc">
        <el-input
          v-model="query.jgmc"
          placeholder="请输入"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构等级" prop="jgdj">
        <el-select v-model="query.jgdj" placeholder="请选择" clearable size="small" style="width: 180px">
          <el-option
            v-for="dict in rwmcOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="就医类型" prop="jylb">
        <el-select v-model="query.wtjg" placeholder="请选择" clearable size="small" style="width: 180px">
          <el-option
            v-for="dict in rwmcOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="第三方筛查状态" prop="dsfsc" label-width="113px">
        <el-select v-model="query.dsfsc" placeholder="请选择" clearable size="small" style="width: 180px">
          <el-option
            v-for="dict in cbjgOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="行政区" prop="xzq">
        <el-select v-model="query.xzq" placeholder="请选择" clearable size="small" style="width: 180px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="险种" prop="ybbf">
        <el-select v-model="query.ybbf" placeholder="请选择" clearable size="small" style="width: 180px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="任务状态" prop="status">
        <el-select v-model="query.status" placeholder="请选择" clearable size="small" style="width: 180px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
export default {
  name:'SearchItem',
  data() { 
    return {
      query:{
        jgmc:'',//机构名称
        jgdj:'',//机构等级
        jylb:'',//就医类别
        dsfsc:'',//第三方筛查
        yybf:'',//险种
        xzq:'',//行政区
        status:''//任务状态
      },
      rwmcOptions:[],
      cbjgOptions:[],
      statusOptions:[]
    }
  },
  props:[],
  created(){
    // this.getDic()
  },
  methods:{
    /** 搜索按钮操作 */
    handleQuery() {
      this.$emit('handleQuery',this.query)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getDic(){
      this.getDicts("${column.dictType}").then(response => {
        this.ybdOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.datastarttimeOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.rwpcidOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.ybbfOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.dataendtimeOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.jslbOptions = response.data;
      });

      this.getDicts("${column.dictType}").then(response => {
        this.xzqOptions = response.data;
      });

      this.getDicts("sys_common_check").then(response => {
        this.wsyjOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.uptimeOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.wsryOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.sjwgsOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.ydjeOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.jsjeOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.jsrcOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.addtimeOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.xydmOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.jgdmOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.jgmcOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.jsdjOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.wsry2Options = response.data;
      });
      this.getDicts("sys_common_yesno").then(response => {
        this.dxqdOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.jczidOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.isdayinOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.dayinnameOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.dayintelOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.dayinriqiOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.dayinphoneOptions = response.data;
      });
      this.getDicts("${column.dictType}").then(response => {
        this.dayinstarttimeOptions = response.data;
      });
      this.getDicts("sys_common_yesno").then(response => {
        this.dcjgOptions = response.data;
      });
    },
    // 异本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabel(this.ybdOptions, row.ybd);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabel(this.datastarttimeOptions, row.datastarttime);
    },
    // 任务批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabel(this.ybbfOptions, row.ybbf);
    },
    // 数据结束时间字典翻译
    dataendtimeFormat(row, column) {
      return this.selectDictLabel(this.dataendtimeOptions, row.dataendtime);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabel(this.jslbOptions, row.jslb);
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
    },
    // 网审意见字典翻译
    wsyjFormat(row, column) {
      return this.selectDictLabel(this.wsyjOptions, row.wsyj);
    },
    // 更新时间字典翻译
    uptimeFormat(row, column) {
      return this.selectDictLabel(this.uptimeOptions, row.uptime);
    },
    // 网审人员字典翻译
    wsryFormat(row, column) {
      return this.selectDictLabel(this.wsryOptions, row.wsry);
    },
    // 涉及违规数字典翻译
    sjwgsFormat(row, column) {
      return this.selectDictLabel(this.sjwgsOptions, row.sjwgs);
    },
    // 疑点金额字典翻译
    ydjeFormat(row, column) {
      return this.selectDictLabel(this.ydjeOptions, row.ydje);
    },
    // 结算金额字典翻译
    jsjeFormat(row, column) {
      return this.selectDictLabel(this.jsjeOptions, row.jsje);
    },
    // 结算人次字典翻译
    jsrcFormat(row, column) {
      return this.selectDictLabel(this.jsrcOptions, row.jsrc);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabel(this.addtimeOptions, row.addtime);
    },
    // 信用代码字典翻译
    xydmFormat(row, column) {
      return this.selectDictLabel(this.xydmOptions, row.xydm);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabel(this.jgmcOptions, row.jgmc);
    },
    // 结算等级字典翻译
    jsdjFormat(row, column) {
      return this.selectDictLabel(this.jsdjOptions, row.jsdj);
    },
    // 网审人员2字典翻译
    wsry2Format(row, column) {
      return this.selectDictLabel(this.wsry2Options, row.wsry2);
    },
    // 对象同意或驳回字典翻译
    dxqdFormat(row, column) {
      return this.selectDictLabel(this.dxqdOptions, row.dxqd);
    },
    // 流程识别ID字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 检查组ID字典翻译
    jczidFormat(row, column) {
      return this.selectDictLabel(this.jczidOptions, row.jczid);
    },
    // 是否打印了通知字典翻译
    isdayinFormat(row, column) {
      return this.selectDictLabel(this.isdayinOptions, row.isdayin);
    },
    // 打印通知书联系人字典翻译
    dayinnameFormat(row, column) {
      return this.selectDictLabel(this.dayinnameOptions, row.dayinname);
    },
    // 打印通知书联系电话(检查通知书)字典翻译
    dayintelFormat(row, column) {
      return this.selectDictLabel(this.dayintelOptions, row.dayintel);
    },
    // 打印日期字典翻译
    dayinriqiFormat(row, column) {
      return this.selectDictLabel(this.dayinriqiOptions, row.dayinriqi);
    },
    // 打印通知书联系电话(纪律告知书)字典翻译
    dayinphoneFormat(row, column) {
      return this.selectDictLabel(this.dayinphoneOptions, row.dayinphone);
    },
    // 打印中的检查开始日期字典翻译
    dayinstarttimeFormat(row, column) {
      return this.selectDictLabel(this.dayinstarttimeOptions, row.dayinstarttime);
    },
    // 形成结果同意或驳回字典翻译
    dcjgFormat(row, column) {
      return this.selectDictLabel(this.dcjgOptions, row.dcjg);
    },/*  */
  }
}
</script>