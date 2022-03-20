<template>
  <div class="app-container">
    <SearchItem @handleQuery="handleQuery" @toggle-search="h=>topValue=h"/>
    <div class="table-main" :style="{top:topValue}">
      <el-row :gutter="10" class="mb8" style="margin-bottom:5px">
        <el-col :span="1.5" v-if="tabsValue==='two'">
          <el-button
            type="primary"
            size="small"
            @click="handleAgree(2)"
          >确认</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='two'">
          <el-button
            type="primary"
            size="small"
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
      <div v-loading="loading" v-show="!mxShow" style="height:calc(100% - 37px)">
        <RenwuthreeTable v-if="tabsValue==='three'" :tableData="renwuthreeList"  @check-xgmx="checkMix($event,'xgmx')"/>
        <RenwufourTable v-else-if="tabsValue==='four'" :tableData="renwufourList" @check-xgmx="checkMix($event,'xgmx')"/>
        <RenwutwoTable v-else :tableData="renwutwoList" @check-xgmx="checkMix($event,'xgmx')"  @check-qmx="checkMix($event,'qmx')" @handleSelectionChange="handleSelectionChange"/>
      </div>
       <div v-show="mxShow" style="height:calc(100% - 37px)">
        <checkmx :options="xgmxOptions" v-if="xgmxOptions.show"/>
        <quanmingxi :options="qmxOptions" v-if="qmxOptions.show" />
      </div>
    </div>
    <pagination
     class="fixed-bottom"
      v-show="!mxShow"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- <el-form v-show="!mxShow && tabsValue==='two'" size="small" :model="submitParams" :rules="rules" ref="submitForm" :inline="true" style="margin-top:5px;">
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
            label="同意"
            value="2"
          />
          <el-option
            key="2"
            label="驳回"
            value="0"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检查人员" prop="wsry">
        <el-input readonly :value="submitParams.wsry"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="handleSubmit" :disabled="ids.length<1">提交</el-button>
      </el-form-item>
    </el-form> -->
  </div>
</template>
<script>
import { listRenwutwo, updateRenwutwo} from "@/api/renwu/renwutwo"
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
      topValue:0,
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
      //
      tabsValue:'two',
      resql:'',
      rules: {
        yxjg:[{require:true,message:'请选择机构'}],
        wsry:[{require:true,message:'请选择检查人员'}],
        wsyj:[{require:true,message:'请选网审意见'}]
      },
      submitParams:{
        yxjg:'',
        wsry:'',
        wsyj:''
      },
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
      const data = this.getResql()
      if(this.tabsValue!=='two' && !this.resql && !data.resql){
        return
      }
      const params = query?{...this.queryParams,...query}:this.queryParams
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
    async updateTwo(ids){//提交暂不检查的，把第二层status改成4
      ids.forEach(item=>{
        updateRenwutwo({id:item.id,status:4},'innoreError')
      })
    },
    handleSubmit(){
      this.handleAgree(this.submitParams.wsyj)
    }, 
    /**
     * 实施网申 type:2同意 0驳回
     */
    handleAgree(type){
      if(!this.ids.length){
        this.msgError('请至少选择一项')
        return
      } 
      if(type==2){
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
      // this.doSubmit({
      //   ids:this.ids,
      //   status:0,//同意2 ，驳回0
      //   dxqd:'驳回',
      //   dxqdbh:value//驳回意见字段
      // })
    },
    doSubmit(params){
      submitDxqd(params).then(res=>{
        this.msgSuccess("操作成功")
        this.getList()
        this.selectionList.forEach(item=>{
            this.addJcfl({
              jglc:'对象确定',
              gjxx:`确定意见:${params.status?'同意':'驳回'}`,
              rwpcid:item.rwpcid,
              jgdm:item.jgdm,
              zhczr:this.$store.getters.name,
              sort:4
            })
        })
        if(params.status===2){//同意
          const nowsyj = this.selectionList.filter(item=>{
            return item.wsyj === '暂不检查'
          })
          if(nowsyj && nowsyj.length){
            this.updateTwo(nowsyj)
          }
        }
      })
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
    /**
     * tabs切换
     */
    tabsLevelChange(val){
      this.queryParams.pageNum = 1
      this.total = 0
      this.mxShow = false
      this.qmxOptions.show=false
      this.xgmxOptions.show=false
      if(val==='two'){
        this.ids = []
      }
      this.getList()
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
  bottom:45px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:8px;
  right: 0px;
}
</style>