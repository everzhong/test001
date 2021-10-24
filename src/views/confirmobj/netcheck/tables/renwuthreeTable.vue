<template>
  <sTable :data="tableData" :header="tableHeader" :fixedNum="0" @yd-change="ydChange" @selection-change="handleSelectionChange">
    <el-table-column label="操作" align="center" width="180" slot="operate">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="checkdetail(scope.row)"
          >查看相关明细</el-button>
        </template>
      </el-table-column>
  </sTable>
<!-- </div> -->
</template>
<script>
import {updateRenwuthree} from '@/api/renwu/renwuthree'
export default {
  name:'RenwuthreeTable',
  data(){
    return {
      ydlxOptions:[],
      tableHeader:[{
        label:"疑点类型",
        prop:'ydlx',
        width: '250px',
        viewTemp:'selector',
        selectOption:this.ydlxOptions
      },{
        label:"疑点说明",
        prop:'ydsm',
        width: '250px',
        viewTemp:'input',
      },{
        label: '机构名称',
        fixedWidth:60,
        prop:'jgmc'
      },{
        label:"规则分类",
        prop:"gzfl",
      },{
        label:"规则名称",
        prop:'gzmc'
      },{
        label:"涉及就诊人员数",
        prop:'xjjzrs',
        hide:true
      },{
        prop: 'sjrcs',
        label: '涉及就诊人次数',
      },{
        label:"涉及明细数",
        prop:'xjmxs',
        width:'auto'
      },{
        label:"疑点金额(元)",
        prop:'xjje',
        viewFun:(xjje)=>{
          return this.formatMoney(xjje,2)
        }
      },{
        label:"结算费用(元)",
        prop:'jsfy',
        viewFun:(jsfy)=>{
          return this.formatMoney(jsfy,2)
        }
      },{
        label: '批次号',
        fixedWidth:30,
        prop:'rwpcid'
      },{
        label: '机构代码',
        fixedWidth:55,
        prop:'jgdm'
      },{
        label: '任务来源',
        fixedWidth:55,
        prop:'ajly'
      }]
    }
  },
  created(){
    this.getDicts("renwu_ss_ydlx").then(response => {
      this.ydlxOptions = response.data||[]
      this.tableHeader[0].selectOption = response.data || []
    });
  },
  props:['tableData'],
  methods:{
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange',selection)
      // this.ids = selection.map(item => item.rwpcid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
    checkdetail(row){
      this.$emit('check-xgmx',row)
    },
    ydChange(row){
      updateRenwuthree({id:row.id,ydlx:row.ydlx||'',ydsm:row.ydsm||''})
    }
  }
}
</script>