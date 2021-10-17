<template>
  <div class="hssz" style="height:100%">
    <div class="hssz-top">
      <div class="title">规则汇总数据</div>
      <el-row :gutter="10">
        <el-col :span="1.5" v-if="tabsValue!=='three'">
          <el-button type="warning" plain size="small" @click="goBackUpLevel">返回上一层</el-button>
        </el-col>
        <el-col :span="1.5">
          <span style="margin-right:10px;font-size:14px;color:#606266">参保人</span>
          <el-select v-model="queryForm.ybd" size="small" @change="ybdChange" style="width:100px">
            <el-option label="本地" value="01"></el-option>
            <el-option label="异地" value="02"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="chaxunDialog = true">查询条件</el-button>
        </el-col>
      </el-row>
    </div>
    <div :class="[tabsValue==='four'?'four-type':'nor-type']"  v-loading="loading">
      <el-table v-show="tabsValue==='three'" class="qztable" style="margin-top:10px" :data="renwuthreeList" border height="100%"> 
        <el-table-column  align="center" width="55">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="rwCheck" @change="radioChange"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" align="center"/>
        <el-table-column label="规则分类" align="center" prop="gzfl" :width="flexColumnWidth('gzfl',renwuthreeList)"/>
        <el-table-column label="规则名称" align="center" prop="gzmc"  width="350" show-overflow-tooltip/>
        <el-table-column label="涉及就诊人次数" align="center" prop="xjjzrs"  :width="flexColumnWidth('xjjzrs',renwuthreeList)"/>
        <el-table-column label="涉及明细数" align="center" prop="xjmxs"  :width="flexColumnWidth('xjmxs',renwuthreeList)"/>
        <el-table-column label="涉及金额(元)" align="center" prop="xjje"  :width="flexColumnWidth('xjje',renwuthreeList)">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.xjje,2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算总费用" align="center" prop="jsfy"  :width="flexColumnWidth('jsfy',renwuthreeList)">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.jsfy,2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="确定核实时间" align="center" prop="hssj" :width="flexColumnWidth('hssj',renwuthreeList)">
          <template slot-scope="scope">
            <span>{{parseTime(scope.row.hssj,'{y}-{m}-{d} {h}:{m}:{s}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="核实状态" align="center" prop="hszt"  :width="flexColumnWidth('hszt',renwuthreeList)"/>
        <el-table-column label="核实意见" align="center" prop="hsr" show-overflow-tooltip/>
        <el-table-column label="核实人" align="center" prop="hsr"  :width="flexColumnWidth('hsr',renwuthreeList)"/>
        <el-table-column label="核实时间" align="center" prop="hspfsj" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{parseTime(scope.row.hspfsj,'{y}-{m}-{d} {h}:{m}:{s}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="hspfsj" width="150">
          <template>
            <el-button type="text" size="mini" @click="checkLiushui">流水号项目汇总</el-button>
          </template>
        </el-table-column>
      </el-table>
      <liushui-table ref="liuShuiTable" v-if="tabsValue==='four'" :tableData="renwufourList" :noLog="true"  @checkdetail="tongLiushuimx"></liushui-table>
      <tongliumx ref="tongLiumx" v-if="tabsValue==='five'" :tableData="renwufiveList"></tongliumx>
      <pagination
        style="float:right"
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :pageSizes="[50,100,150,200]"
        size="small"
        @pagination="getList"
      />
    </div>
    <div class="bottom-dec" v-if="tabsValue==='four'">
      <p>规则名称：{{selection.gzmc}}</p>
      <div><span>情况说明：{{selection.qksm}}</span><span>相关资料：{{selection.xgzl}}</span></div>
    </div>
    <!-- 查询条件 -->
    <el-dialog title="查询条件" class="msg-dialog" :visible.sync="chaxunDialog" width="650px" :modal="false">
      <el-form ref="chaxunForm" :model="queryForm"  label-width="100px" size="small">
        <el-form-item label="规则分类" prop="gzfl">
          <el-input clearable v-model="queryForm.gzfl" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="规则名称" prop="gzmc">
          <el-input clearable v-model="queryForm.gzmc" placeholder="请输入" style="width:360px"></el-input>
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
  </div>
</template>
<script>
import { listRenwuthree } from '@/api/renwu/renwuthree'
import { listRenwufour } from '@/api/renwu/renwufour'
import { getTLS,getQMX} from '@/api/renwu/mingxi'
import LiushuiTable from './liushiTable.vue'
import Tongliumx from './tongliumx.vue'
export default {
  name:"CheckHssz",
  components:{
    LiushuiTable,
    Tongliumx
  },
  data(){
    return {
      loading:false,
      chaxunDialog:false,
      rwCheck:'',
      renwuthreeList:[],
      renwufourList:[],
      renwufiveList:[],
      queryParams:{
        pageSize:50,
        pageNum:1
      },
      queryForm:{
        ybd:'01',
        gzmc:'',
        gzfl:'',
        xwrd:'',
        hszt:null
      },
      total:0,
      hsztOptions:[
        {dictValue:'0',dictLabel:'未核实'},
        {dictValue:'1',dictLabel:'核实中'},
        {dictValue:'2',dictLabel:'已核实'}
      ],
      selection:{},
      queryInfoFrom:{},
      tabsValue:'three',
      lsh:''
    }
  },
  created(){
    this.queryInfoFrom = this.$route.query
    this.getList()
  },
  methods:{
    //返回上一层
    goBackUpLevel(){
      this.selectedId = ''
      switch(this.tabsValue) {
        case ('five'):
          this.tabsValue = 'four'
          this.lsh = ''
          break
        case 'four':
          this.tabsValue = 'three'
          break
        default :
         break
      }
    },
    checkLiushui(){
      this.total = 0
      this.queryParams.pageNum=1
      this.tabsValue = 'four'
      const {jgdm,datastarttime,dataendtime} = this.queryInfoFrom
      this.searchNextParams = {
        jgdm:jgdm,
        zdbm:this.parseTime(datastarttime, '{y}{m}'),
        zdbm1:this.parseTime(dataendtime, '{y}{m}')
      }
      this.getList()
    },
    tongLiushuimx(row){
      this.tabsValue = 'five'
      this.lsh = row.lsh || ''
      this.searchNextParams = {lsh:row.lsh||''}
      this.getList()
    },
    async getList(query) {
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
            res = await listRenwufour(params)
            break;
          case 'five':
            res = await getTLS({...this.queryParams,...this.searchNextParams})
            break;
          default:
            // params.statu = 2 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
            // res = await listRenwutwo(params)
            break;
        }
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows;
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
    // async getList(query){
    //   let params ={...this.queryParams,...this.queryForm}
    //   query&&(params = {...params,...query})
    //   this.loading = true
    //   const res = await listRenwuthree(params)
    //   if(res.code===200){
    //     this.tableData = res.rows;
    //     this.total = res.total;
    //   }
    //   this.loading = false
    // },
    ybdChange(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    radioChange(val){
      this.selection = this.tableData.filter(item=>{
        return item.id === val
      })[0]
    }
  }

}
</script>
<style lang="scss" scoped>
.hssz {
  .hssz-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    .title {
      font-size: 14px;
      color: #606266;
    }
  }
  .bottom-dec {
    font-size: 14px;
    color:#606266;
    div>span{
      display: inline-block;
      width: 50%;
    }
  }
}
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
  }
  .four-type {
    height:calc(100% - 170px);
    margin-bottom:60px
  }
  .nor-type {
    height:calc(100% - 100px);
    margin-bottom:60px
  }
</style>