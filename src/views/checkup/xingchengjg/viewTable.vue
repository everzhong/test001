<template>
  <el-table v-loading="loading" ref="multipleTable" :data="renwufourList" border style="margin-top:10px">
    <el-table-column label="序号" type="index" width="55" align="center" />
    <el-table-column label="险种" align="center" prop="ybbf"  :width="flexColumnWidth('ybbf',renwufourList)"/>
    <el-table-column label="就医类别" align="center" prop="jslb"  :width="flexColumnWidth('jslb',renwufourList)"/>
    <el-table-column label="检查方式" align="center">
      <template>
        <span>规则筛查</span>
      </template>
    </el-table-column>
    <el-table-column label="医保项目编码" align="center" prop="mxxmbm"  :width="flexColumnWidth('mxxmbm',renwufourList)"/>
    <el-table-column label="项目名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',renwufourList)"/>
    <el-table-column label="标准单价(元)" align="center" prop="mxxmdj"  :width="flexColumnWidth('mxxmdj',renwufourList)">
       <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmdj,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="计价单位" align="center" prop="mxxmje" />
    <el-table-column label="医院单价(元)" align="center" prop="mxxmjyfy"  :width="flexColumnWidth('mxxmjyfy',renwufourList)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmjyfy,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="追款单价(元)" align="center" prop="mxxmbjsfy"  :width="flexColumnWidth('mxxmbjsfy',renwufourList)">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.mxxmbjsfy,3)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="违规数量" align="center" prop="wgsl" />
    <el-table-column label="违规费用(元)" align="center" prop="wgfy">
      <template slot-scope="scope">
        <span>{{formatMoney(scope.row.wgfy,2)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="行为认定" align="center" prop="xwrd" :width="flexColumnWidth('xwrd',renwufourList)"/>
    <!-- <el-table-column label="操作" align="center" :width="flexColumnWidth('jgdm',renwufourList)" width="110px">
      <template slot-scope="scope">
        <el-button type="text" @click="checkdetail(scope.row)">相关明细</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
import { listRenwufour } from "@/api/renwu/renwufour";
 
export default {
  name:'ViewTable',
  data(){
    return {
      loading:true,
      queryParams:{
        pageNum:1,
        pageSize:50
      },
      renwufourList:[]
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      const params = {...this.queryParams,...this.options}
     listRenwufour(params).then(response => {
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