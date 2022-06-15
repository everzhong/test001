<template>
  <div :class="['app-container container_1',isFromLuli?'from-luli':'']">
    <SearchItem ref="searchForm" @handleQuery="handleQuery" v-if="!isFromLuli" @toggle-search="toggleSearch" :disabled="mxShow"/>
    <div class="page-back-icon" @click="$router.back(-1)">
      <!-- <el-button type="primary" icon="el-icon-back" size="mini" >返回</el-button> -->
      <i class="el-icon-arrow-left"></i>
    </div>
    <div :class="[isFromLuli?'table-main1':'table-main']" :style="{top:topValue}">
      <el-row :gutter="10" style="margin-bottom:5px">
        <el-col :span="1.5" v-if="tabsValue==='two'&&!mxShow && !isRwcx">
          <el-button
            type="primary"
            size="small"
            @click="handleNetCheck"
          >派发网审</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='two'&&!mxShow && !isRwcx">
          <el-button
            type="primary"
            size="small"
            @click="handleThirdCheck"
          >开展第三方筛查</el-button>
        </el-col>
       
        <div class="top-right-btn" >
          <el-col :span="1.5" v-if="mxShow">
            <el-button
              type="default"
              size="small"
              
              @click="mxShow=false,qmxOptions.show=false,xgmxOptions.show=false"
            >返回上一层</el-button>
          </el-col>
          <el-radio-group v-if="!mxShow" v-model="tabsValue" size="small" @change="tabsLevelChange">
            <el-radio-button label="two" v-if="!isFromLuli">任务列表</el-radio-button>
            <el-radio-button label="three">任务列表-规则列表</el-radio-button>
            <el-radio-button label="four">规则筛查-项目汇总</el-radio-button>
          </el-radio-group>
        </div>
      </el-row>
      <div v-loading="loading" v-show="!mxShow" style="height:calc(100% - 37px)">
        <RenwuthreeTable v-if="tabsValue==='three'" :tableData="renwuthreeList" @selection-change="handleThreeTableChange"  @check-xgmx="checkdetail($event,'xgmx')"/>
        <RenwufourTable v-else-if="tabsValue==='four'" :tableData="renwufourList" @check-xgmx="checkdetail($event,'xgmx')"/>
        <sTable v-else :data="renwutwoList" :header="tableHeader" :fixedNum="isRwcx?1:2" @selection-change="handleSelectionChange" @on-click="viewSc">
          <el-table-column v-if="!isRwcx" slot="fixed" type="selection" width="55" align="center"/>
          <el-table-column slot="fixed" label="序号" type="index" align="center"/>
          <el-table-column label="操作"  fixed="right" align="center" width="180" slot="operate">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="checkdetail(scope.row,'xgmx')"
              >查看相关明细</el-button>
              <el-button
                size="mini"
                type="text"
                @click="checkdetail(scope.row,'qmx')"
              >全明细</el-button>
            </template>
          </el-table-column>
        </sTable>
      </div>
      <div v-if="xgmxOptions.show||qmxOptions.show" style="height:calc(100% - 37px)">
        <checkmx ref="xgmx" :options="xgmxOptions" v-if="xgmxOptions.show"/>
        <quanmingxi ref="qmx" :options="qmxOptions" v-else />
      </div>
    </div>
    <pagination
      v-show="!mxShow"
      class="fixed-bottom"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { listRenwutwo,setShujusc,setSancha} from "@/api/renwu/renwutwo"
import { listRenwuthreeRj } from '@/api/renwu/renwuthree'
import { listRenwufourRj } from '@/api/renwu/renwufour'
import { submitDxqd} from "@/api/renwu/dcqz"
import SearchItem from '../common/searchItems'
import RenwuthreeTable from '../common/renwuthreeTable'
import RenwufourTable from '../common/renwufourTable'
import {bossRand} from '@/utils/ruoyi'
import Checkmx from '../common/xgmingxi.vue'
import Quanmingxi from '../common/quanmingxi.vue'
export default {
  name: "Renwutwo",
  components: {
    SearchItem,
    RenwuthreeTable,
    RenwufourTable,
    Checkmx,
    Quanmingxi
  },
  data() {
    return {
      tableHeader:[{
        prop: 'scstatus',
        label: '第三方筛查状态',
        viewFun:function(index){
          return (index?(index==1?'未开始':index==2?'执行中':index==3?'完成':''):'')
        },
        viewTemp:'button',
        noClick: function(index){
          return index==1
        }
      },{
        prop: 'rwpcid',
        label: '批次号',
        fixedWidth:30

      },{
        prop: 'jgdm',
        label: '机构代码',
        fixedWidth:55,
      },{
        prop: 'jgmc',
        label: '机构名称',
        fixedWidth:60,
      },{
        prop: 'ajly',
        label: '案件来源',
        fixedWidth:50,
        viewFun: (ajly)=>{
          return this.selectDictLabels(this.$store.getters.ajlyDic, ajly)
        },
      },{
        prop: 'ybbf',
        label: '险种',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        },
        width: 'auto',
      },{
        prop: 'jslb',
        label: '就医类型',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        },
      },{
        prop: 'jsdj',
        label: '结算等级',
        // viewFun: (jsdj)=>{
        //   return this.selectDictLabels(this.$store.getters.jsdjDic, jsdj)
        // }
      },{
        prop: 'datastarttime',
        label: '数据开始日期',
        viewFun: (time)=>{
          return this.parseTime(time,'{y}-{m}')
        }  
      },{
        prop: 'dataendtime',
        label: '数据结束日期',
        viewFun: (time)=>{
          return this.parseTime(time,'{y}-{m}')
        }  
      },{
        prop: 'xydm',
        label: '统一社会信用代码',
      },{
        prop: 'xzq',
        label: '行政区',
        viewFun: (xzq)=>{
          return this.selectDictLabels(this.xzqOptions, xzq)
        }
      },{
        prop: 'sjwgs',
        label: '涉及规则数',
      },{
        prop: 'jsry',//第二层与第三层这个key不同
        label: '涉及就诊人员数',
        hide:true
      },{
        prop: 'jsrc',
        label: '涉及结算人次数',
      },{
        prop: 'ydje',
        label: '疑点金额(元)',
        viewFun: (ydje)=>{
          return this.formatMoney(ydje,2)
        }
      }],
      xgmxOptions:{
        show:false,
        query:{}
      },
      qmxOptions:{
        show:false,
        query:{}
      },
      mxShow:false,
      isFromLuli:false,//从履历查询过来
      submitParams:{
        yxjg:'',
        wsry:'',
        wsyj:''
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //选中的数据列表
      selectionList:[],
      //第三层勾选
      threeIds:[],
      selectionThreeList:[],
      // 总条数
      total: 0,
      // renwutwo表格数据
      renwutwoList: [],
      renwuthreeList: [],
      renwufourList: [],
      // 险种字典
      ybbfOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 行政区字典
      xzqOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      tabsValue:'two',
      noThirdCheckList:[],
      resql:'',
      isRwcx:false,
      scSucces:[], //第三方筛查成功的数据
      duration:0,//每隔三秒，post一个筛查数据
      postTimmer:null,
      waitScList:[],//等待setsc的列表
      topValue:0,
      mxType:''
    };
  },
  created() {
    this.isRwcx = this.$route.query.isrwcx == 1
    this.isFromLuli = this.$route.query.fromLuli
    this.isFromLuli && (this.tabsValue='three')
    this.getList();
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  methods: {
    toggleSearch(val){
      this.topValue = val
    },
    viewSc(){
      this.$router.push({path:'/zhgl/dsfgz/fasc/scenarioConfiguration'})
    },
    checkdetail(row,key){
      const keyw = `${key}Options`
      this.mxType = key
      if(key==='xgmx'){
        const query = {
          pch:row.rwpcid,
          jgdm:row.jgdm,
          jgmc:row.jgmc
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
    async getList(options) {
      const data = this.getResql(this.tabsValue)
      if(this.tabsValue!=='two' && !this.resql && !data.resql){
        return
      }
      const params = options?{...this.queryParams,...options}:this.queryParams
      const { query } = this.$route
      params.rwpcid = query?.rwpcid
      this.isRwcx && (delete params.status)//任务查询，查询所有状态的
      this.loading = true
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            res = await listRenwuthreeRj({...params,...data})
            break;
          case 'four':
            res = await listRenwufourRj({type:1,...params,...data})
            break;
          default:
            res = await listRenwutwo({...params,status:-1})
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
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
    /** 搜索按钮操作 */
    handleQuery(query) {
      // this.tabsValue = 'two'
      this.queryParams.pageNum = 1;
      delete query.status
      if(this.mxShow && this.mxType){
        const params = {...query}
        if(params.hasOwnProperty('jgmc') && !params['jgmc']){
          console.log(this[`${this.mxType}Options`]['query']['jgmc'])
          params.jgmc = this[`${this.mxType}Options`]['query']['jgmc']
        }
        this.$refs[this.mxType].getList(params)
      } else {
        this.getList(query);
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.selectionList = selection
      const jgmc = selection.map(item => item.jgmc)
      this.submitParams.yxjg = jgmc.join(',')
      this.submitParams.wsry = selection.length?this.$store.getters.name:''
      //第三方筛查状态scstatus 3已完成
      this.noThirdCheckList  = selection.filter(item => {
        return item.scstatus != 3
      });
    },
    //第三层（中间tab）勾选
    handleThreeTableChange(selection){
      this.threeIds = selection.map(item => item.id)
      this.selectionThreeList = selection
    },
    /**
     * 实施网申
     */
    handleNetCheck(){
      const self = this
      if(!self.ids.length){
        this.msgError('请至少选择一项')
      } else if(self.noThirdCheckList.length){
        self.$confirm('当前医药机构任务未完成第三方筛查，请确认不完成第三方筛查直接实施网审/现场检查?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=> {
          self.doSubmit()
        }).catch(_=>{})
      } else {
        self.doSubmit()
      }
    },
    doSubmit(){
      submitDxqd({ids:this.ids,status:0}).then(res=>{
        this.msgSuccess("操作成功")
        this.selectionList.forEach(item=>{
          this.addJcfl({
            jglc:'网审分工',
            gjxx:``,
            rwpcid:item.rwpcid,
            jgdm:item.jgdm,
            zhczr:this.$store.getters.name,
            sort:2
          })
        })
        this.getList()
      })
    },
    /**
     * 第三方筛查
     */
    handleThirdCheck(){
      if(this.ids.length<1){
        this.msgError('请至少选择一项')
        return 
      }
      this.$confirm('是否对所选机构进行数据筛查', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=> {
        const userNmae = this.$store.getters.name
        const setSCReqestList = []
        const shujuRequestList = []
        this.selectionList.forEach(item=>{
          const {rwpcid,jgdm,jgmc,sccqstatus,datastarttime,dataendtime,jczid,id} = item;
          const time = bossRand();
          const scParams = {
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
          if(sccqstatus==0) {
            scParams.sccqstatus = 1
          }
          setSCReqestList.push(scParams)
          shujuRequestList.push({
            id,
            datastarttime,
            dataendtime,
            jgdm,
            jczid,
            createBy:userNmae,
            scrwid:[rwpcid,jgdm,time].join('-'),
            scname:[rwpcid,time,jgmc].join('-'),
            deptId:this.$store.getters.userId
          })
        })
        this.handleSanCha(setSCReqestList,shujuRequestList)
      }).catch(_=>{})
    },
    handleSanCha(scList,sjList){//执行第三方筛查
      this.loading = true
      for(let i=0;i<scList.length;i++) {
        this.scSucces.push(sjList[i])
        this.waitScList.push(scList[i])
        this.handelShuju()
        this.addJcfl({
          jglc:'数据筛查',
          gjxx:`提交批号为${scList[i].rwpcid}机构代码为${scList[i].jgdm}的第三方筛查`,
          rwpcid:scList[i].rwpcid,
          jgdm:scList[i].jgdm,
          zhczr:this.$store.getters.name,
          sort:1
        })
      }
    },
    async handelShuju(){//第三方筛查成后，post数据筛查
      if(this.duration%4!=0) {
        this.postTimmer = setTimeout(()=>{
          this.duration++
          this.handelShuju()
        },1000)
      } else {
        if(this.scSucces.length){
          this.loading = true
          const postTarget = this.scSucces.shift()
          setShujusc(postTarget).then(res=>{
            const waitSc = this.waitScList.shift()
            if(res.code===200) {
              setSancha(waitSc)
            }
          }).catch(()=>{
            this.waitScList.shift()
          })
          this.duration++
          this.handelShuju()
        } else {
          clearTimeout(this.postTimmer)
          this.postTimmer = null
          this.duration = 0
          this.loading = false
          this.$router.push({path:'/zhgl/dsfgz/fasc/scenarioConfiguration'})
        }
      }
    },
    getResql(val){
      const resql = []
      let params = {
        resql:''
      }
      if(this.ids.length && (val==='three'||(val==='four'&& this.threeIds.length===0))){
        this.selectionList.forEach(item=>{
          resql.push(`(rwpcid='${item.rwpcid}' and jgdm='${item.jgdm}')`)
        })
       params = {resql:resql.join(' or ')}
      } else if(val==='four' && this.threeIds.length){//勾选了第三层，则用勾选的参数去查第四层
        this.selectionThreeList.forEach(item=>{
          resql.push(`(rwpcid='${item.rwpcid}' and jgdm='${item.jgdm}' and gzmc='${item.gzmc}')`)
        })
        params = {resql:resql.join(' or ')}
      } else {
        this.ids = []
        if(this.resql){
          params = {resql:this.resql}
        }
      }
      return params
    },
    /**
     * tabs切换
     */
    tabsLevelChange(val){
      this.mxShow = false
      this.qmxOptions.show=false
      this.xgmxOptions.show=false
      this.queryParams.pageNum = 1
      this.total = 0
      val!=='four' && (this.threeIds=[])
      this.getList()
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs-part {
  clear: both;
}
.table-main,.table-main1{
  position: absolute;
  bottom:40px;
  left: 20px;
  right: 20px;
}
.table-main {
  top:160px;
}
.table-main1 {
  top:60px;
}
.fixed-bottom {
  position: absolute;
  bottom:5px;
  right: 0px;
}
</style>