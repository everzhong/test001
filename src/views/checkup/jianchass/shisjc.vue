<template>
  <div class="app-container container_1">
    <section v-show="!heshiOption.show" >
      <div ref="containerTop">
        <div class="container-top" v-show="showShearch">
          <el-form  size="small" label-width="80px" class="top-search1" ref="bmQueryForm" :inline="true">
                <el-form-item label="案件来源" prop="ajly">
                  <el-input readonly :value="selectDictLabels($store.getters.ajlyDic, queryInfoFrom.ajly)"></el-input>
                </el-form-item>
                <el-form-item label="险种" prop="ybbf">
                  <el-input readonly :value="selectDictLabels($store.getters.ybbfDic, queryInfoFrom.ybbf)"></el-input>
                </el-form-item>
                <el-form-item label="就医类型" prop="jslb">
                  <el-input readonly :value="selectDictLabels($store.getters.jslbDic, queryInfoFrom.jslb)"></el-input>
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
                  <el-form-item label="承办机构" prop="jcjg">
                  <el-input readonly v-model="queryInfoFrom.jcjg"></el-input>
                </el-form-item>
                  <el-form-item label="检查组" prop="jczname">
                  <el-input readonly v-model="queryInfoFrom.jczname"></el-input>
                </el-form-item>
                <div style="position:absolute;right:20px;top:-72px;background-color:#fff" v-if="!queryInfoFrom.fromLuli">
                  <el-button type="primary" size="mini" @click="heshiOption.show=true" >机构核实</el-button>
                  <el-button type="primary" size="mini" @click="doSubmit">检查完成</el-button>
                  <!-- <el-button type="primary"  style="margin-left:50px" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button> -->
                </div>
                <!-- <div style="position:absolute;right:20px;top:-72px;background-color:#fff" v-else>
                  <el-button type="primary" style="margin-left:50px" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
                </div> -->
                <div class="page-back-icon" @click="$router.back(-1)">
                  <i class="el-icon-arrow-left"></i>
                </div>
          </el-form>
        </div>
        <div class="toggle-search" @click="toggleShearch">
          <i v-if="this.showShearch" class = "el-icon-caret-top"></i>
          <i v-else class = "el-icon-caret-bottom"></i>
        </div>
      </div>
      <div class="table-main" :style="{top:topValue}"> 
        <el-row :gutter="10" class="mb5">
          <el-col :span="1.5">
            <el-button v-if="!(tabsValue==='five'||tabsValue==='qmx'||tabsValue==='four')&&!qmxOptions.show" type="primary" size="small" @click="showCheckForm">查询条件</el-button>
          </el-col>
          <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='three'">
            <el-button type="primary" size="small" @click="guizeOptions.show = true">规则说明</el-button>
          </el-col>
          <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='three'">
            <el-button type="primary"  size="small" @click="handleThirdCheck" style="margin-right:15px">开展第三方筛查</el-button>
          </el-col>
          <el-col :span="1.5" v-if="tabsValue==='three'">
            <span style="color:#606266;font-size:14px">参保地：</span>
            <el-select v-model="gzQueryForm.ybd" size="small" @change="getList()">
              <el-option label="本地" value="01"></el-option>
              <el-option label="异地" value="02"></el-option>
            </el-select>
          </el-col>

          <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='six'">
            <el-button type="primary" size="small" @click="showHecha=true">选择核查数据</el-button>
          </el-col>
          <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='six'">
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
          <div class="top-right-btn" v-if="tabsValue!=='three'&&tabsValue!=='six'">
          <el-col :span="1.5">
            <el-button type="default"  size="small" @click="goBackUpLevel">返回上一层</el-button>
          </el-col>
          </div>
          <el-radio-group v-model="tabsValue" v-if="tabsValue=='three'||tabsValue=='six'"  size="small" class="top-right-btn" @change="tabsLevelChange1">
            <el-radio-button label="three">规则筛查</el-radio-button>
            <el-radio-button label="six">进销存核查</el-radio-button>
          </el-radio-group>
          <div class="top-right-btn" v-if="tabsValue=='five'||tabsValue=='qmx'">
            <el-radio-group v-model="tabsValue" size="small" @change="tabsLevelChange">
              <el-radio-button label="five">同流水号明细</el-radio-button>
              <el-radio-button label="qmx">全明细</el-radio-button>
            </el-radio-group>
          </div>
        </el-row>
        <div v-loading="loading" v-if="tabsValue!=='four'&&tabsValue!=='six'" style="height:calc(100% - 37px)">
          <sTable v-if="tabsValue=='three'" :data="renwuthreeList" :header="tableHeader" :fixedNum="1" :checkAll="false">
              <el-table-column label="序号" width="55" type="index" align="center" slot="fixed"/>
              <el-table-column label="操作"  fixed="right" align="center" min-width="160" slot="operate">
                <template slot-scope="scope">
                  <el-button type="text" size="mini" @click="fluProject(scope.row)">
                    流水号项目汇总
                  </el-button>
                </template>
              </el-table-column>
          </sTable>
          <tongliumx ref="tongLiumx" v-if="(tabsValue==='five'||tabsValue==='qmx')&&!qmxOptions.show" :tableData="renwufiveList" :gzmc="xwrdForm.mxxmmc" @radio-change="handleSelectionChange" @on-log="checkLog" @check-mx="checkMx" @on-close="logShow=false"></tongliumx>
          <quanmingxi v-if="qmxOptions.show" :options="qmxOptions"/>
        </div>
        <div v-loading="loading" v-else :style="{height:`calc(100% - ${tabsValue=='six'?153:113}px)`}">
          <jinxiaohecha v-show="tabsValue=='six'" :tableData="renwusixList" @radio-change="handleSelectionChange" @on-log="checkLog" @update="getList"/>
          <liushui-table v-if="tabsValue=='four'" ref="liuShuiTable" :fromLog="queryInfoFrom.fromLuli" :tableData="renwufourList" @radio-change="handleSelectionChange" @checkdetail="tongLiushuimx" @on-log="checkLog"></liushui-table>
        </div>
      </div>
      <div class="fixed-bottom" :class="[tabsValue=='four'||tabsValue=='six'?'fixed-bottom1':'']">
        <pagination
          v-show="!logShow&&!qmxOptions.show"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <div v-show="(tabsValue=='four'||tabsValue=='six')&&!logShow &&!queryInfoFrom.fromLuli &&!qmxOptions.show"  class="xingweirz">
          <el-form inline :model="xwrdForm" :rules="xwRules" size="mini" ref="xwrdForm" label-width="100px">
            <el-form-item label="名称">
              <el-input v-model="xwrdForm.mxxmmc" disabled></el-input>
            </el-form-item>
            <el-form-item label="行为认定" prop="xwrd">
              <div style="box-sizing:border-box;cursor:pointer;padding:0 15px;line-height:28px;height:28px;border:1px solid #DCDFE6;border-radius:4px;width:186px;color:#606266;font-size:13px;"  @click="handelXwrdDialog" >{{xwrdForm.xwrd}}</div>
            </el-form-item>
            <el-form-item label="追款单价" prop="zkdj" v-if="xwrdForm.xwrd.indexOf('未发现违规')<0">
              <el-input onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')" onafterpaste="this.value=this.value.replace(/[^0-9.]/g,'')"  v-model="xwrdForm.zkdj" :disabled="!!isDisabled.dj" @change="handleDjslChange"></el-input>
            </el-form-item>
            <el-form-item label="违规数量" prop="wgsl" v-if="xwrdForm.xwrd.indexOf('未发现违规')<0">
              <el-input onkeyup="this.value=this.value.replace(/[^0-9.]/g,'')" onafterpaste="this.value=this.value.replace(/[^0-9.]/g,'')" style="width:90%;margin-right:3px" v-model="xwrdForm.wgsl" :disabled="!!isDisabled.sl" @change="handleDjslChange"></el-input>
              <el-tooltip v-if="tabsValue==='six'" class="item" effect="dark" content="默认为差额数量，差额数量=医保结算数量-(期初库存数量+本期购入数据-期末库存数量-现金销售数量)" placement="top">
                <i style="color:#666;cursor:pointer" class="el-icon-info"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="违规金额(元)" v-if="xwrdForm.xwrd.indexOf('未发现违规')<0" >
              <el-input disabled :value="xwrdForm.wgfy"></el-input>
            </el-form-item>
            <el-form-item label="期初库存数量" prop="qckc" v-if="tabsValue==='six'" >
              <el-input type="number" min="0" v-model="xwrdForm.qckc" :disabled="!pksj" @change="hanndelChange"></el-input>
            </el-form-item><el-form-item label="本期购入数量" prop="bqgr" v-if="tabsValue==='six'" >
              <el-input type="number" min="0" v-model="xwrdForm.bqgr" :disabled="!pksj" @change="hanndelChange"></el-input>
            </el-form-item><el-form-item label="现金销售数量" prop="xjxs" v-if="tabsValue==='six'" >
              <el-input type="number" min="0" v-model="xwrdForm.xjxs" :disabled="!pksj" @change="hanndelChange"></el-input>
            </el-form-item><el-form-item label="期末库存数量" prop="qmkc" v-if="tabsValue==='six'" >
              <el-input type="number" min="0" v-model="xwrdForm.qmkc" :disabled="!pksj" @change="hanndelChange"></el-input>
            </el-form-item>
            <el-form-item label="医保结算数量" prop="ybjs" v-if="tabsValue==='six'" >
              <el-input type="number" min="0" v-model="xwrdForm.ybjs" :disabled="!pksj" @change="hanndelChange"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="bz">
              <el-input v-model="xwrdForm.bz" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="xwrdSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
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
    <xwrd-dialog :options="xwrdDialog" @on-checked="onChecked" v-if="xwrdDialog.show"></xwrd-dialog>
    <jgheshi :options="heshiOption" v-if="heshiOption.show" @on-close="heshiOption.show=false"></jgheshi>
    <operate-log v-if="logOption.show" :options="logOption"></operate-log>
  </div>
</template>

<script>
import { listRenwuthree } from "@/api/renwu/renwuthree";
import { setSancha,setShujusc} from  '@/api/renwu/renwutwo'
import { listRenwufour, updateRenwufour } from '@/api/renwu/renwufour'
import { getTLS,getQMX} from '@/api/renwu/mingxi'
import { submitDxqd, rendingAdd } from "@/api/renwu/dcqz"
import { bossRand } from "@/utils/ruoyi"
import LiushuiTable from './liushiTable.vue'
import Tongliumx from './tongliumx.vue'
import Guizeshuom from './guizeshuom.vue'
import XwrdDialog from './xwrdDialog.vue'
import Jgheshi from './jgheshi.vue'
import operateLog from './operateLog.vue'
import Quanmingxi from '../../common/quanmingxi.vue'
import Jinxiaohecha from './jinxiaohecha.vue'
import Hechashuju from './hechashuju.vue'
import xmbm from './xmbm.vue'
import { pageMixin } from '@/utils/pageMixin.js'
export default {
  name: "Shisjc",
  mixins:[pageMixin],
  components: {
    LiushuiTable,
    Guizeshuom,
    XwrdDialog,
    Tongliumx,
    Jgheshi,
    operateLog,
    Quanmingxi,
    Jinxiaohecha,
    Hechashuju,
    xmbm
  },
  data() {
    return {
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
      selectedId:"",
      selectionList:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      renwuthreeList: [],
      renwufourList:[],
      renwufiveList:[],
      renwusixList:[],
      // 弹出层标题
      title: "",
      // 核实状态字典
      hsztOptions:[
        {dictValue:'1',dictLabel:'未核实'},
        {dictValue:'2',dictLabel:'待核实确认'},
        {dictValue:'3',dictLabel:'核实中'},
        {dictValue:'4',dictLabel:'已核实'}
      ],
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
        type:'',
        id:''
      },
      lsh:'',//第四层的参数，查询同流水号明细需要用到
      mxxmbm:'',//第四层的参数，查询同流水号明细需要用到
      pksj:'', //盘库时间
      gzflOptions:[],
    }
  },
  created() {
    this.queryInfoFrom = this.$route.query
    this.getList();
  },
  methods: {
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
      this.selectedId = ''
      this.selectionList = []
      this.getList()
      this.$refs.xwrdForm.clearValidate()
    },
    //同流水号明细，全明细切换
    tabsLevelChange(val){
      this.queryParams.pageNum=1
      this.total = 0
      const {jgdm,datastarttime,dataendtime} = this.queryInfoFrom
      this.searchTlsNextParams = val=='five'?{lsh:this.lsh||'',mxxmbm:this.mxxmbm}:{
        jgdm:jgdm,
        zdbm:this.parseTime(datastarttime, '{y}{m}'),
        zdbm1:this.parseTime(dataendtime, '{y}{m}')
      }
      this.getList()
    },
    /**
     * 第三方筛查
     */
    handleThirdCheck(){
      this.$confirm('是否对当前机构进行数据筛查', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=> {
          const userNmae = this.$store.getters.name
          const {id,rwpcid,jgdm,jgmc,sccqstatus,datastarttime,dataendtime,jczid} = this.queryInfoFrom
          const time = bossRand();
          const requireParams = {
            scstatus:1,
            ids:id,
            scrwid:[rwpcid,jgdm,time].join('-'),
            scname:[rwpcid,time,jgmc].join('-'),
            scsqr:userNmae,
            rwpcid,
            jgdm,
            datastarttime,
            dataendtime
          }
          if(sccqstatus==0){
            requireParams.sccqstatus = 1
          }
          setShujusc({
            id,
            datastarttime,
            dataendtime,
            jgdm,
            jczid,
            createBy:userNmae,
            scrwid:[rwpcid,jgdm,time].join('-'),
            scname:[rwpcid,time,jgmc].join('-'),
            deptId:this.$store.getters.userId
          }).then(res=>{
            this.loading = false
            if(res.code===200) {
              this.msgSuccess('操作成功')
              setSancha(requireParams)
            }
            this.$router.push({path:'/zhgl/dsfgz/fasc/scenarioConfiguration'})
          }).catch(()=>{
            this.loading = false
          })
          this.addJcfl({
            jglc:'数据筛查',
            gjxx:``,
            // gjxx:`提交批号为${rwpcid}机构代码为${jgdm}的第三方筛查`,
            rwpcid:rwpcid,
            jgdm:jgdm,
            zhczr:this.$store.getters.name,
            sort:1
          })
      }).catch(_=>{})
    },
    tableFourRadioChange(e){
      console.log(e)
    },
    //点击检查完成状态跳到4
    doSubmit() {
      this.$confirm("请确认所有规则均已完成检查，是否提交？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          const params = {
            ids:[this.queryInfoFrom.id],
            status:4,//检查完成去到状态4，形成结果
            dxqd:'检查完成',
          }
          return submitDxqd(params);
        }).then(()=>{
          this.msgSuccess("操作成功")
          this.getList()
          this.addJcfl({
            jglc:'检查实施',
            gjxx:`检查完成`,
            rwpcid:this.queryInfoFrom.rwpcid,
            jgdm:this.queryInfoFrom.jgdm,
            zhczr:this.$store.getters.name,
            sort:7
          })
        }).catch(_=>{})
    },
    //返回上一层
    goBackUpLevel(){
      this.selectedId = ''
      this.xwrdForm = {
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
      }
      switch(true) {
        case (this.tabsValue=='five'||this.tabsValue=='qmx'):
          if(this.qmxOptions.show){
            this.qmxOptions.show = false
          } else {
            this.tabsValue = 'four'
            this.xwrdForm.mxxmmc=''
            this.lsh = ''
          }
          break
        case (this.tabsValue=='four'):
          this.tabsValue = 'three'
          this.getList()
          this.xwrdForm.mxxmmc=''
          break
        default :
         break
      }
      this.logShow&&(this.logShow = false)
    },
    //选择行为回调
    onChecked(res){
      this.xwrdChecd = res
      this.xwrdForm.xwrd = res.wgxw
    },
    //点击行为认定
    handelXwrdDialog(){
      if(!this.selectedId){
        this.msgError('请选择规则后再点行为认定')
      } else {
        this.xwrdDialog.show = true
      }
    },
    xwrdSubmit(){
      if(this.selectionList.length===0){
        this.msgError('请选择一项在进行行为认定')
        return
      }
      if(this.tabsValue==='six' && !this.pksj){//进销存核查
        this.msgError('请选择盘库期初和盘库期末时间')
        return   
      }
      const mxxmbjsfy = this.selectionList[0]?.mxxmbjsfy||0
      const wgfy = this.xwrdForm?.wgfy||0
      if(wgfy*1>mxxmbjsfy*1 && this.xwrdForm.xwrd.indexOf('未发现违规')<0){
        this.msgError('违规费用不能大于明细项目医保结算金额')
        return
      }
      this.$refs['xwrdForm'].validate(async valid => {
          if (valid) {
            let res = ''
            const {type,xwbh,lx} = this.xwrdChecd//这个type是行文认定选择的类型
            const params = {id:this.selectedId,...this.xwrdForm,xwbh,wglx:lx}
            if(this.pksj){
              params.pkqcsj = this.parseTime(this.pksj[0].getTime(),'{y}-{m}-{d}')
              params.pkqmsj = this.parseTime(this.pksj[1].getTime(),'{y}-{m}-{d}')
            }
            if(this.xwrdForm.xwrd.indexOf('未发现违规')>-1){
              delete params.zkdj
              delete  params.wgsl
              delete  params.wgfy
            }
            if(this.tabsValue==='six'){//进销存核查
              const cesl = this.cesl()
              params.cesl = cesl
              params.dzce = this.formatMoney(cesl*this.selectionList[0].mxxmdj,2) 
            }
            delete params.bjsj
            res = await updateRenwufour({...params,jgbf:type})
            if(res.code===200) {
              this.msgSuccess('操作成功')
              if(this.tabsValue==="four"){
                this.getList(this.searchLsNextParams)
              } else {
                this.getList()
              }
              this.selectionList.forEach(item=>{
                const addData = {
                  bjr: this.$store.getters.name,
                  bjsj: this.parseTime(new Date(), '{y}-{m}-{d} {h}:{m}:{s}'),
                  fid:item.id,
                  rid:item.rwpcid,
                  jgdm:item.jgdm,
                  type:this.tabsValue==='four'?'1':'2',
                  ...params,
                }
               
                if(this.tabsValue==='four'){//流水号项目汇总
                  delete addData.qckc
                  delete addData.bqgr
                  delete addData.xjxs
                  delete addData.qmkc
                  delete addData.ybjs
                  delete addData.pkqmsj
                  delete addData.pkqcsj  
                } else {
                  addData.cesl = params.cesl
                  addData.dzce = params.dzce 
                }
                rendingAdd(addData)
              })

            }
          } else {
            return false;
          }
        });
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
      let params = {...this.queryParams,rwpcid,jgdm}
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
          case 'four':
            params.type=1
            res = await listRenwufour({...params,...this.searchLsNextParams})
            break;
          case 'five':
            res = await getTLS({...this.queryParams,...this.searchTlsNextParams})
            break;
          case 'six':
            params.type=2
            params.ischeck=1
            res = await listRenwufour({...params,...this.bmQueryForm})
            break;
          case 'qmx':
            res = await getQMX({...this.queryParams,...this.searchTlsNextParams})
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
    // 规则分类字典翻译
    gzflFormat(row, column) {
      return this.selectDictLabels(this.gzflOptions, row.gzfl);
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
        // this.ids = selection.map(item => item.id)
        this.isDisabled = this.isDisabledEvent(selection)
        const {id,mxxmdj,mxxmsl,mxxmje,bz,mxxmmc,wgfy,wgsl,zkdj} = selection[0]
        this.selectedId = id
        this.selectionList = selection
        this.xwrdForm.bz = bz
        this.xwrdForm.zkdj = zkdj
        this.xwrdForm.wgsl = wgsl
        // this.xwrdForm.wgfy = (wgfy!==null||wgfy!==undefined)?wgfy:''
        this.xwrdForm.wgfy = (zkdj && wgsl)?(zkdj*wgsl).toFixed(2):''
        this.xwrdForm.mxxmmc = mxxmmc
        this.xwrdForm.xwrd = ''
        if(this.tabsValue==='six'){//进销存核查
          const {qckc,bqgr,xjxs,qmkc,ybjs} = selection[0]
          this.xwrdForm.qckc = qckc
          this.xwrdForm.bqgr = bqgr
          this.xwrdForm.xjxs = xjxs
          this.xwrdForm.qmkc = qmkc
          this.xwrdForm.ybjs = ybjs
        } else {
          // this.xwrdForm.wgsl = mxxmsl
        }
        this.$refs.xwrdForm.clearValidate()
      } else {
        this.ids=[]
        this.xwrdForm = {
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
        }
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
      this.logOption.id = row.id
      this.logOption.xwrd = row.xwrd
      this.logOption.show = true
    },
    //全明细
    checkMx(row){
      this.qmxOptions.query = {
        jgdm:row.jgdm,
        zdbm:this.parseTime(this.queryInfoFrom.datastarttime, '{y}{m}'),
        zdbm1:this.parseTime(this.queryInfoFrom.dataendtime, '{y}{m}')
      }
      this.qmxOptions.show = true
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
    }
  }
};
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:153px;
  bottom:45px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:8px;
  right: 0px;
  width: 100%;
  &.fixed-bottom1 {
    bottom: 0;
  }
}
.xingweirz {
  .el-form-item {
    margin-bottom: 12px !important;
  }
  &::v-deep .el-form-item__label {
    font-size: 12px !important;
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