<template>
  <div style="width:100%">
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span style="margin-right:10px;">{{options.title||'待选择'}}</span>
        <el-select v-model="queryForm.ybd" size="small" @change="ybdChange">
          <el-option label="本地" value="本地"></el-option>
          <el-option label="异地" value="异地"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="small" @click="chaxunDialog = true">查询条件</el-button>
      </el-col>
    </el-row>
    <div style="height:400px" v-loading="loading">
      <el-table style="margin-top:10px" :data="tableData" border @selection-change="handleSelectionChange" height="350px"> 
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
        <el-table-column label="机构名称" align="center" prop="jgmc" :width="flexColumnWidth('jgmc',tableData)"/>
        <el-table-column label="规则分类" align="center" prop="gzfl" :width="flexColumnWidth('gzfl',tableData)"/>
        <el-table-column label="规则名称" align="center" prop="gzmc"  :width="flexColumnWidth('gzmc',tableData)"/>
        <el-table-column label="涉及就诊人员数" align="center" prop="xjjzrs"  :width="flexColumnWidth('xjjzrs',tableData)"/>
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
        <el-table-column label="险种" align="center" prop="ybbf"  :width="flexColumnWidth('ybbf',tableData)"/>
        <el-table-column label="行政区" align="center" prop="xzq"  :width="flexColumnWidth('xzq',tableData)"/>
        <el-table-column label="就医类型" align="center" prop="jslb" :width="flexColumnWidth('jslb',tableData)"/>
        <el-table-column label="异本地" align="center" prop="ybd"  :width="flexColumnWidth('ybd',tableData)"/>
        <el-table-column label="数据开始时间" align="center" prop="datastarttime"  :width="flexColumnWidth('datastarttime',tableData)"/>
        <el-table-column label="信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/>
        <el-table-column label="添加时间" align="center" prop="addtime"  :width="flexColumnWidth('addtime',tableData)"/>
        <el-table-column label="结算等级" align="center" prop="jsdj"  :width="flexColumnWidth('jsdj',tableData)"/>
        <el-table-column label="机构核实意见" align="center" prop="hsyj"  :width="flexColumnWidth('hsyj',tableData)"/>
        <el-table-column label="核实状态" align="center" prop="hszt"  :width="flexColumnWidth('hszt',tableData)"/>
        <el-table-column label="核实时间" align="center" prop="hssj"  :width="flexColumnWidth('hssj',tableData)"/>
        <el-table-column label="核实人" align="center" prop="hsr"  :width="flexColumnWidth('hsr',tableData)"/>
        <el-table-column label="核实派发时间" align="center" prop="hspfsj"  :width="flexColumnWidth('hspfsj',tableData)"/>
        <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
        <el-table-column label="已发送回智审" align="center" prop="issend"  :width="flexColumnWidth('issend',tableData)">
          <template slot-scope="scope">
            <span>{{scope.row.issend==='0'?'否':scope.row.issend==='1'?'是':''}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
      v-show="total>0"
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
          <!-- <el-popover
              ref="tablePopover"
              placement="bottom"
              width="750"
              popper-class="sys-popup"
              trigger="click">
              <div style="min-height:150px;max-height:210px;overflow:auto">
                <el-form size="small" inline>
                  <el-form-item label="规则分类">
                    <el-input style="width:230px" v-model="guizefl.search" clearable></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button type="primary" plain>重置 </el-button>
                  </el-form-item>
                </el-form>
                <el-table :data="guizefl.data" border="" class="sys-small-table" @selection-change="handleGuizeChange">
                  <el-table-column type="selection" width="50" align="center" />
                  <el-table-column property="gzmc" label="分类名称" align="center" :width="flexColumnWidth('jczname',tableData)"></el-table-column>
                </el-table>
              </div>
              <pagination
                  style="margin-top:0;margin-bottom:30px"
                  v-show="guizefl.total>0"
                  :total="guizefl.total"
                  size="small"
                  :page.sync="guizefl.pageNum"
                  :limit.sync="guizefl.pageSize"
                  @pagination="getGuizList"
                />
              <div style="text-align:right;margin-top:10px">
                <el-button size="mini" type="primary" @click="$refs.tablePopover.doClose()" plain>返回</el-button>
                <el-button size="mini" type="primary" @click="selectedGuize">确定</el-button>
              </div>
              <el-select class="select-no-drawdown"  multiple :popper-append-to-body="false" slot="reference" v-model="guizefl.gzfl" style="width:360px">
                <el-option v-for="item in guizefl.selection" :key="item.gzmc" :value="item.gzmc" :label="item.gzmc"></el-option>
              </el-select>
          </el-popover> -->
        </el-form-item>
        <el-form-item label="规则名称" prop="gzmc">
          <el-input clearable v-model="queryForm.gzmc" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="行为认定" prop="xwrd" >
          <el-select v-model="queryForm.xwrd" placeholder="全部" style="width:360px">
            <el-option
              v-for="dict in gzflOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item> -->
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
      ]
    }
  },
  created(){
    this.getList()
  },
  methods:{
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