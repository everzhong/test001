<template>
  <div style="height:100%" v-loading="loading">
  <sTable :data="renwufourList" :header="tableHeader" :fixedNum="1" style="height:calc(100% - 70px)">
    <el-table-column label="序号" type="index" width="55" align="center" slot="fixed"/>
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
 
export default {
  name:'ViewTable',
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
        prop: 'jcfs',
        label: '检查方式',
        width:'auto'
      },{
        prop: 'mxxmbm',
        label: '医保项目编码',
      },{
        prop: 'gzmc',
        label: '项目名称',
        fixedWidth:40,
      },{
        prop: 'mxxmdj',
        label: '标准单价(元)',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,3)
        }
      },{
        prop: 'mxxmdw',
        label: '计价单位',
      },{
        prop: 'mxxmjyfy',
        label: '医院单价(元)',
        viewFun: (mxxmjyfy)=>{
          return this.formatMoney(mxxmjyfy,3)
        }
      },{
        prop: 'zkdj',
        label: '追款单价(元)',
        viewFun: (zkdj)=>{
          return this.formatMoney(zkdj,3)
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
    }
  },
  created(){
    this.getList()
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic

  },
  methods:{
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
  bottom:30px;
  right: 0px;
}
</style>