<template>
  <div style="width:100%">
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span style="margin-right:10px">{{options.title||'待选择'}}</span>
        <el-select v-model="queryForm.ybd" size="small">
          <el-option label="本地" value="1"></el-option>
          <el-option label="异地" value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="small" @click="chaxunDialog = true">查询条件</el-button>
      </el-col>
    </el-row>
    <div style="height:400px">
      <el-table style="margin-top:10px" :data="tableData" border @selection-change="handleSelectionChange" height="350px"> 
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="机构代码" align="center" prop="jgdm" show-overflow-tooltip/>
        <el-table-column label="机构名称" align="center" prop="jgmc" show-overflow-tooltip/>
        <el-table-column label="规则分类" align="center" prop="gzfl" show-overflow-tooltip/>
        <el-table-column label="规则名称" align="center" prop="gzmc"  show-overflow-tooltip/>
        <el-table-column label="涉及就诊人数" align="center" prop="xjjzrs"  show-overflow-tooltip/>
        <el-table-column label="涉及明细数" align="center" prop="xjmxs"  show-overflow-tooltip/>
        <el-table-column label="涉及金额" align="center" prop="xjje"  show-overflow-tooltip/>
        <el-table-column label="结算费用" align="center" prop="jsfy"  show-overflow-tooltip/>
        <el-table-column label="险种" align="center" prop="ybbf"  show-overflow-tooltip/>
        <el-table-column label="行政区" align="center" prop="xzq"  show-overflow-tooltip/>
        <el-table-column label="就医类型" align="center" prop="jslb" show-overflow-tooltip/>
        <el-table-column label="异本地" align="center" prop="ybd"  show-overflow-tooltip/>
        <el-table-column label="数据开始时间" align="center" prop="datastarttime"  show-overflow-tooltip/>
        <el-table-column label="信用代码" align="center" prop="xydm"  show-overflow-tooltip/>
        <el-table-column label="添加时间" align="center" prop="addtime"  show-overflow-tooltip/>
        <el-table-column label="结算等级" align="center" prop="jsdj"  show-overflow-tooltip/>
        <el-table-column label="机构核实意见" align="center" prop="hsyj"  show-overflow-tooltip/>
        <el-table-column label="核实状态" align="center" prop="hszt"  show-overflow-tooltip/>
        <el-table-column label="核实时间" align="center" prop="hssj"  show-overflow-tooltip/>
        <el-table-column label="核实人" align="center" prop="hsr"  show-overflow-tooltip/>
        <el-table-column label="核实派发时间" align="center" prop="hspfsj"  show-overflow-tooltip/>
        <el-table-column label="任务批次号" align="center" prop="rwpcid"  show-overflow-tooltip/>
        <el-table-column label="已发送回智审" align="center" prop="issend"  show-overflow-tooltip/>
        <!-- <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="机构代码" align="center" prop="jgdm" :formatter="jgdmFormat" show-overflow-tooltipshow-overflow-tooltip/>
        <el-table-column label="机构名称" align="center" prop="jgmc" :formatter="jgmcFormat" show-overflow-tooltip/>
        <el-table-column label="规则分类" align="center" prop="gzfl" :formatter="gzflFormat" show-overflow-tooltip/>
        <el-table-column label="规则名称" align="center" prop="gzmc" :formatter="gzmcFormat" show-overflow-tooltip/>
        <el-table-column label="涉及就诊人数" align="center" prop="xjjzrs" :formatter="xjjzrsFormat" show-overflow-tooltip/>
        <el-table-column label="涉及明细数" align="center" prop="xjmxs" :formatter="xjmxsFormat" show-overflow-tooltip/>
        <el-table-column label="涉及金额" align="center" prop="xjje" :formatter="xjjeFormat" show-overflow-tooltip/>
        <el-table-column label="结算费用" align="center" prop="jsfy" :formatter="jsfyFormat" show-overflow-tooltip/>
        <el-table-column label="险种" align="center" prop="ybbf" :formatter="ybbfFormat" show-overflow-tooltip/>
        <el-table-column label="行政区" align="center" prop="xzq" :formatter="xzqFormat" show-overflow-tooltip/>
        <el-table-column label="就医类型" align="center" prop="jslb" :formatter="jslbFormat" show-overflow-tooltip/>
        <el-table-column label="异本地" align="center" prop="ybd" :formatter="ybdFormat" show-overflow-tooltip/>
        <el-table-column label="数据开始时间" align="center" prop="datastarttime" :formatter="datastarttimeFormat" show-overflow-tooltip/>
        <el-table-column label="信用代码" align="center" prop="xydm" :formatter="xydmFormat" show-overflow-tooltip/>
        <el-table-column label="添加时间" align="center" prop="addtime" :formatter="addtimeFormat" show-overflow-tooltip/>
        <el-table-column label="结算等级" align="center" prop="jsdj" :formatter="jsdjFormat" show-overflow-tooltip/>
        <el-table-column label="机构核实意见" align="center" prop="hsyj" :formatter="hsyjFormat" show-overflow-tooltip/>
        <el-table-column label="核实状态" align="center" prop="hszt" :formatter="hsztFormat" show-overflow-tooltip/>
        <el-table-column label="核实时间" align="center" prop="hssj" :formatter="hssjFormat" show-overflow-tooltip/>
        <el-table-column label="核实人" align="center" prop="hsr" :formatter="hsrFormat" show-overflow-tooltip/>
        <el-table-column label="核实派发时间" align="center" prop="hspfsj" :formatter="hspfsjFormat" show-overflow-tooltip/>
        <el-table-column label="任务批次号" align="center" prop="rwpcid" :formatter="rwpcidFormat" show-overflow-tooltip/>
        <el-table-column label="已发送回智审" align="center" prop="issend" :formatter="issendFormat" show-overflow-tooltip/> -->
      </el-table>
      <pagination
      v-show="options.total>0"
      :total="options.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :pageSizes="[50,100,150,200]"
      size="small"
      @pagination="getList"
    />
    </div>
    <!-- 查询条件 -->
    <el-dialog title="查询条件" class="msg-dialog" :visible.sync="chaxunDialog" width="650px" :modal="false">
      <el-form ref="chaxunForm" :model="queryForm"  label-width="100px" size="small">
        <el-form-item label="规则分类" prop="gzfl">
          <el-popover
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
                  <el-table-column property="gzmc" label="分类名称" align="center" show-overflow-tooltip></el-table-column>
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
            </el-popover>
        </el-form-item>
        <el-form-item label="规则名称" prop="gzmc">
          <el-input v-model="queryForm.gzmc" placeholder="请输入" style="width:360px"></el-input>
        </el-form-item>
        <el-form-item label="行为认定" prop="xwrd" >
          <el-select v-model="queryForm.xwrd" placeholder="请选择" style="width:360px">
            <el-option
              v-for="dict in gzflOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构核实状态" prop="jghszt">
          <el-select v-model="queryForm.jghszt" placeholder="请选择" style="width:360px">
            <el-option
              v-for="dict in gzflOptions"
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
export default {
  name:"TransferItem",
  props:['tableData','options'],
  data(){
    return{
      chaxunDialog:false,
      gzflOptions:[],
      queryForm:{
        ybd:'',
        gzmc:'',
        gzfl:'',
        xwrd:'',
        jghszt:''
      },
      guizefl:{
        search:'',
        gzfl:[],
        data:[{gzmc:'ssdsd'},{gzmc:'规则二'},{gzmc:'规则三'},{gzmc:'规则四'},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
        selection:[],
        total:110,
        pageNum:1,
        pageSize:10
      },
      ids:[],
      queryParams:{
        pageSize:50,
        pageNum:1
      }
    }
  },
  methods:{
    getList(){
      this.$emit('getList',{...this.queryParams,...this.queryForm})
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
    // 序号字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabel(this.jgmcOptions, row.jgmc);
    },
    // 规则分类字典翻译
    gzflFormat(row, column) {
      return this.selectDictLabel(this.gzflOptions, row.gzfl);
    },
    // 规则名称字典翻译
    gzmcFormat(row, column) {
      return this.selectDictLabel(this.gzmcOptions, row.gzmc);
    },
    // 涉及就诊人数字典翻译
    xjjzrsFormat(row, column) {
      return this.selectDictLabel(this.xjjzrsOptions, row.xjjzrs);
    },
    // 涉及明细数字典翻译
    xjmxsFormat(row, column) {
      return this.selectDictLabel(this.xjmxsOptions, row.xjmxs);
    },
    // 涉及金额字典翻译
    xjjeFormat(row, column) {
      return this.selectDictLabel(this.xjjeOptions, row.xjje);
    },
    // 结算费用字典翻译
    jsfyFormat(row, column) {
      return this.selectDictLabel(this.jsfyOptions, row.jsfy);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabel(this.ybbfOptions, row.ybbf);
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabel(this.jslbOptions, row.jslb);
    },
    // 异本地字典翻译
    ybdFormat(row, column) {
      return this.selectDictLabel(this.ybdOptions, row.ybd);
    },
    // 数据开始时间字典翻译
    datastarttimeFormat(row, column) {
      return this.selectDictLabel(this.datastarttimeOptions, row.datastarttime);
    },
    // 信用代码字典翻译
    xydmFormat(row, column) {
      return this.selectDictLabel(this.xydmOptions, row.xydm);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabel(this.addtimeOptions, row.addtime);
    },
    // 结算等级字典翻译
    jsdjFormat(row, column) {
      return this.selectDictLabel(this.jsdjOptions, row.jsdj);
    },
    // 机构核实意见字典翻译
    hsyjFormat(row, column) {
      return this.selectDictLabel(this.hsyjOptions, row.hsyj);
    },
    // 核实状态字典翻译
    hsztFormat(row, column) {
      return this.selectDictLabel(this.hsztOptions, row.hszt);
    },
    // 核实时间字典翻译
    hssjFormat(row, column) {
      return this.selectDictLabel(this.hssjOptions, row.hssj);
    },
    // 核实人字典翻译
    hsrFormat(row, column) {
      return this.selectDictLabel(this.hsrOptions, row.hsr);
    },
    // 核实派发时间字典翻译
    hspfsjFormat(row, column) {
      return this.selectDictLabel(this.hspfsjOptions, row.hspfsj);
    },
    // 任务批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // 已发送回智审字典翻译
    issendFormat(row, column) {
      return this.selectDictLabel(this.issendOptions, row.issend);
    },
  }
}
</script>