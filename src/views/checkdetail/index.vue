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
    <el-form v-if="tabsValue==='two'" size="small" :model="submitParams" :rules="rules" ref="submitForm" :inline="true" style="margin-top:30px;">
      <el-form-item label="已选机构" prop="yxjg">
        <el-input
          style="width:280px;margin-right:30px"
          disabled
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="submitParams.yxjg">
        </el-input>
      </el-form-item>
      <el-form-item label="网审意见" prop="wsyj">
        <el-select v-model="submitParams.wsyj" placeholder="请选择" clearable  style="width: 180px">
          <el-option
            key="1"
            label="建议检查"
            value="建议检查"
          />
          <el-option
            key="2"
            label="建议检查"
            value="暂不检查"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检查人员" prop="wsry">
       <el-input readonly :value="submitParams.wsry"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="handleNetCheck" :disabled="ids.length<1">提交</el-button>
      </el-form-item>
    </el-form>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { listRenwutwo, getRenwutwo, delRenwutwo, addRenwutwo, updateRenwutwo, exportRenwutwo,submitNetCheck} from "@/api/renwu/renwutwo"
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
      submitParams:{
        yxjg:'',
        wsry:'',
        wsyj:''
      },
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
      noThirdCheckList:false
    };
  },
  created() {
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
            params.status = query.status//第二层级 需要加status
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
      delete query.status
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
      const jgmc = selection.map(item => item.jgmc)
      this.submitParams.wsry = this.$store.getters.name
      this.submitParams.yxjg = jgmc.join(',')
      
      //第三方查询状态sancha 1已查 0未查
      this.noThirdCheckList  = selection.filter(item => {
        return item.sancha === 0
      });
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
        this.msgError('请至少选择一项')
      } else if(!this.submitParams.wsyj){
        this.msgError('请选择网审意见')
      } else if(this.noThirdCheckList.length){
        this.$confirm('当前医药机构任务未实施第三方筛查，请确认不进行第三方筛查直接实施网审/现场检查?', "确认提交", {
          confirmButtonText: "确认",
          cancelButtonText: "返回",
          type: "warning"
        }).then(() => {
          //点确认执行
          return submitNetCheck({ids:this.ids,wsry:this.submitParams.wsry,wsyj:this.submitParams.wsyj});
        }).then(() => {
            //执行完成提升成功
            this.msgSuccess('提交成功')
            this.getList()
        })
      }
      //检查任务中有未执行第三方筛查的

    },
    /**
     * 第三方筛查
     */
    handleThirdCheck(){
      this.$router.push({
        path:'/thirdcheck/thirdcheck'
      })
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