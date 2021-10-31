<template>
  <div class="app-container">
    <SearchItem @handleQuery="handleQuery" style="height:94px;margin-bottom:10px"/>
    <!-- <div class="tabs-part">
      <div class="left-btn"></div>
      <div class="tabs"></div>
    </div> -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="tabsValue==='two'">
        <el-button
          type="primary"
          size="small"
          @click="handleAgree(2)"
        >同意</el-button>
      </el-col>
      <el-col :span="1.5" v-if="tabsValue==='two'">
        <el-button
          type="primary"
          size="small"
          plain
          @click="handleAgree(0)"
        >驳回</el-button>
      </el-col>
      <el-col :span="1.5" v-if="mxShow">
        <el-button
          type="warning"
          size="small"
          plain
          @click="mxShow=false,xgmxOptions.show=false,qmxOptions.show=false"
        >返回上一层</el-button>
      </el-col>
      <div class="top-right-btn">
        <el-radio-group v-model="tabsValue" size="small" @change="tabsLevelChange">
          <el-radio-button label="two">任务列表</el-radio-button>
          <el-radio-button label="three">任务列表-规则列表</el-radio-button>
          <el-radio-button label="four">规则筛查-项目汇总</el-radio-button>
        </el-radio-group>
      </div>
    </el-row>
    <div v-loading="loading" v-show="!mxShow" class="table-main">
      <RenwuthreeTable v-if="tabsValue==='three'" :tableData="renwuthreeList"  @check-xgmx="checkMix($event,'xgmx')"/>
      <RenwufourTable v-else-if="tabsValue==='four'" :tableData="renwufourList" @check-xgmx="checkMix($event,'xgmx')"/>
      <RenwutwoTable v-else :tableData="renwutwoList" @check-xgmx="checkMix($event,'xgmx')"  @check-qmx="checkMix($event,'qmx')" @handleSelectionChange="handleSelectionChange"/>
    </div>
    <pagination
     class="fixed-bottom"
      v-show="!mxShow"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div class="table-main" v-show="mxShow">
      <checkmx :options="xgmxOptions" v-if="xgmxOptions.show"/>
      <quanmingxi :options="qmxOptions" v-if="qmxOptions.show" />
    </div>
  </div>
</template>
<script>
import { listRenwutwo, getRenwutwo, delRenwutwo, addRenwutwo, updateRenwutwo, exportRenwutwo} from "@/api/renwu/renwutwo"
import { submitDxqd} from "@/api/renwu/dcqz"
import { listRenwuthreeRj } from '@/api/renwu/renwuthree'
import { listRenwufourRj } from '@/api/renwu/renwufour'
import SearchItem from '../../common/objSearchItem'
import RenwutwoTable from './tables/renwutwoTable'
import RenwuthreeTable from './tables/renwuthreeTable'
import RenwufourTable from './tables/renwufourTable'
import Checkmx from '../checkmx.vue'
import Quanmingxi from '../../common/quanmingxi.vue'

export default {
  name: "Duixqd",
  components: {
    SearchItem,
    RenwutwoTable,
    RenwuthreeTable,
    RenwufourTable,
    Checkmx,
    Quanmingxi
  },
  data() {
    return {
      xgmxOptions:{
        show:false,
        query:{}
      },
      qmxOptions:{
        show:false,
        query:{}
      },
      mxShow:false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      selectionList:[],
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //
      tabsValue:'two',
      resql:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    checkMix(row,key){
      const keyw = `${key}Options`
      if(key==='xgmx'){
        const query = {
          pch:row.rwpcid,
          jgdm:row.jgdm
        }
        if(this.tabsValue==="three"){
          query.gzmc2 = row.gzmc
          query.gzmc = row.gzmc
        } else if(this.tabsValue==="four"){
          query.gzmc = row.gzmc
          query.mxxmmc = row.mxxmmc
          query.mxxmbm = row.mxxmbm
          query.mxxmdj = row.mxxmdj
        }
        this[keyw].query = query
      } else {
        this[keyw].query = {
          jgdm:row.jgdm,
          zdbm:this.parseTime(row.datastarttime, '{y}{m}'),
          zdbm1:this.parseTime(row.dataendtime, '{y}{m}'),
        }
      }
      this[keyw].show = true
      this.mxShow = true

    },
    /** 查询renwutwo列表 */
    async getList(query) {
      const params = query?{...this.queryParams,...query}:this.queryParams
      this.loading = true
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            res = await listRenwuthreeRj(params)
            break;
          case 'four':
            res = await listRenwufourRj({type:1,...params})
            break;
          default:
            params.status = 1 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
            res = await listRenwutwo(params)
            break;
        }
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows;
          this.total = res.total;
          if(this.tabsValue==='two'){
            this.resql = res.resql
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 异本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabels(this.ybdOptions, row.ybd);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabels(this.datastarttimeOptions, row.datastarttime);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabels(this.rwpcidOptions, row.rwpcid);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 数据结束时间字典翻译
    dataendtimeFormat(row, column) {
      return this.selectDictLabels(this.dataendtimeOptions, row.dataendtime);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 网审意见字典翻译
    wsyjFormat(row, column) {
      return this.selectDictLabels(this.wsyjOptions, row.wsyj);
    },
    // 更新时间字典翻译
    uptimeFormat(row, column) {
      return this.selectDictLabels(this.uptimeOptions, row.uptime);
    },
    // 网审人员字典翻译
    wsryFormat(row, column) {
      return this.selectDictLabels(this.wsryOptions, row.wsry);
    },
    // 涉及规则数字典翻译
    sjwgsFormat(row, column) {
      return this.selectDictLabels(this.sjwgsOptions, row.sjwgs);
    },
    // 疑点金额字典翻译
    ydjeFormat(row, column) {
      return this.selectDictLabels(this.ydjeOptions, row.ydje);
    },
    // 结算金额字典翻译
    jsjeFormat(row, column) {
      return this.selectDictLabels(this.jsjeOptions, row.jsje);
    },
    // 涉及就诊人次字典翻译
    jsrcFormat(row, column) {
      return this.selectDictLabels(this.jsrcOptions, row.jsrc);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabels(this.addtimeOptions, row.addtime);
    },
    // 信用代码字典翻译
    xydmFormat(row, column) {
      return this.selectDictLabels(this.xydmOptions, row.xydm);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabels(this.jgdmOptions, row.jgdm);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabels(this.jgmcOptions, row.jgmc);
    },
    // 结算等级字典翻译
    jsdjFormat(row, column) {
      return this.selectDictLabels(this.jsdjOptions, row.jsdj);
    },
    // 网审人员2字典翻译
    wsry2Format(row, column) {
      return this.selectDictLabels(this.wsry2Options, row.wsry2);
    },
    // 对象同意或驳回字典翻译
    dxqdFormat(row, column) {
      return this.selectDictLabels(this.dxqdOptions, row.dxqd);
    },
    // 流程识别ID字典翻译
    statusFormat(row, column) {
      return this.selectDictLabels(this.statusOptions, row.status);
    },
    // 检查组ID字典翻译
    jczidFormat(row, column) {
      return this.selectDictLabels(this.jczidOptions, row.jczid);
    },
    // 是否打印了通知字典翻译
    isdayinFormat(row, column) {
      return this.selectDictLabels(this.isdayinOptions, row.isdayin);
    },
    // 打印通知书联系人字典翻译
    dayinnameFormat(row, column) {
      return this.selectDictLabels(this.dayinnameOptions, row.dayinname);
    },
    // 打印通知书联系电话(检查通知书)字典翻译
    dayintelFormat(row, column) {
      return this.selectDictLabels(this.dayintelOptions, row.dayintel);
    },
    // 打印日期字典翻译
    dayinriqiFormat(row, column) {
      return this.selectDictLabels(this.dayinriqiOptions, row.dayinriqi);
    },
    // 打印通知书联系电话(纪律告知书)字典翻译
    dayinphoneFormat(row, column) {
      return this.selectDictLabels(this.dayinphoneOptions, row.dayinphone);
    },
    // 打印中的检查开始日期字典翻译
    dayinstarttimeFormat(row, column) {
      return this.selectDictLabels(this.dayinstarttimeOptions, row.dayinstarttime);
    },
    // 形成结果同意或驳回字典翻译
    dcjgFormat(row, column) {
      return this.selectDictLabels(this.dcjgOptions, row.dcjg);
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
      this.selectionList = selection
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
     * 实施网申 type:2同意 0驳回
     */
    handleAgree(type){
      if(!this.ids.length){
        this.msgError('请至少选择一项')
        return
      } 
      if(type===2){
        this.doSubmit({
          ids:this.ids,
          status:2,//同意2 ，驳回0
          dxqd:'同意',
          dxqdbh:''//驳回意见字段
        })
      } else {
        this.handleNg()
      }
      
      //检查任务中有未执行第三方筛查的

    },
    /**
     * 第三方筛查
     */
    handleNg(){
      const self = this
      this.$prompt('驳回意见', '驳回意见填写', {
          inputType:'textarea',
          confirmButtonText: '确定',
          cancelButtonText: '返回',
        }).then(({ value }) => {
          self.doSubmit({
            ids:this.ids,
            status:0,//同意2 ，驳回0
            dxqd:'驳回',
            dxqdbh:value//驳回意见字段
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    doSubmit(params){
      submitDxqd(params).then(res=>{
        this.msgSuccess("操作成功")
        this.getList()
        this.selectionList.forEach(item=>{
            this.addJcfl({
              jglc:'对象确定',
              gjxx:`对象确定 ${params.status?'同意':'驳回'}：批号为${item.rwpcid}机构代码为${item.jgdm}`,
              rwpcid:item.rwpcid,
              jgdm:item.jgdm,
              zhczr:this.$store.getters.name,
              sort:4
            })
        })
      })
    },
    /**
     * tabs切换
     */
    tabsLevelChange(val){
      this.queryParams.pageNum = 1
      this.total = 0
      this.mxShow = false
      this.qmxOptions.show=false
      this.xgmxOptions.show=false
      if(val!=='two'){
        if(this.ids.length) {
          const resql = []
          this.selectionList.forEach(item=>{
            resql.push(`(rwpcid='${item.rwpcid}' and jgdm='${item.jgdm}')`)
          })
          this.getList({resql:resql.join(' or ')})
        } else {
          if(this.resql){
            this.getList({resql:this.resql})
          }
        }
      } else {
        this.ids = []
      }
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
  top:165px;
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