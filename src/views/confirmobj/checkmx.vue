<template>
    <div style="height:100%;width:100%">
      <sTable v-loading="loading" :data="tableData" :header="tableHeader" :fixedNum="1">
        <el-table-column label="序号" type="index" align="center" slot="fixed"/>
      </sTable>
    <pagination
        style="float:right"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :pageSizes="[50,100,150,200]"
        size="small"
        @pagination="getList"
      />
    </div>
    <!-- </el-drawer> -->
</template>
<script>
import { getXGMX } from "@/api/renwu/mingxi";
export default {
  name:'Quanmx',
  data() {
    return{
      loading:false,
      tableData:[],
      total:0,
      queryParams:{
        pageNum:1,
        pageSize:50
      },
      tableHeader:[{
        prop: 'pch',
        label: '批次号'
      },{
        prop: 'jgdm',
        label: '机构代码',
      },{
        prop: 'jgmc',
        label: '机构名称',
      },{
        prop: 'gzmc',
        label: '规则分类',
      },{
        prop: 'gzmc2',
        label: '规则名称',
      },{
        prop: 'ysgh',
        label: '医师代码',
      },{
        prop: 'ysxm',
        label: '医师姓名',
      },{
        prop: 'kh',
        label: '参保人卡号',
      },{
        prop: 'xm',
        label: '参保人姓名',
      },{
        prop: 'ybbf',
        label: '险种',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        }
      },{
        prop: 'jslb',
        label: '就医类型',
        viewFun: (jslb)=>{
          return this.selectDictLabels(this.jslbOptions, jslb);
        }
      },{
        prop: 'jyrq',
        label: '结算日期',
        width: '180px',
        viewFun: (jyrq)=>{
          return this.parseTime(jyrq,'{y}-{m}-{d}')
        }
      },{
        prop: 'mxxmbm',
        label: '明细项目编号',
      },{
        prop: 'mxxmmc',
        label: '明细项目名称',
      },{
        prop: 'tym',
        label: '通用名',
      },{
        prop: 'mxxmdj',
        label: '明细项目单价(元)',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,3)
        }
      },{
        prop: 'mxxmsl',
        label: '明细项目数量',
        width: 'auto'
      },{
        prop: 'mxxmje',
        label: '明细项目金额(元)',
        viewFun: (mxxmje)=>{
          return this.formatMoney(mxxmje,2)
        }  
      },{
        prop: 'mxxmjyfy',
        label: '明细项目交易金额(元)',
        viewFun: (mxxmjyfy)=>{
          return this.formatMoney(mxxmjyfy,2)
        }  
      },{
        prop: 'mxxmybjsfy',
        label: '明细项目医保结算金额(元)',
        viewFun: (mxxmybjsfy)=>{
          return this.formatMoney(mxxmybjsfy,2)
        }  
      },{
        prop: 'fylb',
        label: '费用类别',
        viewFun: (fylb)=>{
          return this.selectDictLabels(this.$store.getters.fyDic, fylb)
        },
        width: 'auto'
      }]
    }
  },
  props:['options'],
  created(){
    this.getList()
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  methods:{
    fylbFormat(row, column) {
      return this.selectDictLabels(this.$store.getters.fyDic, row.fylb);
    },
     // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    /** 查询renwuthree列表 */
    async getList(query) {
      this.loading = true
      let params = {...this.options.query,...this.queryParams}
      query && (params={...params,...query})
      try {
        const res = await getXGMX(params)
        this.tableData = res.rows;
        this.total = res.total;
      } catch (error) {
        console.log(error)
      }
      this.loading = false;
    },
  },
  watch:{
    'options.show'(n){
      if(n){
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sys-drawer {
  &::v-deep .el-drawer {
    height: 400px !important;
    .el-drawer__header {
      padding: 0;
      margin-bottom: 0;
    }
  }
}
</style>