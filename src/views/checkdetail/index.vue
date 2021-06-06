<template>
  <div class="app-container">
    <SearchItem @handleQuery="handleQuery"/>
    <!-- <div class="tabs-part">
      <div class="left-btn"></div>
      <div class="tabs"></div>
    </div> -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="tabsValue==='two'">
        <el-button
          type="primary"
          size="small"
          @click="handleNetCheck"
          v-hasPermi="['renwu:renwutwo:check']"
        >实施网审</el-button>
      </el-col>
      <el-col :span="1.5" v-if="tabsValue==='two'">
        <el-button
          type="primary"
          size="small"
          @click="handleThirdCheck"
          v-hasPermi="['renwu:renwuone:thirdcheck']"
        >第三方筛查</el-button>
      </el-col>
      
      <div class="top-right-btn">
        <el-radio-group v-model="tabsValue" size="small" @change="tabsLevelChange">
          <el-radio-button label="two">医疗机构列表</el-radio-button>
          <el-radio-button label="three">任务列表-规则列表</el-radio-button>
          <el-radio-button label="four">规则筛查-项目汇总</el-radio-button>
        </el-radio-group>
      </div>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>
    <div v-loading="loading">
      <RenwuthreeTable v-if="tabsValue==='three'" :tableData="renwuthreeList"/>
      <RenwufourTable v-else-if="tabsValue==='four'" :tableData="renwufourList"/>
      <RenwutwoTable v-else :tableData="renwutwoList" @handleSelectionChange="handleSelectionChange"/>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改renwutwo对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="异本地" prop="ybd">
          <el-input v-model="form.ybd" placeholder="请输入异本地" />
        </el-form-item>
        <el-form-item label="数据开始时间" prop="datastarttime">
          <el-date-picker clearable size="small"
            v-model="form.datastarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择数据开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务批次号" prop="rwpcid">
          <el-input v-model="form.rwpcid" placeholder="请输入任务批次号" />
        </el-form-item>
        <el-form-item label="险种" prop="ybbf">
          <el-input v-model="form.ybbf" placeholder="请输入险种" />
        </el-form-item>
        <el-form-item label="数据结束时间" prop="dataendtime">
          <el-date-picker clearable size="small"
            v-model="form.dataendtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择数据结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="就医类型" prop="jslb">
          <el-input v-model="form.jslb" placeholder="请输入就医类型" />
        </el-form-item>
        <el-form-item label="行政区" prop="xzq">
          <el-input v-model="form.xzq" placeholder="请输入行政区" />
        </el-form-item>
        <el-form-item label="网审意见">
          <el-radio-group v-model="form.wsyj">
            <el-radio
              v-for="dict in wsyjOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="更新时间" prop="uptime">
          <el-date-picker clearable size="small"
            v-model="form.uptime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="网审人员" prop="wsry">
          <el-input v-model="form.wsry" placeholder="请输入网审人员" />
        </el-form-item>
        <el-form-item label="涉及违规数" prop="sjwgs">
          <el-input v-model="form.sjwgs" placeholder="请输入涉及违规数" />
        </el-form-item>
        <el-form-item label="疑点金额" prop="ydje">
          <el-input v-model="form.ydje" placeholder="请输入疑点金额" />
        </el-form-item>
        <el-form-item label="结算金额" prop="jsje">
          <el-input v-model="form.jsje" placeholder="请输入结算金额" />
        </el-form-item>
        <el-form-item label="结算人次" prop="jsrc">
          <el-input v-model="form.jsrc" placeholder="请输入结算人次" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addtime">
          <el-date-picker clearable size="small"
            v-model="form.addtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="信用代码" prop="xydm">
          <el-input v-model="form.xydm" placeholder="请输入信用代码" />
        </el-form-item>
        <el-form-item label="机构代码" prop="jgdm">
          <el-input v-model="form.jgdm" placeholder="请输入机构代码" />
        </el-form-item>
        <el-form-item label="机构名称" prop="jgmc">
          <el-input v-model="form.jgmc" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="结算等级" prop="jsdj">
          <el-input v-model="form.jsdj" placeholder="请输入结算等级" />
        </el-form-item>
        <el-form-item label="网审人员2" prop="wsry2">
          <el-input v-model="form.wsry2" placeholder="请输入网审人员2" />
        </el-form-item>
        <el-form-item label="对象同意或驳回">
          <el-radio-group v-model="form.dxqd">
            <el-radio
              v-for="dict in dxqdOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="流程识别ID">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="检查组ID" prop="jczid">
          <el-input v-model="form.jczid" placeholder="请输入检查组ID" />
        </el-form-item>
        <el-form-item label="是否打印了通知">
          <el-radio-group v-model="form.isdayin">
            <el-radio
              v-for="dict in isdayinOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打印通知书联系人" prop="dayinname">
          <el-input v-model="form.dayinname" placeholder="请输入打印通知书联系人" />
        </el-form-item>
        <el-form-item label="打印通知书联系电话(检查通知书)" prop="dayintel">
          <el-input v-model="form.dayintel" placeholder="请输入打印通知书联系电话(检查通知书)" />
        </el-form-item>
        <el-form-item label="打印日期" prop="dayinriqi">
          <el-date-picker clearable size="small"
            v-model="form.dayinriqi"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择打印日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="打印通知书联系电话(纪律告知书)" prop="dayinphone">
          <el-input v-model="form.dayinphone" placeholder="请输入打印通知书联系电话(纪律告知书)" />
        </el-form-item>
        <el-form-item label="打印中的检查开始日期" prop="dayinstarttime">
          <el-date-picker clearable size="small"
            v-model="form.dayinstarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择打印中的检查开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="形成结果同意或驳回">
          <el-radio-group v-model="form.dcjg">
            <el-radio
              v-for="dict in dcjgOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import { listRenwutwo, getRenwutwo, delRenwutwo, addRenwutwo, updateRenwutwo, exportRenwutwo } from "@/api/renwu/renwutwo"
import { listRenwuthree } from '@/api/renwu/renwuthree'
import { listRenwufour } from '@/api/renwu/renwufour'
import SearchItem from '../common/searchItems'
import RenwutwoTable from '../common/renwutwoTable'
import RenwuthreeTable from '../common/renwuthreeTable'
import RenwufourTable from '../common/renwufourTable'
export default {
  name: "Renwutwo",
  components: {
    SearchItem,
    RenwutwoTable,
    RenwuthreeTable,
    RenwufourTable
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
      // 任务批次号字典
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
      // 涉及违规数字典
      sjwgsOptions: [],
      // 疑点金额字典
      ydjeOptions: [],
      // 结算金额字典
      jsjeOptions: [],
      // 结算人次字典
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
        ybd: null,
        datastarttime: null,
        rwpcid: null,
        ybbf: null,
        dataendtime: null,
        jslb: null,
        xzq: null,
        wsyj: null,
        uptime: null,
        wsry: null,
        sjwgs: null,
        ydje: null,
        jsje: null,
        jsrc: null,
        addtime: null,
        xydm: null,
        jgdm: null,
        jgmc: null,
        jsdj: null,
        wsry2: null,
        dxqd: null,
        status: null,
        jczid: null,
        isdayin: null,
        dayinname: null,
        dayintel: null,
        dayinriqi: null,
        dayinphone: null,
        dayinstarttime: null,
        dcjg: null
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
    this.renwutwoList = [{
        rwpcid:'xxxxxxxx01',
        rwmc:'任务名称001',
        jcfs:'专项检查',
        datastarttime:new Date().getTime(),
        dataendtime:new Date().getTime(),
        jgsl:16,
        rwendtime:new Date().getTime(),
        jslb:'门诊，急诊，住院',
        rwms:'对该批次下所有的任务进行筛查',
        ybd:'异地，本地',
        ybbf:'居保，职保',
        sjje:'50,000.00',
        status:0,
        cbjg:'第三方承办机构',
        uptime:new Date().getTime()
      }]
      this.total = 100
      this.loading = false
    this.getList();
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ybdOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.datastarttimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.rwpcidOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ybbfOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.dataendtimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jslbOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xzqOptions = response.data;
    // });
    // this.getDicts("sys_common_check").then(response => {
    //   this.wsyjOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.uptimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.wsryOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.sjwgsOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ydjeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jsjeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jsrcOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.addtimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xydmOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jgdmOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jgmcOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jsdjOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.wsry2Options = response.data;
    // });
    // this.getDicts("sys_common_yesno").then(response => {
    //   this.dxqdOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.statusOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jczidOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.isdayinOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.dayinnameOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.dayintelOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.dayinriqiOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.dayinphoneOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.dayinstarttimeOptions = response.data;
    // });
    // this.getDicts("sys_common_yesno").then(response => {
    //   this.dcjgOptions = response.data;
    // });
  },
  methods: {
    /** 查询renwutwo列表 */
    async getList(options) {
      const params = options?{...options,...this.queryParams}:this.queryParams
      const { query } = this.$route
      params.rwpcid = query?.rwpcid
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            res = await listRenwuthree(params)
            break;
          case 'four':
            res = await listRenwufour(params)
            break;
          default:
            params.statu = query.status//第二层级 需要加status
            res = await listRenwutwo(params)
            break;
        }
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
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
    /**
     * 规则维度tabsValue=Three
    */
    async getRenwThree(params){
      this.loading = true;
      try {
        const res =  await listRenwutwo(params)
        if(res.code===200){
          this.renwuthreeList = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
    /**
     * 项目维度维度tabsValue=Four
    */
    async getRenwFour(params){
      this.loading = true;
      try {
        const res =  await listRenwutwo(params)
        if(res.code===200){
          this.renwufourList = res.rows;
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
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ybd: null,
        datastarttime: null,
        rwpcid: null,
        ybbf: null,
        dataendtime: null,
        jslb: null,
        xzq: null,
        wsyj: "0",
        uptime: null,
        wsry: null,
        sjwgs: null,
        ydje: null,
        jsje: null,
        jsrc: null,
        addtime: null,
        xydm: null,
        jgdm: null,
        jgmc: null,
        jsdj: null,
        wsry2: null,
        dxqd: "0",
        status: "0",
        jczid: null,
        isdayin: "0",
        dayinname: null,
        dayintel: null,
        dayinriqi: null,
        dayinphone: null,
        dayinstarttime: null,
        dcjg: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery(query) {
      this.queryParams.pageNum = 1;
      this.getList(query);
    },
    /** 重置按钮操作 */
    // resetQuery() {
    //   this.resetForm("queryForm");
    //   this.handleQuery();
    // },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      const hasuncheck = selection.filter(item => {
        return (item.sancha && item.sancha*1 === 1)
      });
      //第三方查询状态sancha 1已查 0未查
      this.hasThirdUncheck = hasuncheck && hasuncheck.length>0
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加renwutwo";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ybd = row.id || this.ids
      getRenwutwo(ybd).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwutwo";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenwutwo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwutwo(this.form).then(response => {
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
      const ybds = row.id || this.ids;
      this.$confirm('是否确认删除renwutwo编号为"' + ybds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwutwo(ybds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwutwo数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwutwo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    },
    /**
     * 实施网申
     */
    handleNetCheck(){
      if(!this.ids.length){
        this.msgWarning('请至少选择一项')
      } else if(this.hasThirdUncheck){
        this.$confirm('当前医药机构任务未实施第三方筛查，请确认不进行第三方筛查直接实施网审/现场检查?', "确认提交", {
          confirmButtonText: "确认",
          cancelButtonText: "返回",
          type: "warning"
        }).then(() => {
          //点确认执行
          //return exportRenwutwo(queryParams);
        }).then(() => {
            //执行完成提升成功
        })
      }
      //检查任务中有未执行第三方筛查的

    },
    /**
     * 第三方筛查
     */
    handleThirdCheck(){

    },
    /**
     * tabs切换
     */
    tabsLevelChange(val){
      this.queryParams.pageNum = 1
      this.getList()
      console.log(val)
    }
  }
};
</script>
<style lang="scss" scoped>
.tabs-part {
  clear: both;
  
  
}
</style>