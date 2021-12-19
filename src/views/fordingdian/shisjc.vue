<template>
  <div class="app-container" style="height:100%" v-loading="pageLoaing">
    <section>
      <el-row :gutter="10">
        
        <el-col :span="1.5" v-if="tabsValue==='three'">
          <span style="color:#606266;font-size:14px">参保地：</span>
          <el-select v-model="gzQueryForm.ybd" size="small" @change="getList()">
            <el-option label="本地" value="01"></el-option>
            <el-option label="异地" value="02"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="setyy('1')">有异议</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="setyy('2')">无异议</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="showCheckForm">查询条件</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='six'">
          <el-button type="primary" plain size="small" @click="showHecha=true">选择核查数据</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='six'">
          <label style="font-size:12px;color:#606266;padding-right:6px;margin-left:10px">盘库时间</label>
          <el-date-picker
          v-model="pksj"
          align="right"
          type="daterange"
          size="small"
          start-placeholder="盘库期初时间"
          end-placeholder="盘库期末时间"
         >
        </el-date-picker>
        </el-col>
        <el-radio-group v-model="tabsValue" v-if="tabsValue=='three'||tabsValue=='six'"  size="small" class="top-right-btn" @change="tabsLevelChange1">
          <el-radio-button label="three">规则筛查</el-radio-button>
          <el-radio-button label="six">进销存核查</el-radio-button>
        </el-radio-group>
      </el-row>
      <div class="table-main"  v-loading="loading" v-if="tabsValue!=='four'&&tabsValue!=='six'">
        <sTable v-if="tabsValue=='three'" :data="renwuthreeList" :header="tableHeader" :fixedNum="2" :checkAll="false"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" slot="fixed"/>
            <el-table-column label="序号" width="55" type="index" align="center" slot="fixed"/>
        </sTable>
      </div>
      <div v-loading="loading" v-else>
        <jinxiaohecha v-if="tabsValue=='six'" :tableData="renwusixList" @on-change="handleSelectionChange" @on-log="checkLog" @update="getList"/>
      </div>
      <pagination
        class="fixed-bottom"
        v-show="!logShow&&!qmxOptions.show"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div class="xingweirz">
        <div class="yy-content">
          <span>异议内容</span>
          <el-input rows="3" type="textarea" v-model="yynr"></el-input>
        </div>
        <div>
          <div style="margin-bottom:8px"><span>上传相关资料（格式：jpg、png、pdf、doc、docx、xls、xlsx，单个文件不超过10M）</span></div>
          <div>
            <fileUpload
              v-model="wenjian.wenjianurl"
              :fileSize="10"
              :fileType='["jpg","jpeg","png","pdf","doc","docs","xls","xlsx"]'
              :isShowTip="false"
              :needHide="true"
              :hideFileList="false"
              :buttonOPtions="{size:'mini',text:'选择文件'}"
              @input="upSuccess"
              ref="fileUpload"
            />
          </div>
        </div>
        <div><el-button type="primary" size="mini" @click="handleSubmit">保存</el-button></div>
      </div>
      <hechashuju v-if="showHecha" :isShow="showHecha" @onClose="showHecha=false" @update="getList"/>
    </section>
     <!-- 查询条件 -->
    <el-dialog title="查询条件" class="check-dialog" :visible.sync="chaxunDialog" width="800px" >
      <el-form ref="chaxunForm" :model="gzQueryForm" :rules="rules" label-width="118px" size="small">
        <div class="form-group" v-if="tabsValue==='three'">
          <el-form-item label="规则分类" prop="gzfl">
            <el-select v-model="gzQueryForm.gzfl">
              <el-option
                v-for="item in gzflOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规则名称" prop="gzmc">
              <el-input clearable v-model="gzQueryForm.gzmc"></el-input>
          </el-form-item>
          <el-form-item label="涉及结算人次数" prop="xjjzrs">
            <div class="item-group">
              <el-input type="number" min="0"  v-model="gzQueryForm.xjjzrs"></el-input>
              <span>-</span>
              <el-input type="number" min="0"  v-model="gzQueryForm.sjrcs"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="涉及项目数" prop="xjmxs" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="gzQueryForm.xjmxs"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="gzQueryForm.bz"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="涉及金额" prop="xjje" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="gzQueryForm.xjje"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="gzQueryForm.ydsm"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="结算总费用" prop="jsfy" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="gzQueryForm.jsfy"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="gzQueryForm.jsdj"></el-input>
            </div>
          </el-form-item>
        </div>
        <div class="form-group"  v-if="tabsValue==='six'">
          <el-form-item label="明细项目编号" prop="mxxmbm">
            <xmbm @onChecked="mxxmbmChecked" ref="mxxmbmPopo"/>
          </el-form-item>
          <el-form-item label="明细项目名称" prop="mxxmmc">
              <el-input clearable v-model="bmQueryForm.mxxmmc"></el-input>
          </el-form-item>
          <el-form-item label="明细项目数量" prop="mxxmsl">
            <div class="item-group">
              <el-input type="number" v-model="bmQueryForm.mxxmsl"></el-input>
              <span>-</span>
              <el-input type="number" v-model="bmQueryForm.wgsl"></el-input>
            </div>
          </el-form-item>
          <el-form-item class="long-label" label="明细项目医保结算范围费用" prop="mxxmbjsfy" >
            <div class="item-group">
              <el-input type="number" v-model="bmQueryForm.mxxmbjsfy"></el-input>
              <span>-</span>
              <el-input type="number" v-model="bmQueryForm.mxxmjyfy"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="明细项目单价" prop="mxxmdj" >
            <div class="item-group">
              <el-input type="number" v-model="bmQueryForm.mxxmdj"></el-input>
              <span>-</span>
              <el-input type="number" v-model="bmQueryForm.mxxmje"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="行为认定" prop="xwrd" >
              <el-select clearable v-model="bmQueryForm.xwrd">
                <el-option label="全部" value=""></el-option>
                <el-option label="未认定" value="1"></el-option>
                <el-option label="已认定" value="2"></el-option>
                <el-option label="疑点标记" value="3"></el-option>
              </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getList()" size="small">确 定</el-button>
        <el-button @click="resetCheckForm" size="small">重置</el-button>
      </div>
    </el-dialog>
    <guizeshuom :options="guizeOptions"></guizeshuom>
    <operate-log v-if="logOption.show" :options="logOption"></operate-log>
  </div>
</template>

<script>
import { listRenwuthree,updateRenwuthree} from "@/api/renwu/renwuthree";
import {setYynr} from  '@/api/renwu/renwutwo'
import { listRenwufour, updateRenwufour } from '@/api/renwu/renwufour'
import { addDcqz} from "@/api/renwu/dcqz"
import Guizeshuom from '../checkup/jianchass/guizeshuom.vue'
import operateLog from '../checkup/jianchass/operateLog.vue'
import Jinxiaohecha from './jinxiaohecha.vue'
import Hechashuju from '../checkup/jianchass/hechashuju.vue'
import xmbm from '../checkup/jianchass/xmbm.vue'
import FileUpload from '@/components/FileUpload';
import { getToken } from '@/utils/auth'
export default {
  name: "Shisjc",
  components: {
    Guizeshuom,
    operateLog,
    Jinxiaohecha,
    Hechashuju,
    xmbm,
    FileUpload
  },
  data() {
    return {
      pageLoaing:true,
      wenjian:{
        wenjianurl:'',
        wenjian:''
      },
      showHecha:false,//显示选择核查数据
      tableHeader:[{
        prop: 'ydlx',
        label: '疑点类型',
        hide: true
      },{
        prop: 'ydsm',
        label: '疑点说明',
        hide: true
      },{
        prop: 'xwrd',
        label: '认定行为',
      },{
        prop: 'wgsl',
        label: '违规人次数',
        width:'auto' 
      },{
        prop: 'wgfy',
        label: '违规费用(元)',
        width: 'auto',
        viewFun: (wgfy)=>{
          return this.formatMoney(wgfy,2)
        }
      },{
        prop: 'gzfl',
        label: '规则分类',
        align: 'left',
        fixedWidth:80
      },{
        prop: 'gzmc',
        label: '规则名称',
        align: 'left',
        fixedWidth:80
      },{
        prop: 'xjjzrs',
        label: '涉及就诊人员数',
        hide:true
      },{
        prop: 'sjrcs',
        label: '结算人次数',
      },{
        prop: 'xjmxs',
        label: '涉及项目数',
      },{
        prop: 'jsfy',
        label: '疑点费用(元)',
        viewFun: (jsfy)=>{
          return this.formatMoney(jsfy,2)
        }
      },{
        prop: 'yy',
        label: '有无异议',
        viewFun:function(yy){
          return (yy?(yy==0?'未反馈':yy==1?'有异议':yy==2?'无异议':''):'')
        },
      }],
      qmxOptions:{
        show:false,
        query:{}
      },
      logShow:false,//操作记录
      heshiOption:{
        show:false
      },
      isDisabled:{
        dj:true,
        sl:false,
        fy:false
      },
      xwrdDialog:{
        show:false
      },
      yynr:'',
      xwrdForm:{
        mxxmmc:'',
        xwrd:'',
        bz:'',
        zkdj:'',
        wgsl:'',
        wgfy:'',
        qckc:'',
        bqgr:'',
        xjxs:'',
        qmkc:'',
        ybjs:''
      },
      //选中的违规行为对象
      xwrdChecd:{},
      xwRules:{
        xwrd:[{required:true,message:'必填项'}],
        zkdj:[{required:true,message:'必填项'}],
        wgsl:[{required:true,message:'必填项'}],
        wgfy:[{required:true,message:'必填项'}],
        qckc:[{required:true,message:'必填项'}],
        bqgr:[{required:true,message:'必填项'}],
        xjxs:[{required:true,message:'必填项'}],
        qmkc:[{required:true,message:'必填项'}],
        ybjs:[{required:true,message:'必填项'}]
      },
      guizeOptions:{
        show:false
      },
      chaxunDialog:false,
      isAll:false,
      liushuiSetions:[],
      selectedId:"",
      selectionList:[],
      // 遮罩层
      loading: true,
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
      // renwuthree表格数据
      renwuthreeList: [],
      renwufourList:[],
      renwufiveList:[],
      renwusixList:[],
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      bmQueryForm:{
        mxxmbm:'',
        mxxmmc:'',
        mxxmsl:'',
        wgsl:'',
        mxxmbjsfy:'',
        mxxmjyfy:'',
        mxxmdj:'',
        mxxmje:'',
        xwrd:''
      },
      gzQueryForm:{
        gzfl:'',
        gzmc:'',
        xjjzrs:'',
        sjrcs:'',
        xjmxs:'',
        bz:'',
        xjje:'',
        ydsm:'',
        jsfy:'',
        jsdj:'',
        ybd:''
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "序号不能为空", trigger: "blur" }
        ],
      },
      //默认只有一个规则筛查tab(第三层)
      tabsValue:'three',
      //上页带过来的数据
      queryInfoFrom:{},
      searchLsNextParams:{},
      searchTlsNextParams:{},
      logOption:{
        show:false,
        xwrd:'',
        type:''
      },
      lsh:'',//第四层的参数，查询同流水号明细需要用到
      mxxmbm:'',//第四层的参数，查询同流水号明细需要用到
      pksj:'', //盘库时间
      gzflOptions:[],
    }
  },
  created() {
    this.queryInfoFrom = this.$route.query

    if(getToken()){
      this.pageLoaing = false;
      this.getList();
    }
  },
  methods: {
    setyy(yy){
      if(!this.ids.length){
        this.msgError('请至少选择一项')
        return
      }
      let api = this.tabsValue==='three'?updateRenwuthree:updateRenwufour
      let responseCount = 0
      this.loading = true
      this.ids.forEach(async id=>{
        try {
          await api({id,yy})
          responseCount++
          if(responseCount===this.ids.length){
            this.getList()
          }
        } catch (error) {
          this.loading = false
          responseCount++
        }
      })
    },
    handleSubmit(){
      if(!this.yynr){
        this.msgError('请输入异议内容')
        return
      }
      setYynr({
        ...this.queryInfoFrom,
        yynr:this.yynr
      }).then(res=>{
        if(res.code===200){
          this.msgSuccess('操作成功')
          this.yynr = ''
        }
      })
      if(this.wenjian.wenjianurl){
        this.submitFileInfo()
      }
    },
    submitFileInfo(){
      const {wenjian,wenjianurl} = this.wenjian
      addDcqz({
        type:6,//文件资料type:6
        rwpcid:this.queryInfoFrom.rwpcid,
        jgdm:this.queryInfoFrom.jgdm,
        upman:this.$store.getters.name,
        addtime: this.parseTime(new Date().getTime()),
        wenjian,
        wenjianurl,
      }).then(res=>{
        if(res.code===200) {
          this.wenjian.wenjian = ''
          this.wenjian.wenjianurl = ''
        }
      })
    },
    mxxmbmChecked(val){
      this.bmQueryForm.mxxmbm = val
    },
    resetCheckForm(){
      this.bmQueryForm = {
        mxxmbm:'',
        mxxmmc:'',
        mxxmsl:'',
        wgsl:'',
        mxxmbjsfy:'',
        mxxmjyfy:'',
        mxxmdj:'',
        mxxmje:'',
        xwrd:''
      }
      this.gzQueryForm = {
        gzfl:'',
        gzmc:'',
        xjjzrs:'',
        sjrcs:'',
        xjmxs:'',
        bz:'',
        xjje:'',
        ydsm:'',
        jsfy:'',
        jsdj:'',
        ybd:''
      }
      this.$refs['chaxunForm'].resetFields()
      this.$refs.mxxmbmPopo && (this.$refs.mxxmbmPopo.clear())
    },
    showCheckForm(){
      this.chaxunDialog = true
      if(this.tabsValue==='three'){
        this.gzflOptions.length===0 && (this.remoteGzflMethod())
      }
    },
    async remoteGzflMethod(){
      try {
        const res = await this.getDicts('sys_renwu_gzfl')
        if(res.code==200){
          this.gzflOptions = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    //规则筛查，进销存核查切换
    tabsLevelChange1(val){
      this.ids = []
      this.getList()
    },
    //选择行为回调
    onChecked(res){
      this.xwrdChecd = res
      this.xwrdForm.xwrd = res.wgxw
    },
    getGuizList(){
      console.log(this.guizefl)
    },
    /**
     * 规则选择
    */
    handleGuizeChange(selection){
      this.guizefl.selection = selection
    },
    /**
     * 
     * 查看流水号项目汇总
    */
    fluProject(row){
      this.$set(this,'tabsValue','four')
      this.searchLsNextParams = {rwpcid:row.rwpcid,jgdm:row.jgdm,gzmc:row.gzmc,type:1}
      this.getList(this.searchLsNextParams)
    },
    /** 查询renwu列表 */
    async getList(query) {
      const {rwpcid,jgdm} = this.queryInfoFrom
      let params = {...this.queryParams,rwpcid,jgdm, hszt:'3'}
      if(query){
        params = {...params,...query}
      }
      this.loading = true
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            res = await listRenwuthree({...params,...this.gzQueryForm})
            break;
          case 'six':
            params.type=2
            params.ischeck=1
            res = await listRenwufour({...params,...this.bmQueryForm})
            break;
          default:
            // params.statu = 2 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
            // res = await listRenwutwo(params)
            break;
        }
        if(res.code===200){
          if(this.tabsValue=='qmx'){
            this[`renwufiveList`] = res.rows;
          } else {
            this[`renwu${this.tabsValue}List`] = res.rows;
          }
          this.total = res.total;
          if(this.chaxunDialog){
            this.resetCheckForm()
            this.chaxunDialog = false
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },

    // 序号字典翻译
    idFormat(row, column) {
      return this.selectDictLabels(this.idOptions, row.id);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabels(this.jgdmOptions, row.jgdm);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabels(this.jgmcOptions, row.jgmc);
    },
    // 规则分类字典翻译
    gzflFormat(row, column) {
      return this.selectDictLabels(this.gzflOptions, row.gzfl);
    },
    // 规则名称字典翻译
    gzmcFormat(row, column) {
      return this.selectDictLabels(this.gzmcOptions, row.gzmc);
    },
    // 涉及就诊人员数字典翻译
    xjjzrsFormat(row, column) {
      return this.selectDictLabels(this.xjjzrsOptions, row.xjjzrs);
    },
    // 涉及明细数字典翻译
    xjmxsFormat(row, column) {
      return this.selectDictLabels(this.xjmxsOptions, row.xjmxs);
    },
    // 疑点金额字典翻译
    xjjeFormat(row, column) {
      return this.selectDictLabels(this.ydjeOptions, row.ydje);
    },
    // 医保结算费用字典翻译
    jsfyFormat(row, column) {
      return this.selectDictLabels(this.jsfyOptions, row.jsfy);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 异本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabels(this.ybdOptions, row.ybd);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabels(this.datastarttimeOptions, row.datastarttime);
    },
    // 信用代码字典翻译
    xydmFormat(row, column) {
      return this.selectDictLabels(this.xydmOptions, row.xydm);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabels(this.addtimeOptions, row.addtime);
    },
    // 结算等级字典翻译
    jsdjFormat(row, column) {
      return this.selectDictLabels(this.jsdjOptions, row.jsdj);
    },
    // 机构核实意见字典翻译
    hsyjFormat(row, column) {
      return this.selectDictLabels(this.hsyjOptions, row.hsyj);
    },
    // 核实时间字典翻译
    hssjFormat(row, column) {
      return this.selectDictLabels(this.hssjOptions, row.hssj);
    },
    // 核实人字典翻译
    hsrFormat(row, column) {
      return this.selectDictLabels(this.hsrOptions, row.hsr);
    },
    // 核实派发时间字典翻译
    hspfsjFormat(row, column) {
      return this.selectDictLabels(this.hspfsjOptions, row.hspfsj);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabels(this.rwpcidOptions, row.rwpcid);
    },
    // 已发送回智审字典翻译
    issendFormat(row, column) {
      return this.selectDictLabels(this.issendOptions, row.issend);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("bmQueryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      if(selection.length!==0){
        this.ids = selection.map(item => item.id)
      } else {
        this.ids=[]
      }
    },
    //同流水明细
    tongLiushuimx(row){
      this.tabsValue = 'five'
      this.selectedId = ''
      this.lsh = row.lsh || ''
      this.mxxmbm = row.mxxmbm || ''
      this.searchTlsNextParams = {lsh:row.lsh||'',mxxmbm:row.mxxmbm}
      this.getList()
    },
    //操作记录
    checkLog(row,type){
      this.logOption.type = type
      this.logOption.rwpcid = row.rwpcid
      this.logOption.fid = row.fid
      this.logOption.xwrd = row.xwrd
      this.logOption.show = true
    },
    sum(arr){
      let s = 0
      arr.forEach(item=>{
        item && (s+=item)
      })
      return s
    },
    //判断是否可以修改单价，数量，费用
    isDisabledEvent(sellection){
      let dj = true//单价
      let sl = false//数量
      let fy = false//费用
      if(sellection.length<1){
        dj = true
        sl = false
        fy = false
      } else {
        const mxxmbm = []
        const mxxmdj = []
        sellection.forEach(item => {
          if(!(mxxmbm.includes(item.mxxmbm))) {
            mxxmbm.push(item.mxxmbm)
          } 
          if(!(mxxmdj.includes(item.mxxmdj))) {
            mxxmdj.push(item.mxxmdj)
          }
        });
        if(mxxmbm.length===1){//项目明细编号相同,
          sl = false
          dj = mxxmdj.length>1?true:false
          fy = false
        }else{
          sl = true
          fy = true
          dj = true
        }
      }
     return {dj,sl,fy}
    },
    handleDjslChange(){
      if(this.xwrdForm.zkdj!==''&&this.xwrdForm.wgsl!==''){
        this.xwrdForm.wgfy = (this.xwrdForm.zkdj*this.xwrdForm.wgsl).toFixed(2)
      }
    },
    hanndelChange(){
      const res = this.cesl()
      if(res!==''){
        this.xwrdForm.wgsl = res
        this.handleDjslChange()
      }
    },
    cesl(){
      //进销存核查，计算违规数量=差额数量cesl=医保结算数量-(期初库存数量+本期购入数据-期末库存数量-现金销售数量)
      let res = ''
      const {ybjs,qckc,bqgr,qmkc,xjxs} = this.xwrdForm
      if(ybjs!=='' && qckc!==''&& bqgr!==''&& qmkc!==''&& xjxs!==''){
        res = ybjs*1-(qckc*1+bqgr*1-qmkc*1-xjxs*1)
      }
      return res
    },
    upSuccess(fileUrl,file){
      if(fileUrl) {
        this.wenjian.wenjian = file.name
      } else {
        this.wenjian.wenjian = ''
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:60px;
  bottom:150px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:115px;
  left: 0px;
}
.xingweirz {
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: 15px;
  font-size: 14px;
  color: #606266;
  >div {
    float: left;
    margin-right: 20px;
    position: relative;
    &::v-deep .el-upload-list {
      position: absolute !important;
      width: 100%;
      top:15px;
    }
  }
  .yy-content {
    display: flex;
    width: 450px;
    span {
      width:80px;
    }
  }
}
.check-dialog {
  &::v-deep .el-dialog__body {
    padding:30px 20px 5px;
  }
  &::v-deep .el-dialog__footer {
    text-align: center;
  }
  .form-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-select {
      width: 100%;
    }
    .el-form-item {
      width: 48%;
      display: block;
    }
    .long-label {
      &::v-deep .el-form-item__label {
        line-height: normal;
        font-size: 12px;
      }
    }
  }
  .item-group {
    width: 100%;
    display: flex;
  }
}
</style>