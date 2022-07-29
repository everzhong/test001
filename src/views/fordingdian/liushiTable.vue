/**项目流水号汇总 第四层数据 type=1*/
<template>
<div class="liushui-table" :style="{height:tableHeight,marginTop:'10px'}">
  <sTable :data="tableData" :header="tableHeader" :fixedNum="hasNoRending?0:1" :isrowClassName="true">
    <el-table-column  align="center" width="55" slot="fixed" v-if="!hasNoRending" fixed>
      <template slot-scope="scope">
        <el-radio :label="scope.row.id" v-model="wsCheck" @change="radioChange"></el-radio>
      </template>
    </el-table-column>
    <el-table-column v-else label="序号" width="55" type="index" align="center" slot="fixed"/>
    <el-table-column label="操作"  fixed="right" align="center"  min-width="180px" slot="operate">
      <template slot-scope="scope">
        <el-button v-if="!noLog" type="text" @click="operateLog(scope.row)" size="mini">操作记录</el-button>
        <el-button type="text" @click="checkdetail(scope.row)" size="mini">同流水号明细</el-button>
      </template>
    </el-table-column>
  </sTable>
</div>
</template>
<script>
export default {
  name:'LiushuiTable',
  data(){
    return {
      wsCheck:'',
      tableHeight:0,
      tableHeader:[{
        prop: 'jgdm',
        label: '机构代码',
        fixedWidth:55,
      },{
        prop: 'jgmc',
        label: '机构名称',
        fixedWidth:60,
      },{
        prop: 'gzfl',
        label: '规则分类',
        align: 'left'
      },{
        prop: 'gzmc',
        label: '规则名称',
        align: 'left'
      },{
        prop: 'xwrd',
        label: '认定行为',
      },{
        prop: 'bz',
        label: '备注',
      },{
        prop: 'jslb',
        label: '就医类型',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        },
      },{
        prop: 'ybbf',
        label: '险种',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        },
      },{
        prop: 'lsh',
        label: '交易流水号',
      },{
        prop: 'kh',
        label: '参保人卡号',
      },{
        prop: 'xm',
        label: '参保人姓名',
      },{
        prop: 'sfzh',
        label: '身份证号',
      },{
        prop: 'ksdm',
        label: '科室代码',
      },{
        prop: 'ksmc',
        label: '科室名称',
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
          return this.formatMoney(mxxmdj,2)
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
        label: '明细项目交易费用(元)',
        viewFun: (mxxmjyfy)=>{
          return this.formatMoney(mxxmjyfy,2)
        }  
      },{
        prop: 'mxxmbjsfy',
        label: '明细项目医保医保结算范围费用(元)',
        viewFun: (mxxmbjsfy)=>{
          return this.formatMoney(mxxmbjsfy,2)
        }  
      },{
        prop: 'jyrq',
        label: '结算日期',
        viewFun: (jyrq)=>{
          return this.parseTime(jyrq,'{y}-{m}-{d}')
        }
      },{
        prop: 'zkdj',
        label: '追款单价',
        viewFun: (zkdj)=>{
          return this.formatMoney(zkdj,2)
        }  
      },{
        prop: 'wgsl',
        label: '违规数量',
        width:'auto' 
      },{
        prop: 'wgfy',
        label: '违规费用(元)',
        width: 'auto',
        viewFun: (wgfy)=>{
          return this.formatMoney(wgfy,2)
        }
      },{
        prop: 'fylb',
        label: '费用类别',
        viewFun: (fylb)=>{
          return this.selectDictLabels(this.$store.getters.fyDic, fylb)
        },
        width: 'auto'
      },{
        prop: 'zyts',
        label: '住院天数'
      }]
    }
  },
  props:['tableData','fromLog','noLog','hasNoRending'],
  created(){
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  mounted(){
    const th = document.body.offsetHeight - (this.hasNoRending?132:212);
    this.tableHeight = `${th}px` ;
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
    //操作记录
    operateLog(row){
      this.$emit('on-log',row,4)
    },
    checkdetail(row){
      this.$emit('checkdetail',row)
    },
  }
}
</script>
<style lang="scss" scoped>
.liushui-table {
  min-height: 300px;
}
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
}
</style>