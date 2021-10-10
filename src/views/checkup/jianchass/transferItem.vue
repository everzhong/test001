<template>
  <div style="width:100%;height:100%">
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span style="margin-right:10px;font-size:14px;color:#606266">{{options.title||'待选择'}}</span>
        <el-select v-model="queryForm.ybd" size="small" @change="ybdChange">
          <el-option label="本地" value="本地"></el-option>
          <el-option label="异地" value="异地"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="small" @click="chaxunDialog = true">查询条件</el-button>
      </el-col>
    </el-row>
    <div style="height:calc(100% - 90px)" v-loading="loading">
      <el-table style="margin-top:10px" :data="tableData" border @selection-change="handleSelectionChange" height="100%"> 
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="规则分类" align="center" prop="gzfl" :width="flexColumnWidth('gzfl',tableData)"/>
        <el-table-column label="规则名称" align="center" prop="gzmc"  width="350" show-overflow-tooltip/>
        <el-table-column label="涉及就诊人次数" align="center" prop="xjjzrs"  :width="flexColumnWidth('xjjzrs',tableData)"/>
        <el-table-column label="涉及明细数" align="center" prop="xjmxs"  :width="flexColumnWidth('xjmxs',tableData)"/>
        <el-table-column label="涉及金额" align="center" prop="xjje"  :width="flexColumnWidth('xjje',tableData)">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.xjje,2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="结算总费用" align="center" prop="jsfy"  :width="flexColumnWidth('jsfy',tableData)">
          <template slot-scope="scope">
            <span>{{formatMoney(scope.row.jsfy,2)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
      style="float:right"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :pageSizes="[50,100,150,200]"
      layout="prev, pager, next, slot"
      size="small"
      @pagination="getList"
    />
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
import { listRenwuthree } from "@/api/renwu/renwuthree"
export default {
  name:"TransferItem",
  props:['options'],
  data(){
    return{
      loading:false,
      tableData:[],
      total:0,
      chaxunDialog:false,
      gzflOptions:[],
      queryForm:{
        ybd:'本地',
        gzmc:'',
        gzfl:'',
        xwrd:'',
        hszt:''
      },
      guizefl:{
        search:'',
        gzfl:[],
        data:[],
        selection:[],
        total:0,
        pageNum:1,
        pageSize:10
      },
      ids:[],
      queryParams:{
        pageSize:50,
        pageNum:1
      },
      hsztOptions:[
        {dictValue:'0',dictLabel:'未核实'},
        {dictValue:'1',dictLabel:'核实中'},
        {dictValue:'2',dictLabel:'已核实'}
      ],
      xzqOptions:[]
    }
  },
  created(){
    this.getList()
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
  },
  methods:{
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
    filterData(selection){
      selection.forEach(item => {
        this.tableData = this.tableData.filter(subItem=>{
          return item.id!==subItem.id
        })
      })
    },
    addData(selection){
      this.tableData = this.tableData.concat(selection)
    },
    async getList(query){
      let params ={...this.queryParams,...this.queryForm}
      query&&(params = {...params,...query})
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
    getGuizList(){
      console.log(this.guizefl)
    },
    /**
     * 规则选择
    */
    handleGuizeChange(selection){
      this.guizefl.selection = selection
    },
    /**
     * selectedGuize规则选择确定
     */
    selectedGuize(){

    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.$emit('select',selection)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
  }
}
</script>