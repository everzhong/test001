<template>
  <div class="app-container">
    <section v-show="!heshiOption.show" >
      <el-form style="height:70px;overflow:auto;margin-bottom:20px;" size="small" label-width="100px" class="top-search1" ref="queryForm" :inline="true" v-show="showSearch">
            <el-form-item label="案件来源" prop="ajly">
              <el-input readonly v-model="queryInfoFrom.ajly"></el-input>
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
              <el-form-item label="检查机构" prop="jcjg">
              <el-input readonly v-model="queryInfoFrom.jcjg"></el-input>
            </el-form-item>
              <el-form-item label="检查组" prop="jcz">
              <el-input readonly v-model="queryInfoFrom.jcz"></el-input>
            </el-form-item>
            <div style="position:absolute;right:20px;top:-72px;background-color:#fff" v-if="!queryInfoFrom.fromLuli">
              <el-button type="primary" size="mini" @click="heshiOption.show=true" >机构核实</el-button>
              <el-button type="primary" size="mini" @click="doSubmit">检查完成</el-button>
              <el-button type="primary" plain style="margin-left:50px" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
            </div>
            <div style="position:absolute;right:20px;top:-72px;background-color:#fff" v-else>
              <el-button type="primary" style="margin-left:50px" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
            </div>
      </el-form>
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="chaxunDialog = true">查询条件</el-button>
        </el-col>
        <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='three'">
          <el-button type="primary" plain size="small" @click="guizeOptions.show = true">规则说明</el-button>
        </el-col>
        <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='three'">
          <el-button type="primary" plain size="small" @click="handleThirdCheck" style="margin-right:15px">第三方筛查</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='three'">
          <span style="color:#606266;font-size:14px">参保人：</span>
          <el-select v-model="ybd" size="small">
            <el-option label="本地" value="01"></el-option>
            <el-option label="异地" value="02"></el-option>
          </el-select>
        </el-col>

        <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='six'">
          <el-button type="primary" plain size="small" @click="showHecha=true">选择核查数据</el-button>
        </el-col>
        <!-- <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='six'">
          <el-button type="primary" plain size="small" @click="canclHc">取消核查</el-button>
        </el-col> -->
        <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='six'">
          <label style="font-size:12px;color:#606266;padding-right:6px;margin-left:10px">盘库期初时间</label>
          <el-date-picker
          v-model="pkqcsj"
          align="right"
          type="date"
          size="small"
          placeholder="盘库期初时间"
         >
        </el-date-picker>
        </el-col>
        <el-col :span="1.5" v-if="!queryInfoFrom.fromLuli && tabsValue==='six'">
          <label style="font-size:12px;color:#606266;padding-right:6px;margin-left:10px">盘库期末时间</label>
          <el-date-picker
          v-model="pkqmsj"
          align="right"
          type="date"
          size="small"
          placeholder="盘库期末时间"
         >
        </el-date-picker>
        </el-col>
        <!-- <el-col :span="1.5" v-if="tabsValue==='four'&&!isAll&&renwufourList.length">
          <el-button type="primary" plain size="small" @click="selectEvent('selectAll',true)">全选</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='four'&&isAll">
          <el-button type="primary" plain size="small" @click="selectEvent('clearAll',false)">取消全选</el-button>
        </el-col> -->
        <el-col :span="1.5" v-if="tabsValue!=='three'&&tabsValue!=='six'">
          <el-button type="warning" plain size="small" @click="goBackUpLevel">返回上一层</el-button>
        </el-col>
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
      <div class="table-main"  v-loading="loading" v-if="tabsValue!=='four'&&tabsValue!=='six'">
        <sTable v-if="tabsValue=='three'" :data="renwuthreeList" :header="tableHeader" :fixedNum="1" :checkAll="false">
        <!-- <el-table v-if="tabsValue=='three'"  class="qztable" :data="renwuthreeList" border style="width:100%" height="100%" ref="jctable"> -->
            <el-table-column label="序号" width="55" type="index" align="center" slot="fixed"/>
            <el-table-column label="操作" align="center" min-width="160" slot="operate">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="fluProject(scope.row)">
                  流水号项目汇总
                </el-button>
              </template>
            </el-table-column>
        </sTable>
        <tongliumx ref="tongLiumx" v-if="(tabsValue==='five'||tabsValue==='qmx')&&!qmxOptions.show" :tableData="renwufiveList" :gzmc="xwrdForm.gzmc" @radio-change="handleSelectionChange" @on-log="checkLog" @check-mx="checkMx" @on-close="logShow=false"></tongliumx>
        <quanmingxi v-if="qmxOptions.show" :options="qmxOptions"/>
      </div>
      <div v-loading="loading" v-else>
        <jinxiaohecha v-show="tabsValue=='six'" :tableData="renwusixList" @radio-change="handleSelectionChange" @on-log="checkLog" @update="getList"/>
        <liushui-table v-if="tabsValue=='four'" ref="liuShuiTable" :fromLog="queryInfoFrom.fromLuli" :tableData="renwufourList" @radio-change="handleSelectionChange" @checkdetail="tongLiushuimx" @on-log="checkLog"></liushui-table>
      </div>
      <pagination
        class="fixed-bottom"
        v-show="!logShow&&!qmxOptions.show"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <div v-show="(tabsValue=='four'||tabsValue=='six')&&!logShow &&!queryInfoFrom.fromLuli &&!qmxOptions.show"  class="xingweirz" style="margin-top:10px;">
        <el-form inline :model="xwrdForm" :rules="xwRules" size="mini" ref="xwrdForm" label-width="100px">
          <el-form-item label="名称" prop="gzmc">
            <el-input v-model="xwrdForm.gzmc" disabled></el-input>
          </el-form-item>
          <el-form-item label="行为认定" prop="xwrd">
            <div style="box-sizing:border-box;cursor:pointer;padding:0 15px;line-height:28px;height:28px;border:1px solid #DCDFE6;border-radius:4px;width:186px;color:#606266;font-size:13px;"  @click="handelXwrdDialog" >{{xwrdForm.xwrd}}</div>
          </el-form-item>
          <el-form-item label="追款单价" prop="zkdj" v-if="xwrdForm.xwrd.indexOf('未发现违规')<0">
            <el-input v-model="xwrdForm.zkdj" :disabled="isDisabled.dj" @change="handleDjslChange"></el-input>
          </el-form-item>
          <el-form-item label="违规数量" prop="wgsl" v-if="xwrdForm.xwrd.indexOf('未发现违规')<0">
            <el-input v-model="xwrdForm.wgsl" :disabled="isDisabled.sl" @change="handleDjslChange"></el-input>
          </el-form-item>
          <el-form-item label="违规费用(元)" prop="wgfy" v-if="xwrdForm.xwrd.indexOf('未发现违规')<0" >
            <el-input v-model="xwrdForm.wgfy" :disabled="isDisabled.fy"></el-input>
          </el-form-item>
          <el-form-item label="期初库存数量" prop="qckc" v-if="tabsValue==='six'" >
            <el-input v-model="xwrdForm.qckc"></el-input>
          </el-form-item><el-form-item label="本期购入数量" prop="bqgr" v-if="tabsValue==='six'" >
            <el-input v-model="xwrdForm.bqgr"></el-input>
          </el-form-item><el-form-item label="现金销售数量" prop="xjxs" v-if="tabsValue==='six'" >
            <el-input v-model="xwrdForm.xjxs"></el-input>
          </el-form-item><el-form-item label="期末库存数量" prop="qmkc" v-if="tabsValue==='six'" >
            <el-input v-model="xwrdForm.qmkc"></el-input>
          </el-form-item>
          <el-form-item label="医保结算数量" prop="ybjs" v-if="tabsValue==='six'" >
            <el-input v-model="xwrdForm.ybjs"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="bz">
            <el-input v-model="xwrdForm.bz" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="xwrdSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <hechashuju v-if="showHecha" :isShow="showHecha" @onClose="showHecha=false" @update="getList"/>
    </section>
     <!-- 查询条件 -->
    <el-dialog title="查询条件" class="msg-dialog" :visible.sync="chaxunDialog" width="650px">
      <el-form ref="chaxunForm" :model="queryForm" :rules="rules" label-width="100px" size="small">
        <el-form-item label="规则分类" prop="gzfl">
          <el-input clearable v-model="queryForm.gzfl" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="规则名称" prop="gzmc">
          <el-input clearable v-model="queryForm.gzmc" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="行为认定" prop="xwrd" >
          <el-input clearable v-model="queryForm.xwrd" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="机构核实状态" prop="hszt">
          <el-select clearable v-model="queryForm.hszt" placeholder="全部" style="width:360px">
            <el-option
              v-for="dict in hsztOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getList()" size="small">确 定</el-button>
        <el-button @click="$refs['chaxunForm'].resetFields()" size="small">重置</el-button>
      </div>
    </el-dialog>
    <guizeshuom :options="guizeOptions"></guizeshuom>
    <xwrd-dialog :options="xwrdDialog" @on-checked="onChecked" v-if="xwrdDialog.show"></xwrd-dialog>
    <jgheshi :options="heshiOption" v-if="heshiOption.show" @on-close="heshiOption.show=false"></jgheshi>
    <operate-log v-if="logOption.show" :options="logOption"></operate-log>
  </div>
</template>

<script>
import { listRenwuthree, getRenwuthree, delRenwuthree, addRenwuthree, updateRenwuthree, exportRenwuthree } from "@/api/renwu/renwuthree";
import { setSancha } from  '@/api/renwu/renwutwo'
import { listRenwufour, updateRenwufour} from '@/api/renwu/renwufour'
import { updateRenwufive} from '@/api/renwu/renwufive'
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
export default {
  name: "Shisjc",
  components: {
    LiushuiTable,
    Guizeshuom,
    XwrdDialog,
    Tongliumx,
    Jgheshi,
    operateLog,
    Quanmingxi,
    Jinxiaohecha,
    Hechashuju
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
        label: '涉及明细数',
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
        gzmc:'',
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
        xwrd:[{required:true,message:'必填项'}]
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
      // 核实状态字典
      hsztOptions:[
        {dictValue:'1',dictLabel:'未核实'},
        {dictValue:'2',dictLabel:'核实中'},
        {dictValue:'3',dictLabel:'已核实'}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      queryForm:{
        gzmc:'',
        gzfl:'',
        xwrd:'',
        hszt:null
      },
      
      guizefl:{
        search:'',
        gzfl:'',
        data:[],
        selection:[],
        total:0,
        pageNum:1,
        pageSize:50
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
      //本地或异地
      ybd:'01',
      //上页带过来的数据
      queryInfoFrom:{},
      searchNextParams:{},
      logOption:{
        show:false,
        xwrd:'',
        type:''
      },
      lsh:'',//第四层的参数，查询同流水号明细需要用到
      pkqcsj:'',//盘库期初
      pkqmsj:'',//盘库期末

    }
  },
  created() {
    this.queryInfoFrom = this.$route.query
    this.getList();
  },
  methods: {
    //规则筛查，进销核查切换
    tabsLevelChange1(val){
      this.selectedId = ''
      this.selectionList = []
      this.getList()
    },
    //同流水号明细，全明细切换
    tabsLevelChange(val){
      console.log(val)
      this.queryParams.pageNum=1
      this.total = 0
      const {jgdm,datastarttime,dataendtime} = this.queryInfoFrom
      this.searchNextParams = val=='five'?{lsh:this.lsh||''}:{
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
      // if(this.queryInfoFrom.sccqstatus*1>=1){
      //   this.msgSuccess('已提交过筛查')
      //   return
      // }
      this.$confirm('是否对当前机构进行数据筛查', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=> {
          const userNmae = this.$store.getters.name
          const {id,rwpcid,jgdm,jgmc,sccqstatus,datastarttime,dataendtime} = this.queryInfoFrom
          const time = bossRand();
          const requireParams = {
            ids:id,
            scrwid:[rwpcid,jgdm,time].join('-'),
            scstatus:1,
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
          setSancha(requireParams).then(()=>{
            this.loading = false
            this.msgSuccess('操作成功')
            this.getList()
            this.addJcfl({
              jglc:'数据筛查',
              gjxx:`提交批号为${rwpcid}机构代码为${jgdm}的第三方筛查`,
              rwpcid:rwpcid,
              jgdm:jgdm,
              zhczr:this.$store.getters.name,
              sort:1
            })
          }).catch(e=>{
            this.loading = false
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
            gjxx:`检查完成：批号为${this.queryInfoFrom.rwpcid}机构代码为${this.queryInfoFrom.jgdm}`,
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
      const {gzmc} = this.xwrdForm
      this.xwrdForm = {
        xwrd:'',
        bz:'',
        zkdj:'',
        wgsl:'',
        wgfy:''
      }
      switch(true) {
        case (this.tabsValue=='five'||this.tabsValue=='qmx'):
          if(this.qmxOptions.show){
            this.qmxOptions.show = false
            this.xwrdForm.gzmc=gzmc
          } else {
            this.tabsValue = 'four'
            this.xwrdForm.gzmc=''
            this.lsh = ''
          }
          break
        case (this.tabsValue=='four'):
          this.tabsValue = 'three'
          this.xwrdForm.gzmc=''
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
      const mxxmbjsfy = this.tabsValue==='four'?this.selectionList[0].mxxmbjsfy:this.selectionList[0].mxxmybjsfy
      if(this.xwrdForm.wgfy>mxxmbjsfy && this.xwrdForm.xwrd.indexOf('未发现违规')<0){
        this.msgError('违规费用不能大于明细项目医保结算金额')
        return
      }
      this.$refs['xwrdForm'].validate(async valid => {
          if (valid) {
            let res = ''
            const {type,xwbh,lx} = this.xwrdChecd
            const params = {id:this.selectedId,...this.xwrdForm,type,xwbh,wglx:lx}
            if(this.xwrdForm.xwrd.indexOf('未发现违规')>-1){
              delete params.zkdj
              delete  params.wgsl
              delete  params.wgfy
            }
            res = await updateRenwufour(params)
            if(res.code===200) {
              this.msgSuccess('操作成功')
              this.getList(this.searchNextParams)
              // this.searchNextParams = {}
              this.selectionList.forEach(item=>{
                rendingAdd({
                  bjr: this.$store.getters.name,
                  bjsj: this.parseTime(new Date(), '{y}-{m}-{d} {h}:{m}:{s}'),
                  zkdj:this.xwrdForm.zkdj,
                  wgsl:this.xwrdForm.wgsl,
                  wgfy:this.xwrdForm.wgfy,
                  xwrd:this.xwrdForm.xwrd,
                  xwbh:this.xwrdChecd.xwbh,
                  bz:this.xwrdForm.bz,
                  rid:item.rwpcid,
                  jgdm:item.jgdm,
                  fid:(this.tabsValue=='four'||this.tabsValue=='six')?item.id:item.fid,
                  type:(this.tabsValue=='four'||this.tabsValue=='six')?4:5,
                })
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
     * selectedGuize规则选择确定
     */
    selectedGuize(){

    },
    /**
     * 流水号项目列表全选
     * 
    /**
     * 全选，取消全选
     */
    selectEvent(type,isAll) {
      this.isAll = isAll
      this.$refs.liuShuiTable[type]()
    },
    /**
     * 
     * 查看流水号项目汇总
    */
    fluProject(row){
      this.$set(this,'tabsValue','four')
      this.searchNextParams = {rwpcid:row.rwpcid,jgdm:row.jgdm,gzmc:row.gzmc,type:1}
      this.getList(this.searchNextParams)
    },
    /** 查询renwu列表 */
    async getList(query) {
      // const params = query?{...query,...this.queryParams}:this.queryParams
      let params = {...this.queryForm,...this.queryParams}
      if(query){
        params = {...params,...query}
      } else {
        const {rwpcid,jgdm} = this.queryInfoFrom
        params = {rwpcid,jgdm,...params}
      }
      this.loading = true
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            res = await listRenwuthree(params)
            break;
          case 'four':
            params.type=1
            res = await listRenwufour(params)
            break;
          case 'five':
            res = await getTLS({...this.queryParams,...this.searchNextParams})
            break;
          case 'six':
            params.type=2
            params.ischeck=1
            res = await listRenwufour(params)
            break;
          case 'qmx':
            res = await getQMX({...this.queryParams,...this.searchNextParams})
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
            this.$refs['chaxunForm'].resetFields()
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
    // 结算费用字典翻译
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
    // 核实状态字典翻译
    hsztFormat(row, column) {
      return this.selectDictLabels(this.hsztOptions, row.hszt);
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        jgdm: null,
        jgmc: null,
        gzfl: null,
        gzmc: null,
        xjjzrs: null,
        xjmxs: null,
        xjje: null,
        jsfy: null,
        ybbf: null,
        xzq: null,
        jslb: null,
        ybd: null,
        datastarttime: null,
        xydm: null,
        addtime: null,
        jsdj: null,
        hsyj: null,
        hszt: null,
        hssj: null,
        hsr: null,
        hspfsj: null,
        rwpcid: null,
        issend: null
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
      if(selection.length!==0){
        // this.ids = selection.map(item => item.id)
        this.isDisabled = this.isDisabledEvent(selection)
        const {id,mxxmdj,mxxmsl,mxxmje,gzmc,bz} = selection[0]
        this.selectedId = id
        this.selectionList = selection
        this.xwrdForm.bz = bz
        this.xwrdForm.zkdj = mxxmdj
        this.xwrdForm.wgsl = mxxmsl
        this.xwrdForm.wgfy = mxxmje
        this.tabsValue==='four' && (this.xwrdForm.gzmc = gzmc)//第五层使用上一层带过来的规则名称
        this.xwrdForm.xwrd = ''
        if(this.tabsValue==='six'){//进销核查
          const {qckc,bqgr,xjxs,qmkc,ybjs} = selection[0]
          this.xwrdForm.qckc = qckc
          this.xwrdForm.bqgr = bqgr
          this.xwrdForm.xjxs = xjxs
          this.xwrdForm.qmkc = qmkc
          this.xwrdForm.ybjs = ybjs
        }
        // const shuliangList = selection.map(item=>item.mxxmsl)
        // const feiyong = selection.map(item=>item.mxxmje)
        // this.xwrdForm.mxxmsl = this.sum(shuliangList)
        // this.xwrdForm.mxxmje = this.sum(feiyong)
      } else {
        this.ids=[]
        this.xwrdForm = {
          gzmc:'',
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
      this.searchNextParams = {lsh:row.lsh||'',mxxmbm:row.mxxmbm}
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
    //全明细
    checkMx(row){
      this.qmxOptions.query = {
        jgdm:row.jgdm,
        zdbm:this.parseTime(this.queryInfoFrom.datastarttime, '{y}{m}'),
        zdbm1:this.parseTime(this.queryInfoFrom.dataendtime, '{y}{m}')
      }
      this.qmxOptions.show = true
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加renwuthree";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRenwuthree(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwuthree";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenwuthree(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwuthree(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除renwuthree编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwuthree(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(_=>{})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwuthree数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwuthree(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    },
    handleDjslChange(){
      if(this.xwrdForm.zkdj!==''&&this.xwrdForm.wgsl!==''){
        this.xwrdForm.wgfy = this.xwrdForm.zkdj*this.xwrdForm.wgsl
      } else {
        this.xwrdForm.wgfy = ''
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:153px;
  bottom:70px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:30px;
  right: 0px;
}
.xingweirz {
  .el-form-item {
    margin-bottom: 12px !important;
  }
  &::v-deep .el-form-item__label {
    font-size: 12px !important;
  }
}
</style>