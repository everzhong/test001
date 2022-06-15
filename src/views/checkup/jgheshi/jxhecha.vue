/**进销存核查 第四层数据 type=2*/
<template>
<div class="liushui-table" style="height:calc(100% - 20px);margin-top:5px">
  <div style="height:100%">
    <sTable :data="tableData" :header="tableHeader" :fixedNum="jghs.value==1?1:2" :isrowClassName="true" @selection-change="handleSelectionChange">
      <el-table-column :selectable="(row,index)=>{return row.isput!=1}" type="selection" width="55" align="center" slot="fixed" fixed v-if="jghs.value!=1"/>
      <el-table-column label="序号" width="55" type="index" align="center" slot="fixed"/>
      <el-table-column label="操作"  fixed="right" align="center"  min-width="180px" slot="operate">
        <template slot-scope="scope">
          <el-button v-if="!noLog" type="text" @click="operateLog(scope.row)" size="mini">操作记录</el-button>
          <el-button :disabled="!!scope.row.xwrd" type="text" @click="cancelHc(scope.row)" size="mini">取消核查</el-button>
        </template>
      </el-table-column>
    </sTable>
  </div>
</div>
</template>
<script>
import { updateRenwufour } from '@/api/renwu/renwufour'
export default {
  name:'Jxhecha',
  data(){
    return {
      tableHeader:[{
        prop: 'xwrd',
        label: '行为认定',
        fixedWidth:50
      },{
        prop: 'bz',
        label: '备注',
        fixedWidth:90
      },{
        prop: 'mxxmbm',
        label: '明细项目编号',
      },{
        prop: 'mxxmmc',
        label: '明细项目名称',
      },{
        prop: 'xgzlxmmc',
        label: '相关诊疗项目',
      },{
        prop: 'mxxmdj',
        label: '单价(元)',
        viewFun: (dj)=>{
          return this.formatMoney(dj,2)
        }
      },{
        prop: 'qckc',
        label: '期初库存数量',
      },{
        prop: 'bqgr',
        label: '本期购入数量',
      },{
        prop: 'qmkc',
        label: '期末库存数量',
      },{
        prop: 'xjxs',
        label: '现金销售数量',
      },{
        prop: 'sjxs',
        label: '实际销售',
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
        prop:'hssj',
        label:'确定核实时间',
        viewFun:(hssj)=>{
          return this.parseTime(hssj)
        }
      },{
        prop: 'hs',
        label: '核实状态',
        viewFun:(hszt)=>{
          return this.jghs.value==1?'已核实':(hszt==1?'未核实':hszt==2?'待核实确认':hszt==3?'核实中':hszt==4?'已核实':'')
        }
      },{
        prop:'hsr',
        label:'核实人'
      },{
        prop:'hspfsj',
        label:'核实时间',
        viewFun:(hspfsj)=>{
          return this.parseTime(hspfsj)
        }
      }],
    }
  },
  props:['tableData','fromLog','noLog','hasNoRending','exHeight','jghs'],
  created(){
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('on-change',selection)
    },
    //操作记录
    operateLog(row){
      this.$emit('on-log',row,4)
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