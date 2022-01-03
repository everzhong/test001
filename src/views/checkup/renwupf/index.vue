<template>
  <div class="app-container">
    <SearchItem @handleQuery="handleQuery" style="height:82px"/>
    <div class="middle-btn">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5" v-if="tabsValue==='two'">
          <el-button
            type="primary"
            size="small"
            @click="handleNetCheck"
          >派发检查组</el-button>
        </el-col>
        <el-col :span="1.5" v-if="mxShow">
          <el-button
            type="warning"
            size="small"
            plain
            @click="qmxOptions.show=false,xgmxOptions.show=false,mxShow=false"
          >返回上一层</el-button>
        </el-col>
        <div class="top-right-btn">
          <el-radio-group v-model="tabsValue" size="small" @change="tabsLevelChange">
            <el-radio-button label="two" value="two">任务列表</el-radio-button>
            <el-radio-button label="three" value="three">任务列表-规则列表</el-radio-button>
            <el-radio-button label="four" value="four">任务列表-项目列表</el-radio-button>
          </el-radio-group>
        </div>
      </el-row>
    </div>
    <div v-loading="loading" class="table-main" v-show="!mxShow">
      <RenwuthreeTable v-if="tabsValue==='three'" :tableData="renwuthreeList" @check-xgmx="checkMingx($event,'xgmx')"/>
      <RenwufourTable v-if="tabsValue==='four'" :tableData="renwufourList" @check-xgmx="checkMingx($event,'xgmx')"/>
      <RenwutwoTable v-if="tabsValue==='two'" :tableData="renwutwoList" @handleSelectionChange="handleSelectionChange" @check-xgmx="checkMingx($event,'xgmx')" @check-qmx="checkMingx($event,'qmx')" :showEdit="true"/>
    </div>
    <div class="table-main" v-show="mxShow">
      <quanmingxi :options="qmxOptions" v-if="qmxOptions.show"/>
      <checkmx :options="xgmxOptions" v-if="xgmxOptions.show"/>
    </div>
    <pagination
      class="fixed-bottom"
      v-show="!mxShow"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <sendMessage :options="sendNotice" v-if="sendNotice.show" @on-confirm="submitQd"/>
  </div>
</template>
<script>
import { listRenwutwo,submitJcz } from "@/api/renwu/renwutwo"
import { listRenwuthreeRj } from '@/api/renwu/renwuthree'
import { listRenwufourRj } from '@/api/renwu/renwufour'
import SearchItem from '../../common/objSearchItem'
import RenwutwoTable from './tables/renwutwoTable'
import RenwuthreeTable from './tables/renwuthreeTable'
import RenwufourTable from './tables/renwufourTable'
import sendMessage from './sendMessage.vue'
import Checkmx from '../../common/xgmingxi.vue'
import Quanmingxi from '../../common/quanmingxi.vue'
export default {
  name: "Renwupf",
  components: {
    SearchItem,
    RenwutwoTable,
    RenwuthreeTable,
    RenwufourTable,
    sendMessage,
    Quanmingxi,
    Checkmx
  },
  data() {
    return {
      qmxOptions:{
        show:false,
        query:{}
      },
      xgmxOptions:{
        show:false,
        query:{}
      },
      mxShow:false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      selection:[],
      // 总条数
      total: 0,
      // renwutwo表格数据
      renwutwoList: [],
      renwuthreeList: [],
      renwufourList: [],
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
      //派发检查组
      sendNotice:{
        show:false,
        ids:[]
      },
      resql:''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    submitQd(xiaozu){
      const jczlist = typeof(xiaozu.jczcy)==="object"?xiaozu.jczcy:(JSON.parse(xiaozu.jczcy.replace(/'/g,'"').replace(/userId/g,'"userId"').replace(/nickName/g,'"nickName"').replace(/userName/g,'"userName"')))
      let userIdList = []
      let nameList = []
      let userNameList = []
      if(jczlist.length){
        userIdList = jczlist.map(item=>item.userId)
        nameList = jczlist.map(item=>item.nickName)
        userNameList = jczlist.map(item=>item.userName)
      }
      submitJcz({
        ids:this.ids,
        jczid:userIdList.join(','),
        deptId:xiaozu.deptId,
        jczname:xiaozu.deptName
      }).then(res=>{
        if(res.code===200){
          this.msgSuccess('派发成功')
          this.getList()
          this.selection.forEach(item=>{
            this.addJcfl({
              jglc:'任务派发',
              gjxx:`派发任务到 ${xiaozu.deptName} 检查组，成员：${nameList.join(',')}`,
              rwpcid:item.rwpcid,
              jgdm:item.jgdm,
              zhczr:this.$store.getters.name,
              xydm:item.xydm,
              jgmc:item.jgmc,
              sort:5,
              zfbmmc:xiaozu.deptName,
              zfrymc:nameList.join(','),
              zfrygh:userNameList.join(',')
            })
          })
        } else {
          this.msgError('派发失败')
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
          this.resql && (params = {resql:this.resql})
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
            params.status = 2 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
            res = await listRenwutwo(params)
            break;
        }
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows;
          this.total = res.total;
          if(this.tabsValue === 'two'){
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
      this.ids = selection.map(item => item.id)
      this.selection = selection
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /**
     * 实施网申
     */
    handleNetCheck(){
      if(!this.ids.length){
        this.msgWarning('请至少选择一项')
      } else {
        this.sendNotice.ids = this.ids
        this.sendNotice.show = true
      }
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
    checkMingx(row,key){
      const keyw = `${key}Options`
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
    }
  }
};
</script>
<style lang="scss" scoped>
.middle-btn {
 margin-top: 5px;
}
.tabs-part {
  clear: both;
}
.table-main {
  position: absolute;
  top:146px;
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