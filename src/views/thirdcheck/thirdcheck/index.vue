<template>
  <div class="app-container">
    <!-- <SearchItem @handleQuery="handleQuery"/> -->
    <el-form class="top-search" :model="query" ref="queryForm" :inline="true"  label-width="68px">
    <el-row>
      <el-col :span="22">
        <el-form-item label="批次号" prop="rwpcid">
            <el-input
              v-model="query.rwpcid"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
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
          <el-form-item label="机构代码 " prop="jgdm">
             <el-input
              v-model="query.jgdm"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="抽取状态" prop="sccqstatus">
            <el-select v-model="query.sccqstatus" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in chouquOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执行状态" prop="scstatus">
            <el-select v-model="query.scstatus" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in zhixOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item style="margin-right:0;text-align:right">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
    <div v-loading="loading" class="table-main">
      <!-- <RenwuthreeTable :tableData="renwuthreeList"/> -->
      <el-table :data="renwuthreeList" border height="100%" style="width:100%">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="序号" type="index" align="center"  /> -->
        <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',renwuthreeList)"/>
        <el-table-column label="筛查任务ID" align="center" prop="scrwid"  :width="flexColumnWidth('scrwid',renwuthreeList)"/>
        <el-table-column label="数据开始日期" align="center" prop="datastarttime" width="150">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.datastarttime,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数据结束日期" align="center" prop="dataendtime" width="150">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',renwuthreeList)"/>
        <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',renwuthreeList)"/>
        <el-table-column label="数据抽取状态" align="center" prop="sccqstatus"  show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.sccqstatus==1?'未开始':scope.row.sccqstatus==2?'执行中':scope.row.sccqstatus==3?'完成':scope.row.sccqstatus==4?'无需抽取':'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="规则执行状态" align="center" prop="scstatus">
           <template slot-scope="scope">
            <span>{{scope.row.scstatus==1?'未开始':scope.row.scstatus==2?'执行中':scope.row.scstatus==3?'完成':'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openUrl(scope.row)">数据筛查</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      class="fixed-bottom"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { setShujusc,listRenwutwosc} from '@/api/renwu/renwutwo'
// import SearchItem from '../../common/searchItems'
import RenwuthreeTable from '../../common/renwuthreeTable'
export default {
  name: "Thirdcheck",
  components: {
    // SearchItem,
    RenwuthreeTable,
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
      // renwutwo表格数据
      renwutwoList: [],
      renwuthreeList: [],
      renwufourList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 异本地字典
      ybdOptions: [],
      // 数据开始时间字典
      datastarttimeOptions: [],
      // 批次号字典
      rwpcidOptions: [],
      // 险种字典
      ybbfOptions: [],
      // 数据结束时间字典
      dataendtimeOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 行政区字典
      xzqOptions: [],
      // 网审意见字典
      wsyjOptions: [],
      // 更新时间字典
      uptimeOptions: [],
      // 网审人员字典
      wsryOptions: [],
      // 涉及规则数字典
      sjwgsOptions: [],
      // 疑点金额字典
      ydjeOptions: [],
      // 结算金额字典
      jsjeOptions: [],
      // 涉及就诊人次字典
      jsrcOptions: [],
      // 添加时间字典
      addtimeOptions: [],
      // 信用代码字典
      xydmOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 机构名称字典
      jgmcOptions: [],
      // 结算等级字典
      jsdjOptions: [],
      // 网审人员2字典
      wsry2Options: [],
      // 对象同意或驳回字典
      dxqdOptions: [],
      // 流程识别ID字典
      statusOptions: [],
      chouquOptions: [
        {dictValue:1,dictLabel:'未开始'},
        {dictValue:2,dictLabel:'执行中'},
        {dictValue:3,dictLabel:'完成'},
        {dictValue:4,dictLabel:'无需抽取'}
      ],
      zhixOptions: [
        {dictValue:1,dictLabel:'未开始'},
        {dictValue:2,dictLabel:'执行中'},
        {dictValue:3,dictLabel:'完成'},
      ],
      // 检查组ID字典
      jczidOptions: [],
      // 是否打印了通知字典
      isdayinOptions: [],
      // 打印通知书联系人字典
      dayinnameOptions: [],
      // 打印通知书联系电话(检查通知书)字典
      dayintelOptions: [],
      // 打印日期字典
      dayinriqiOptions: [],
      // 打印通知书联系电话(纪律告知书)字典
      dayinphoneOptions: [],
      // 打印中的检查开始日期字典
      dayinstarttimeOptions: [],
      // 形成结果同意或驳回字典
      dcjgOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      query:{
        rwpcid:'',//任务批次号
        jgmc:'',//机构名称
        jgdm:'',//机构代码
        sccqstatus:'',//抽取状态
        scstatus:''//执行状态
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //
      tabsValue:'two',
      hasThirdUncheck:false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openUrl(row){
      const {scrwid,scname,datastarttime,dataendtime,jgdm,id,jczid} = row
      setShujusc({
        id,
        scrwid,
        scname,
        datastarttime,
        dataendtime,
        createBy:this.$store.getters.name,
        jgdm,
        jczid,
        deptId:this.$store.getters.userId
      })
      window.open(`${location.protocol}//${location.hostname}:8012/#/scenarioConfiguration`)
    },
    /** 查询renwutwo列表 */
    async getList(options) {
      const params = options?{...this.queryParams,...options}:this.queryParams
      // params.scstatus=1
      this.loading = true
      try {
        const res = await listRenwutwosc(params)
        if(res.code===200){
          this[`renwuthreeList`] = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    /**
     * 医院维度tabsValue=Two
    */
    async getRenwTwo(params){
      this.loading = true;
      try {
        const res =  await listRenwutwo(params)
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    
    // 异本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabel(this.ybdOptions, row.ybd);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabel(this.datastarttimeOptions, row.datastarttime);
    },
    // 批次号字典翻译
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
    // 涉及规则数字典翻译
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
    // 涉及就诊人次字典翻译
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
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      !this.query.sccqstatus&&(delete this.query.sccqstatus);
      this.getList(this.query);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      const hasuncheck = selection.filter(item => {
        return (item.sancha && item.sancha*1 === 1)
      });
      //第三方筛查状态sancha 1已查 0未查
      this.hasThirdUncheck = hasuncheck && hasuncheck.length>0
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
  }
};
</script>
<style lang="scss" scoped>
.tabs-part {
  clear: both;
}
.table-main {
  position: absolute;
  top:114px;
  bottom:70px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:30px;
  right: 0px;
}
</style>