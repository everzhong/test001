<template>
<div>
  <el-form style="height:70px;overflow:auto;margin-bottom:20px;" size="small" label-width="100px" class="top-search" ref="bmQueryForm" :inline="true">
    <div>
      <el-form-item label="险种" prop="ybbf">
        <el-select v-model="searchForm.ybbf" placeholder="全部" clearable size="small">
          <el-option
            v-for="dict in ybbfOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="就医类型" prop="jslb">
        <el-select v-model="searchForm.jslb" placeholder="全部" clearable size="small">
          <el-option
            v-for="dict in jslbOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="hsr">
        <el-input  v-model="searchForm.hsr"></el-input>
      </el-form-item>
      <el-form-item label="数据开始日期" prop="datastarttime">
        <el-date-picker
          style="width:205px"
          v-model="searchForm.datastarttime"
          align="right"
          type="date"
          size="small"
         >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="数据结束日期" prop="dataendtime">
        <el-date-picker
          style="width: 206px"
          v-model="searchForm.dataendtime"
          align="right"
          type="date"
          size="small"
         >
        </el-date-picker>
      </el-form-item>
       <el-form-item label="联系电话" prop="hsr">
        <el-input  v-model="searchForm.mobile"></el-input>
      </el-form-item>
    </div> 
    <div>
      <el-form-item style="margin-right:0;text-align:right">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </div>
  </el-form>
  <div class="table-main">
    <sTable :data="tableData" :header="tableHeader" :fixedNum="1">
      <el-table-column label="序号" type="index" align="center" min-width="65" slot="fixed"/>
      <el-table-column label="操作" align="center"  width="110" slot="operate">
        <template slot-scope="scope" >
          <el-button size="mini" type="text" primary @click="handleHsShuju(scope.row)">核实数据</el-button>
        </template> 
      </el-table-column>
    </sTable>
  </div>
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
import {listRenwutwo} from '@/api/renwu/renwutwo'
export default {
  name:'Jgheshi',
  data(){
    return {
      total:0,
      tableData:[],
      ybbfOptions:[],
      jslbOptions:[],
      searchForm:{
        ybbf:'',
        jslb:'',
        hsr:'',
        datastarttime:'',
        dataendtime:'',
        mobile:''
      },
      queryParams: {
        pageNum: 1,
        pageSize: 50
      },
      tableHeader:[{
        prop: 'jgmc',
        label: '监督机构',
        fixedWidth:30
      },{
        prop: 'hsr',
        label: '联系人',
      },{
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
        label:"数据开始日期",
        prop:'datastarttime',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}')
        }
      },{
        label:"数据结束日期",
        prop:'dataendtime',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}')
        }
      },{
        prop:'hspfsj',
        label:'检查开始时间',
        viewFun:(hspfsj)=>{
          return this.parseTime(hspfsj)
        }
      }]
    }
  },
  created(){
    this.getList()
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  methods:{
    resetQuery(){
      this.searchForm = {
        ybbf:'',
        jslb:'',
        hsr:'',
        datastarttime:'',
        dataendtime:'',
        mobile:''
      }
      this.getList()
    },
    handleQuery(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    async getList(){
      this.loading = true
      try {
        const res = await listRenwutwo()
        if(res.code === 200) {
          this.tableData = res.rows
          this.total = res.total
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    handleHsShuju(row){
      this.$emit('on-heshi',row)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:110px;
  bottom:70px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:30px;
  right: 0px;
}
</style>