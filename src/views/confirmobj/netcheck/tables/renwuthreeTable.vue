<template>
<!-- <div :style="{minHeight:'360px',height:tableHeight}"> -->
  <el-table :data="tableData" border @selection-change="handleSelectionChange" height="100%">
    <!-- <el-table-column type="selection" width="55" align="center" /> -->
    <!-- <el-table-column label="案件来源" align="center" prop="ajly" :width="flexColumnWidth('ajly',tableData)"/> -->
    <el-table-column label="疑点类型" align="center" prop="ydlx" width="250">
      <template slot-scope="scope">
        <el-select v-model="scope.row.ydlx" size="mini" @change="ydChange(scope.row)">
          <el-option
            v-for="item in ydlxOptions"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue">
          </el-option>
      </el-select>
      </template>
    </el-table-column>
    <el-table-column label="疑点说明" align="center" prop="ydsm" width="250">
      <template slot-scope="scope">
        <el-input v-model="scope.row.ydsm" size="mini" @blur="ydChange(scope.row)"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
    <el-table-column label="规则分类" align="center" prop="gzfl"  :width="flexColumnWidth('gzfl',tableData)"/>
    <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
    <el-table-column label="涉及就诊人员数" align="center" prop="xjjzrs"/>
    <el-table-column label="涉及明细数" align="center" prop="xjmxs"/>
    <el-table-column label="涉及金额(元)" align="center" prop="xjje"  :width="flexColumnWidth('xjje',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.xjje,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="结算费用(元)" align="center" prop="jsfy"  :width="flexColumnWidth('jsfy',tableData)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.jsfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="批次号" align="center" prop="rwpcid" :width="flexColumnWidth('rwpcid',tableData)"/>
    <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
    <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="checkdetail(scope.row)"
          >查看相关明细</el-button>
        </template>
      </el-table-column>
  </el-table>
<!-- </div> -->
</template>
<script>
import {updateRenwuthree} from '@/api/renwu/renwuthree'
export default {
  name:'RenwuthreeTable',
  data(){
    return {
      ydlxOptions:[],
    }
  },
  created(){
    this.getDicts("renwu_ss_ydlx").then(response => {
      this.ydlxOptions = response.data||[]
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