<template>
  <div class="app-container" style="height:100%" v-loading="pageLoaing">
    <section>
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button v-if="!(tabsValue==='five'||tabsValue==='qmx'||tabsValue==='four')&&!qmxOptions.show" type="primary" plain size="small" @click="showCheckForm">查询条件</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='three'">
          <span style="color:#606266;font-size:14px">参保地：</span>
          <el-select v-model="gzQueryForm.ybd" size="small" @change="getList()">
            <el-option label="本地" value="01"></el-option>
            <el-option label="异地" value="02"></el-option>
          </el-select>
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
            <el-table-column label="序号" width="55" type="index" align="center" slot="fixed"/>
            <el-table-column label="操作" align="center" min-width="160" slot="operate">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="fluProject(scope.row)">
                  流水号项目汇总
                </el-button>
              </template>
            </el-table-column>
        </sTable>
        <tongliumx ref="tongLiumx" v-if="(tabsValue==='five'||tabsValue==='qmx')&&!qmxOptions.show" :tableData="renwufiveList"  @on-log="checkLog" @check-mx="checkMx" @on-close="logShow=false"></tongliumx>
        <quanmingxi v-if="qmxOptions.show" :options="qmxOptions"/>
      </div>
      <div v-loading="loading" v-else>
        <jinxiaohecha v-if="tabsValue=='six'" fromLog="true" :tableData="renwusixList" :hasNoRending="true"  @on-log="checkLog" @update="getList"/>
        <liushui-table v-if="tabsValue=='four'" ref="liuShuiTable" :hasNoRending="true" :tableData="renwufourList" @checkdetail="tongLiushuimx" @on-log="checkLog"></liushui-table>
      </div>
      <pagination
        class="fixed-bottom"
        v-show="!logShow&&!qmxOptions.show"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
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
import { listRenwuthree} from "@/api/renwu/renwuthree";
import { setSancha,setShujusc} from  '@/api/renwu/renwutwo'
import { listRenwufour, updateRenwufour, listXmbm } from '@/api/renwu/renwufour'
import { getTLS,getQMX} from '@/api/renwu/mingxi'
import { submitDxqd, rendingAdd } from "@/api/renwu/dcqz"
import { bossRand } from "@/utils/ruoyi"
import LiushuiTable from './liushiTable.vue'
import Tongliumx from '../checkup/jianchass/tongliumx.vue'
import Guizeshuom from '../checkup/jianchass/guizeshuom.vue'
import XwrdDialog from '../checkup/jianchass/xwrdDialog.vue'
import Jgheshi from '../checkup/jianchass/jgheshi.vue'
import operateLog from '../checkup/jianchass/operateLog.vue'
import Quanmingxi from '../common/quanmingxi.vue'
import Jinxiaohecha from './jinxiaohecha.vue'
import Hechashuju from '../checkup/jianchass/hechashuju.vue'
import xmbm from '../checkup/jianchass/xmbm.vue'
import { getToken } from '@/utils/auth'

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
    Hechashuju,
    xmbm
  },
  data() {
    return {
      pageLoaing:true,
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
      // this.$refs.xwrdForm.clearValidate()
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
      switch(true) {
        case (this.tabsValue=='five'||this.tabsValue=='qmx'):
          if(this.qmxOptions.show){
            this.qmxOptions.show = false
          } else {
            this.tabsValue = 'four'
            this.lsh = ''
          }
          break
        case (this.tabsValue=='four'):
          this.tabsValue = 'three'
          this.getList()
          break
        default :
         break
      }
      this.logShow&&(this.logShow = false)
    },
    //选择行为回调
    onChecked(res){
      this.xwrdChecd = res
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
    //全明细
    checkMx(row){
      this.qmxOptions.query = {
        jgdm:row.jgdm,
        zdbm:this.parseTime(this.queryInfoFrom.datastarttime, '{y}{m}'),
        zdbm1:this.parseTime(this.queryInfoFrom.dataendtime, '{y}{m}')
      }
      this.qmxOptions.show = true
    },
  }
};
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:60px;
  bottom:60px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:25px;
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