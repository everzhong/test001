<template>
  <div style="height:100%;position:relative" v-loading="loading">
    <el-row style="position:absolute;left:0;top:-37px">
      <el-col :span="1.5">
        <el-button type="default"  size="small" @click="handleBack">返回上一层</el-button>
      </el-col>
    </el-row>
  <liushui-table :noRadio="true" ref="liuShuiTable" v-if="tabsValue==='four'&&serachOptions.type==1" :tableData="lshTable" :noLog="true"  @checkdetail="tongLiushuimx"></liushui-table>
  <jxchslstable :noRadio="true" ref="jxclsTable" v-if="tabsValue==='four'&&serachOptions.type==2" :tableData="lshTable" :noLog="true" ></jxchslstable>
  <tongliumx ref="tongLiumx" v-if="tabsValue==='five'" :tableData="tlshTable"></tongliumx>
  <sTable v-if="tabsValue==='three'" :data="renwufourList" :header="tableHeader" :fixedNum="1" style="height:100%">
    <el-table-column label="序号" type="index" width="55" align="center" slot="fixed"/>
     <el-table-column label="操作" fixed="right" align="center" width="150" slot="operate">
      <template slot-scope="scope">
        <el-button size="mini" type="text" primary @click="hangdleLiushui(scope.row)">流水号项目汇总</el-button>
      </template> 
     </el-table-column>
  </sTable>
  <pagination
      class="fixed-bottom"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
</div>
</template>
<script>
import { listXcjg } from "@/api/renwu/renwufour";
import LiushuiTable from '../jianchass/liushiTable.vue'
import Tongliumx from '../jianchass/tongliumx.vue'
import jxchslstable from './jxchslstable.vue'
import { listRenwufour } from '@/api/renwu/renwufour'
import { getTLS} from '@/api/renwu/mingxi'
export default {
  name:'ViewTable',
  components:{
    LiushuiTable,
    Tongliumx,
    jxchslstable
  },
  data(){
    return {
      tableHeader:[{
        prop: 'ybbf',
        label: '险种',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        },
        width:'auto'
      },{
        prop: 'jslb',
        label: '就医类型',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        },
        width:'auto'
      },{
        prop: 'gzly',
        label: '疑点来源',
        viewFun:(gzly)=>{
          return gzly?gzly:'规则筛查'
        }
      },{
        prop: 'mxxmbm',
        label: '医保项目编码',
      },{
        prop: 'mxxmmc',
        label: '明细项目名称',
        fixedWidth:40,
      },{
        prop: 'mxxmdj',
        label: '标准单价(元)',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,2)
        }
      },{
        prop: 'mxxmdw',
        label: '计价单位',
      },{
        prop: 'mxxmjyfy',
        label: '医院单价(元)',
        viewFun: (mxxmjyfy)=>{
          return this.formatMoney(mxxmjyfy,2)
        }
      },{
        prop: 'zkdj',
        label: '追款单价(元)',
        viewFun: (zkdj)=>{
          return this.formatMoney(zkdj,2)
        }
      },{
        prop: 'wgsl',
        label: '违规数量',
        fixedWidth:55,
      },{
        prop: 'wgfy',
        label: '违规费用(元)',
        viewFun: (wgfy)=>{
          return this.formatMoney(wgfy,2)
        }
      },{
        prop: 'xwrd',
        label: '行为认定',
        fixedWidth:40,
      }],
      loading:true,
      queryParams:{
        pageNum:1,
        pageSize:50
      },
      total:0,
      renwufourList:[],
      lshTable:[],
      tlshTable:[],
      ybbfOptions:[],
      jslbOptions:[],
      tabsValue:'three',
      serachOptions:{},
    }
  },
  created(){
    this.getList()
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic

  },
  methods:{
    handleBack(){
      if(this.tabsValue==='five'){
        this.tabsValue='four'
      } else if(this.tabsValue==='four') {
        this.tabsValue = 'three'
      } else {
        this.$emit('click-back')
      }
    },
    hangdleLiushui(row){
      this.total = 0
      this.queryParams.pageNum = 1
      this.tabsValue='four'
      this.serachOptions = {
        rwpcid:row.rwpcid,
        jgdm:row.jgdm,
        gzmc:row.gzmc,
        hs:row.hs,
        type:row.type,
        mxxmdj:row.mxxmdj,
        mxxmbmjg:row.mxxmbm,
        ybbf:row.ybbf,
        xwrdjg:row.xwrd
      }
      this.getList()
    },
    tongLiushuimx(row){
      this.total = 0
      this.queryParams.pageNum = 1
      this.tabsValue='five'
      this.serachOptions = {lsh:row.lsh,mxxmbm:row.mxxmbm,type:row.type}
      this.getList()
    },
    getList(){
      this.loading = true
      if(this.tabsValue=='four'){
        listRenwufour({...this.queryParams,...this.serachOptions}).then(res=>{
          this.loading = false
          if(res.code==200){
            this.lshTable = res.rows
            this.total = res.total
          }
        }).catch(e=>{
           this.loading = false;
        })
      } else if(this.tabsValue=='five'){
        const params = {...this.queryParams,...this.serachOptions}
        delete params.type//查询通流水数据，不需要type
        getTLS(params).then(res=>{
          this.loading = false
          if(res.code==200){
            this.tlshTable = res.rows
            this.total = res.total
          }
        }).catch(e=>{
           this.loading = false;
        })
      } else {
        const params = {...this.queryParams,...this.options}
        listXcjg(params).then(response => {
          this.renwufourList = response.rows;
          this.total = response.total;
          this.loading = false;
        }).catch(e=>{
          this.loading = false;
        });
      }
      
    },
  },
  props:['options']
}
</script>
<style lang="scss" scoped>
.fixed-bottom {
  position: absolute;
  bottom:-40px;
  right: 0px;
}
</style>