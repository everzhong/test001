<template>
  <div style="height:100%" v-loading="loading">
  <sTable :data="renwufourList" :header="tableHeader" :fixedNum="1" style="height:100%">
    <el-table-column label="序号" type="index" width="55" align="center" slot="fixed"/>
     <!-- <template slot-scope="scope">
      <el-button size="mini" type="text" primary @click="hangdleLiushui(scope.row)">流水号项目汇总</el-button>
    </template>  -->
  </sTable>
  <!-- <liushui-table v-if="showLiushui" ref="liuShuiTable" :fromLog="queryInfoFrom.fromLuli" :tableData="renwufourList" @radio-change="handleSelectionChange" @checkdetail="tongLiushuimx" @on-log="checkLog"></liushui-table> -->
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
// import LiushuiTable from '../jianchass/liushiTable.vue'

export default {
  name:'ViewTable',
  // components:{
  //   LiushuiTable
  // },
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
        label: '检查方式',
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
      ybbfOptions:[],
      jslbOptions:[]
      // showLiushui:false
    }
  },
  created(){
    this.getList()
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic

  },
  methods:{
    // hangdleLiushui(){

    // },
    getList(){
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
  props:['options']
}
</script>
<style lang="scss" scoped>
.fixed-bottom {
  position: absolute;
  bottom:8px;
  right: 0px;
}
</style>