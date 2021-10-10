/**项目流水号汇总 第5层数据*/
<template>
  <!-- <el-table v-show="!showLog" class="qztable" :row-class-name="tableRowClassName"  ref="multipleTable" :data="tableData" border height="100%" style="width:100%"> -->
  <sTable v-show="!showLog" :data="tableData" :header="tableHeader" :fixedNum="1" :isrowClassName="true">
    <el-table-column label="序号" type="index" align="center"  slot="fixed"/>
  </sTable>
</template>
<script>
export default {
  name:'Tongliumx',
  data(){
    return {
      wsCheck:'',
      showLog:false,
      logList:[],
      tableHeader:[{
        prop: 'jslb',
        label: '就医类型',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        },
        width: 'auto'
      },{
        prop: 'ybbf',
        label: '险种',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        },
        width: 'auto'
      },{
        prop: 'lsh',
        label: '交易流水号',
      },{
        prop: 'kh',
        label: '参保人卡号',
      },{
        prop: 'xm',
        label: '参保人姓名',
        width: 'auto'
      },{
        prop: 'ksdm',
        label: '科室代码',
      },{
        prop: 'ksmc',
        label: '科室名称',
      },{
        prop: 'ysgh',
        label: '医师代码',
      },{
        prop: 'ysxm',
        label: '医师姓名',
      },{
        prop: 'jyrq',
        label: '结算日期',
        width: '110px',
        viewFun: (jyrq)=>{
          return this.parseTime(jyrq,'{y}-{m}-{d}')
        }
      },{
        prop: 'jsrqsj',
        label: '结算日期时间',
        width: '140px',
        viewFun: (jsrqsj)=>{
          return this.parseTime(jsrqsj)
        }
      },{
        prop: 'mxxmsysj',
        label: '明细项目使用时间',
        viewFun: (mxxmsysj)=>{
          return this.parseTime(mxxmsysj)
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
        prop: 'mxxmdw',
        label: '明细项目单位',
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
        prop: 'mxxmbjsfy',
        label: '明细项目医保结算范围费用(元)',
        viewFun: (mxxmbjsfy)=>{
          return this.formatMoney(mxxmbjsfy,2)
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
  props:['tableData','gzmc'],
  created(){
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
    radioChange(e){
      const selection = this.tableData.filter(item=>{
        return item.id === e
      })
      this.$emit('radio-change',selection)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
    },
    checkLog(row){
      // this.showLog = true
      // this.logList = [row]
      this.$emit('on-log',row,5)
    },
    checkMx(row){
      this.$emit('check-mx',row)
    },
    // closedetail(){
    //   this.showLog = false
    //   this.$emit('on-close')
    // },
    selectAll(){
      this.tableData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    clearAll(){
      this.$refs.multipleTable.clearSelection()
    },
    
  },
  components:{
    // OperateLog
  }
}
</script>
<style lang="scss" scoped>
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
}
</style>