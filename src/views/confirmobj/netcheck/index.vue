<template>
  <div class="app-container container_1">
    <SearchItem ref="searchForm" @handleQuery="handleQuery" @toggle-search="h=>tableHeight = h" :disabled="mxShow||tabsValue!='two'"/>
    <div :class="['table-main',tabsValue!=='two'||mxShow?'table-main1':'']" :style="{top:tableHeight}">
      <el-row :gutter="10" class="mb8" style="margin-bottom:5px">
        <div class="top-right-btn">
            <el-radio-group v-model="tabsValue" size="small" @change="tabsLevelChange">
              <el-radio-button label="two">任务列表</el-radio-button>
              <el-radio-button label="three">任务列表-规则列表</el-radio-button>
              <el-radio-button label="four">规则筛查-项目汇总</el-radio-button>
            </el-radio-group>
          <el-col :span="1.5" v-if="mxShow">
            <el-button
              type="default"
              size="small"
              
              @click="mxShow=false,qmxOptions.show=false,xgmxOptions.show=false"
            >返回上一层</el-button>
          </el-col>
        </div>
      </el-row>
      <div v-loading="loading"  v-show="!mxShow && tabsValue==='two'" style="height:calc(100% - 37px)">
        <RenwutwoTable v-if="tabsValue==='two'" :tableData="renwutwoList"  @check-mx="checkMix" @handleSelectionChange="handleSelectionChange"/>
      </div>
      <div v-loading="loading"  v-show="tabsValue!=='two'||mxShow" style="height:calc(100% - 37px)">
        <RenwuthreeTable v-if="tabsValue==='three'&!mxShow" :tableData="renwuthreeList" @check-xgmx="checkMix($event,'xgmx')"/>
        <RenwufourTable  v-if="tabsValue==='four'&!mxShow" :tableData="renwufourList" @check-xgmx="checkMix($event,'xgmx')"/>
        <checkmx :options="xgmxOptions" v-if="xgmxOptions.show"/>
        <quanmingxi :options="qmxOptions" v-if="qmxOptions.show" />
      </div>
    </div>
    <div class="fixed-bottom">
      <pagination
        v-show="!mxShow"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
      <el-form v-show="!mxShow && tabsValue==='two'" size="small" :model="submitParams" :rules="rules" ref="submitForm" :inline="true" style="padding-left:20px;">
        <el-form-item label="已选机构" prop="yxjg">
          <el-input
            style="width:280px;"
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
              label="暂不检查"
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
    </div>
  </div>
</template>
<script>
import { listRenwutwo,submitNetCheck} from "@/api/renwu/renwutwo"
import { listRenwuthreeRj } from '@/api/renwu/renwuthree'
import { listRenwufourRj } from '@/api/renwu/renwufour'
import SearchItem from '../../common/objSearchItem'
import RenwutwoTable from './tables/renwutwoTable'
import RenwuthreeTable from './tables/renwuthreeTable'
import RenwufourTable from './tables/renwufourTable'
import Checkmx from '../checkmx.vue'
import Quanmingxi from '../../common/quanmingxi.vue'
export default {
  name: "Netcheck",
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
      tableHeight:0,
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
      // 选中数组
      ids: [],
      selectionList:[],
      // 总条数
      total: 0,
      // renwutwo表格数据
      renwutwoList: [],
      renwuthreeList: [],
      renwufourList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        yxjg:[{require:true,message:'请选择机构'}],
        wsry:[{require:true,message:'请选择检查人员'}],
        wsyj:[{require:true,message:'请选网审意见'}]
      },
      //
      tabsValue:'two',
      submitParams:{
        yxjg:'',
        wsry:'',
        wsyj:''
      },
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
    getResql(){
      let params = {
        resql:''
      }
      if(this.tabsValue!=='two'){
        if(this.ids.length) {
          const resql = []
          this.selectionList.forEach(item=>{
            resql.push(`(rwpcid='${item.rwpcid}' and jgdm='${item.jgdm}')`)
          })
          params = {resql:resql.join(' or ')}
        } else {
          this.resql && (params ={resql:this.resql})
        }
      }
      return params
    },
    /** 查询renwutwo列表 */
    async getList(query) {
      const data = this.getResql()
      if(this.tabsValue!=='two' && !this.resql && !data.resql){
        return
      }
      const params = query?{...this.queryParams,...query}:this.queryParams
      delete params.status
      this.loading = true
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            res =  await listRenwuthreeRj({...params,...data})
            break;
          case 'four':
            res = await listRenwufourRj({type:1,...params,...data})
            break;
          default:
            params.status = 0 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
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
    /** 搜索按钮操作 */
    handleQuery(query) {
      this.queryParams.pageNum = 1;
      this.getList(query);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.submitParams.yxjg = (selection.map(item => item.jgmc)).join(' ')
      this.submitParams.wsry = this.$store.getters.name
      this.ids = selection.map(item => item.id)
      this.selectionList = selection
    },
    /**
     * 实施网申
     */
    handleNetCheck(){
      if(!this.ids.length){
        this.msgError('请至少选择一项')
      } else if(!this.submitParams.wsyj) {
        this.msgError('请选择网审意见')
      } else {
        submitNetCheck({ids:this.ids,wsry:this.submitParams.wsry,wsyj:this.submitParams.wsyj}).then(async res=>{
          if(res.code===200){
            this.msgSuccess('提交成功')
            this.getList()
            this.selectionList.forEach(item=>{
              this.addJcfl({
                jglc:'实施网审',
                gjxx:`网审意见：${this.submitParams.wsyj}；网审人员：${this.submitParams.wsry}`,
                rwpcid:item.rwpcid,
                jgdm:item.jgdm,
                zhczr:this.$store.getters.name,
                sort:3
              })
            })
          }
        })
      }
    },
    /**
     * tabs切换
     */
    tabsLevelChange(val){
      this.queryParams.pageNum = 1
      this.total = 0
      this.mxShow = false
      this.xgmxOptions.show=false
      this.qmxOptions.show=false
      if(val!=='two'){
      } else {
        this.ids = []
      }
      this.getList()
      this.submitParams.yxjg = ''
    },
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  &::v-deep .el-form-item {
    margin-bottom: 0px;
  }
}
.tabs-part {
  clear: both;
}
.table-main {
  position: absolute;
  left:20px;
  right:20px;
  top:178px;
  bottom:96px;
}
.table-main1 {
  bottom:45px;
}
.fixed-bottom {
  position: absolute;
  width: 100%;
  bottom:8px;
  right: 0px;
}
</style>