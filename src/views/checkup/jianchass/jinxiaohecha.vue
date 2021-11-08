/**进销存核查 第四层数据 type=2*/
<template>
<div class="liushui-table" :style="{height:tableHeight,marginTop:'10px'}">
  <!-- <el-table :row-class-name="tableRowClassName" class="qztable" ref="multipleTable" :data="tableData" border height="100%"> -->
  <sTable :data="tableData" :header="tableHeader" :fixedNum="1" :isrowClassName="true">
    <el-table-column  align="center" width="40" slot="fixed">
      <template slot-scope="scope">
        <el-radio :label="scope.row.id" v-model="wsCheck" @change="radioChange"></el-radio>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center"  min-width="180px" slot="operate">
      <template slot-scope="scope">
        <el-button v-if="!noLog" type="text" @click="operateLog(scope.row)" size="mini">操作记录</el-button>
        <el-button :disabled="!!scope.row.xwrd" type="text" @click="cancelHc(scope.row)" size="mini">取消核查</el-button>
      </template>
    </el-table-column>
  </sTable>
</div>
</template>
<script>
import { updateRenwufour } from '@/api/renwu/renwufour'
export default {
  name:'Jinxiaohecha',
  data(){
    return {
      wsCheck:'',
      tableHeight:0,
      tableHeader:[{
        prop: 'xwrd',
        label: '认定行为',
        fixedWidth:55,
      },{
        prop: 'bz',
        label: '备注',
        fixedWidth:45,
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
        prop: 'mxxmdw',
        label: '明细项目单位',
      },{
        prop: 'mxxmsl',
        label: '明细项目数量',
        width: 'auto'
      },{
        prop: 'mxxmbjsfy',
        label: '明细项目医保结算范围费用(元)',
        fixedWidth:-130,
        viewFun: (mxxmbjsfy)=>{
          return this.formatMoney(mxxmbjsfy,2)
        }  
      },{
        prop: 'fylb',
        label: '费用类别',
        viewFun: (fylb)=>{
          return this.selectDictLabels(this.$store.getters.fyDic, fylb)
        },
      },{
        prop: 'xgzlxmmc',
        label: '相关诊疗项目',
        fixedWidth:30
      },{
        prop: 'qckc',
        label: '期初库存数量',
      },{
        prop: 'bqgr',
        label: '本期购入数量',
      },{
        prop: 'qmkc',
        label: '期末库存数量'
      },{
        prop: 'xjxs',
        label: '现金销售数量',
      },{
        prop: 'ybjs',
        label: '医保结算数量',
      },{
        prop: 'cesl',
        label: '差额数量',
      },{
        prop: 'dzce',
        label: '对账差额费用(元)',
        viewFun: (dzcefy)=>{
          return this.formatMoney(dzcefy,2)
        }  
      },{
        prop: 'zkdj',
        label: '追款单价',
        viewFun: (zkdj)=>{
          return this.formatMoney(zkdj,3)
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
      }]
    }
  },
  props:['tableData','fromLog','noLog'],
  created(){
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  mounted(){
    const th = document.body.offsetHeight - 50-34-138-32-165;
    this.tableHeight = this.fromLog?`${th+90}px`:`${th}px` ;
  },
  methods:{
    cancelHc(row){//取消核查
      this.$confirm('是否确定取消该项核查?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
         return updateRenwufour({
            id:row.id,
            ischeck:0
         })
        }).then(() => {
          this.msgSuccess("取消成功");
          this.$emit('update')
        })
    },
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
    //操作记录
    operateLog(row){
      this.$emit('on-log',row,4)
    },
    checkdetail(row){
      this.$emit('checkdetail',row)
    },
    selectAll(){
      this.tableData.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },
    clearAll(){
      this.$refs.multipleTable.clearSelection()
    },
    tableRowClassName({row}){
      let className = ''
      if(row.xwrd){
        className = row.xwrd.indexOf('未发现违规')>-1?'xwrd-table-row-normal':'xwrd-table-row';
      } else {
        className = ''
      }
      return  className    
    }
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