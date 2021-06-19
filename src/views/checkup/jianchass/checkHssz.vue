<template>
  <div class="hssz">
    <div class="hssz-top">
      <div class="title">规则汇总数据</div>
      <el-row :gutter="10">
        <el-col :span="1.5">
          <span style="margin-right:10px;font-szie:14px;color:#606266">参保人</span>
          <el-select v-model="queryForm.ybd" size="small" @change="ybdChange" style="width:100px">
            <el-option label="本地" value="本地"></el-option>
            <el-option label="异地" value="异地"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="chaxunDialog = true">查询条件</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="height:400px" v-loading="loading">
      <el-table class="qztable" style="margin-top:10px" :data="tableData" border> 
        <el-table-column  align="center" width="55">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="rwCheck" @change="radioChange"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="规则分类" align="center" prop="gzfl" :width="flexColumnWidth('gzfl',tableData)"/>
        <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
        <el-table-column label="涉及就诊人数" align="center" prop="xjjzrs"  :width="flexColumnWidth('xjjzrs',tableData)"/>
        <el-table-column label="涉及明细数" align="center" prop="xjmxs"  :width="flexColumnWidth('xjmxs',tableData)"/>
        <el-table-column label="涉及金额" align="center" prop="xjje"  :width="flexColumnWidth('xjje',tableData)">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.xjje,2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算费用" align="center" prop="jsfy"  :width="flexColumnWidth('jsfy',tableData)">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.jsfy,2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="确定核实时间" align="center" prop="hssj">
          <template slot-scope="scope">
            <span>{{parseTime(scope.row.hssj,'{y}-{m}-{d} {h}:{m}:{s}')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="核实状态" align="center" prop="hszt"  :width="flexColumnWidth('hszt',tableData)"/>
        <el-table-column label="核实意见" align="center" prop="hsr" />
        <el-table-column label="核实人" align="center" prop="hsr"  :width="flexColumnWidth('hsr',tableData)"/>
        <el-table-column label="核实时间" align="center" prop="hspfsj">
          <template slot-scope="scope">
            <span>{{parseTime(scope.row.hspfsj,'{y}-{m}-{d} {h}:{m}:{s}')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :pageSizes="[50,100,150,200]"
      size="small"
      @pagination="getList"
    />
    </div>
    <div class="bottom-dec">
      <p>规则明称：{{selection.gzmc}}</p>
      <div><span>情况说明：{{selection.qksm}}</span><span>相关资料：{{selection.xgzl}}</span></div>
    </div>
    <!-- 查询条件 -->
    <el-dialog title="查询条件" class="msg-dialog" :visible.sync="chaxunDialog" width="650px" :modal="false">
      <el-form ref="chaxunForm" :model="queryForm"  label-width="100px" size="small">
        <el-form-item label="规则分类" prop="gzfl">
          <el-input clearable v-model="queryForm.gzfl" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="规则名称" prop="gzmc">
          <el-input clearable v-model="queryForm.gzmc" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="机构核实状态" prop="hszt">
          <el-select clearable v-model="queryForm.hszt" placeholder="全部" style="width:360px">
            <el-option
              v-for="dict in hsztOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getList()" size="small">确 定</el-button>
        <el-button @click="$refs['chaxunForm'].resetFields()" size="small">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {listRenwuthree} from '@/api/renwu/renwuthree'
export default {
  name:"CheckHssz",
  data(){
    return {
      loading:false,
      chaxunDialog:false,
      rwCheck:'',
      tableData:[],
      queryParams:{
        pageSize:50,
        pageNum:1
      },
      queryForm:{
        ybd:'本地',
        gzmc:'',
        gzfl:'',
        hszt:''
      },
      total:0,
      hsztOptions:[
        {dictValue:'0',dictLabel:'未核实'},
        {dictValue:'1',dictLabel:'核实中'},
        {dictValue:'2',dictLabel:'已核实'}
      ],
      selection:{}
    }
  },
  created(){
    this.getList()
    console.log(this.$store)
  },
  methods:{
    async getList(){
      const params ={...this.queryParams,...this.queryForm}
      this.loading = true
      const res = await listRenwuthree(params)
      if(res.code===200){
        this.tableData = res.rows;
        this.total = res.total;
      }
      this.loading = false
    },
    ybdChange(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    radioChange(val){
      this.selection = this.tableData.filter(item=>{
        return item.id === val
      })[0]
    }
  }

}
</script>
<style lang="scss" scoped>
.hssz {
  .hssz-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    .title {
      font-size: 14px;
      color: #606266;
    }
  }
  .bottom-dec {
    font-size: 14px;
    color:#606266;
    div>span{
      display: inline-block;
      width: 50%;
    }
  }
}
.qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
  }
</style>