<template>
  <div class="app-container">
    <el-form size="small" label-width="100px" class="top-search" ref="queryForm" :inline="true" v-show="showSearch">
          <el-form-item label="案件来源" prop="ajly">
            <el-input readonly v-model="queryInfoFrom.ajly"></el-input>
          </el-form-item>
          <el-form-item label="险种" prop="ybbf">
            <el-input readonly v-model="queryInfoFrom.ybbf"></el-input>
          </el-form-item>
          <el-form-item label="就医类型" prop="jslb">
            <el-input readonly v-model="queryInfoFrom.jslb"></el-input>
          </el-form-item>
          <el-form-item label="批次号" prop="rwpcid">
            <el-input readonly v-model="queryInfoFrom.rwpcid"></el-input>
          </el-form-item>
          <el-form-item label="数据开始日期" prop="datastarttime">
            <el-input readonly v-model="queryInfoFrom.datastarttime"></el-input>
          </el-form-item>
          <el-form-item label="数据结束日期" prop="dataendtime">
            <el-input readonly v-model="queryInfoFrom.dataendtime"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="jgmc">
            <el-input readonly v-model="queryInfoFrom.jgmc"></el-input>
          </el-form-item>
            <el-form-item label="检查机构" prop="cxjg">
            <el-input readonly v-model="queryInfoFrom.cxjg"></el-input>
          </el-form-item>
            <el-form-item label="检查组" prop="jcz">
            <el-input readonly v-model="queryInfoFrom.jcz"></el-input>
          </el-form-item>
          <div style="position:absolute;right:20px;top:-31px">
            <el-button type="primary" plain size="mini" @click="heshiOption.show=true">机构核实</el-button>
            <el-button type="primary" size="mini">检查完成</el-button>
            <el-button type="primary" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
          </div>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span>参保人：</span>
        <el-select v-model="ybd" size="small">
          <el-option label="本地" value="1"></el-option>
          <el-option label="异地" value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="small" @click="chaxunDialog = true">查询条件</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="small" @click="guizeOptions.show = true">规则说明</el-button>
      </el-col>
      <el-col :span="1.5" v-if="tabsValue==='four'&&!isAll">
        <el-button type="primary" plain size="small" @click="selectEvent('selectAll',true)">全选</el-button>
      </el-col>
      <el-col :span="1.5" v-if="tabsValue==='four'  &&isAll">
        <el-button type="primary" plain size="small" @click="selectEvent('clearAll',false)">取消全选</el-button>
      </el-col>
      <el-col :span="1.5" v-if="tabsValue!=='three'">
        <el-button type="warning" plain size="small" @click="goBackUpLevel">返回上一层</el-button>
      </el-col>
      <el-radio-group v-model="tabsValue" size="small" class="top-right-btn" v-if="tabsValue==='three'">
        <el-radio-button label="three">规则筛查</el-radio-button>
      </el-radio-group>
    </el-row>
    <div v-loading="loading" style="max-height:400px">
      <el-table v-if="tabsValue==='three'" class="qztable" :data="renwuthreeList" border style="margin-top:10px">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" width="55" type="index" align="center"  />
          <el-table-column label="行为认定" align="center" prop="xwrd"  show-overflow-tooltip/>
          <el-table-column label="违规数量" align="center" prop="wgsl"  show-overflow-tooltip/>
          <el-table-column label="违规费用(元）" align="center" prop="xjje" show-overflow-tooltip/>
          <el-table-column label="规则分类" align="center" prop="gzfl" show-overflow-tooltip/>
          <el-table-column label="规则名称" align="center" prop="gzmc" show-overflow-tooltip/>
          <el-table-column label="涉及就诊人数" align="center" prop="xjjzrs" show-overflow-tooltip/>
          <el-table-column label="涉及明细数" align="center" prop="xjmxs" show-overflow-tooltip/>
          <el-table-column label="医院核实结果" align="center" prop="yyhsjg" show-overflow-tooltip/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="fluProject(scope.row)">
                水流号项目汇总
              </el-button>
            </template>
          </el-table-column>
      </el-table>
      <liushui-table ref="liuShuiTable" v-if="tabsValue==='four'" :tableData="renwufourList" @handleSelectionChange="handleSelectionChange" @checkdetail="tongLiushuimx"></liushui-table>
      <tongliumx ref="tongLiumx" v-if="tabsValue==='five'" :tableData="renwufiveList"></tongliumx>
    </div>
    <pagination
       style="margin-top:0;margin-bottom:25px;"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div v-if="tabsValue!=='three'"  class="xingweirz" style="margin-top:15px;">
      <el-form inline :model="xwrdForm" :rules="xwRules" size="small" ref="xwrdForm" label-width="100px">
        <el-form-item label="名称" prop="gzmc">
          <el-input v-model="xwrdForm.gzmc" disabled></el-input>
        </el-form-item>
        <el-form-item label="行为认定" prop="xwrd">
          <div style="box-sizing:border-box;cursor:pointer;padding:0 15px;line-height:32px;height:32px;border:1px solid #DCDFE6;border-radius:4px;width:188px;color:#606266;font-size:13px;"  @click="handelXwrdDialog" >{{xwrdForm.xwrd}}</div>
        </el-form-item>
        <el-form-item label="备注" prop="beizhu">
          <el-input v-model="xwrdForm.beizhu" maxlength="50"></el-input>
        </el-form-item>
         <el-form-item label="追款单价" prop="mxxmdj">
          <el-input v-model="xwrdForm.mxxmdj" :disabled="isDisabled.dj"></el-input>
        </el-form-item>
         <el-form-item label="违规数量" prop="mxxmsl">
          <el-input v-model="xwrdForm.mxxmsl" :disabled="isDisabled.sl"></el-input>
        </el-form-item>
         <el-form-item label="违规费用(元)" prop="mxxmje" >
          <el-input v-model="xwrdForm.mxxmje" :disabled="isDisabled.fy"></el-input>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" size="small" @click="xwrdSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
     <!-- 查询条件 -->
    <el-dialog title="查询条件" class="msg-dialog" :visible.sync="chaxunDialog" width="650px">
      <el-form ref="chaxunForm" :model="queryForm" :rules="rules" label-width="100px" size="small">
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
    <guizeshuom :options="guizeOptions"></guizeshuom>
    <xwrd-dialog :options="xwrdDialog" @on-checked="onChecked"></xwrd-dialog>
    <jgheshi :options="heshiOption"></jgheshi>
  </div>
</template>

<script>
import { listRenwuthree, getRenwuthree, delRenwuthree, addRenwuthree, updateRenwuthree, exportRenwuthree } from "@/api/renwu/renwuthree";
import { listRenwufour } from '@/api/renwu/renwufour'
import { listRenwufive } from '@/api/renwu/renwufive'

import LiushuiTable from './liushiTable.vue'
import Tongliumx from './tongliumx.vue'

import Guizeshuom from './guizeshuom.vue'
import XwrdDialog from './xwrdDialog.vue'
import Jgheshi from './jgheshi.vue'

export default {
  name: "Shisjc",
  components: {
    LiushuiTable,
    Guizeshuom,
    XwrdDialog,
    Tongliumx,
    Jgheshi
  },
  data() {
    return {
      heshiOption:{
        show:false
      },
      isDisabled:{
        dj:true,
        sl:false,
        fy:false
      },
      xwrdDialog:{
        show:false
      },
      xwrdForm:{
        gzmc:'',
        xwrd:'',
        beizhu:'',
        mxxmdj:'',
        mxxmsl:'',
        mxxmje:''
      },
      //选中的违规行为对象
      xwrdChecd:{},
      xwRules:{
        xwrd:[{required:true,message:'必填项'}],
        zkdj:[{required:true,message:'必填项'}],
        wgsl:[{required:true,message:'必填项'}]
      },
      guizeOptions:{
        show:false
      },
      chaxunDialog:false,
      isAll:false,
      liushuiSetions:[],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 110,
      // renwuthree表格数据
      renwuthreeList: [],
      renwufourList:[],
      renwufiveList:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 序号字典
      idOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 机构名称字典
      jgmcOptions: [],
      // 规则分类字典
      gzflOptions: [],
      // 规则名称字典
      gzmcOptions: [],
      // 涉及就诊人数字典
      xjjzrsOptions: [],
      // 涉及明细数字典
      xjmxsOptions: [],
      // 涉及金额字典
      xjjeOptions: [],
      // 结算费用字典
      jsfyOptions: [],
      // 险种字典
      ybbfOptions: [],
      // 行政区字典
      xzqOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 异本地字典
      ybdOptions: [],
      // 数据开始时间字典
      datastarttimeOptions: [],
      // 信用代码字典
      xydmOptions: [],
      // 添加时间字典
      addtimeOptions: [],
      // 结算等级字典
      jsdjOptions: [],
      // 机构核实意见字典
      hsyjOptions: [],
      // 核实状态字典
      hsztOptions: [],
      // 核实时间字典
      hssjOptions: [],
      // 核实人字典
      hsrOptions: [],
      // 核实派发时间字典
      hspfsjOptions: [],
      // 任务批次号字典
      rwpcidOptions: [],
      // 已发送回智审字典
      issendOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      queryForm:{
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "序号不能为空", trigger: "blur" }
        ],
      },
      //默认只有一个规则筛查tab(第三层)
      tabsValue:'three',
      //本地或异地
      ybd:'1',
      //上页带过来的数据
      queryInfoFrom:{}
    }
  },
  created() {
    this.queryInfoFrom = this.$route.query
    this.getList();
    // this.getDicts("${column.dictType}").then(response => {
    //   this.idOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jgdmOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jgmcOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.gzflOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.gzmcOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xjjzrsOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xjmxsOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xjjeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jsfyOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ybbfOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xzqOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jslbOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.ybdOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.datastarttimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.xydmOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.addtimeOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.jsdjOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.hsyjOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.hsztOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.hssjOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.hsrOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.hspfsjOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.rwpcidOptions = response.data;
    // });
    // this.getDicts("${column.dictType}").then(response => {
    //   this.issendOptions = response.data;
    // });
  },
  methods: {
    //返回上一层
    goBackUpLevel(){
      switch(this.tabsValue) {
        case 'five':
          this.tabsValue = 'four'
          break
        case 'four':
          this.tabsValue = 'three'
          break
        default :
         break
      }
    },
    //选择行为回调
    onChecked(res){
      this.xwrdChecd = res
      this.xwrdForm.xwrd = res.wgxw
    },
    //点击行为认定
    handelXwrdDialog(){
      if(this.ids.length===0){
        this.msgError('请选择规则后再点行为认定')
      } else {
        this.xwrdDialog.show = true
      }
    },
    xwrdSubmit(){
      this.$refs['xwrdForm'].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            return false;
          }
        });
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
    /**
     * 流水号项目列表全选
     * 
    /**
     * 全选，取消全选
     */
    selectEvent(type,isAll) {
      this.isAll = isAll
      this.$refs.liuShuiTable[type]()
    },
    /**
     * 
     * 查看流水号项目汇总
    */
    async fluProject(row){
      await this.getList({rwpcid:row.rwpcid,jgdm:row.jgdm})
      this.$set(this,'tabsValue','four')
    },
    /** 查询renwu列表 */
    async getList(query) {
      // const params = query?{...query,...this.queryParams}:this.queryParams
      let params = {...this.queryForm,...this.queryParams}
      if(query){
        params = {...query,...params}
      } else {
        const {rwpcid,jgdm} = this.queryInfoFrom
        params = {rwpcid,jgdm,...params}
      }
      
      this.loading = true
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            res = await listRenwuthree(params)
            break;
          case 'four':
            res = await listRenwufour(params)
            break;
          case 'five':
            res = await listRenwufive(params)
            break;
          default:
            // params.statu = 2 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
            // res = await listRenwutwo(params)
            break;
        }
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows;
          this.total = res.total;
          if(this.chaxunDialog){
            this.$refs['chaxunForm'].resetFields()
            this.chaxunDialog = false
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        jgdm: null,
        jgmc: null,
        gzfl: null,
        gzmc: null,
        xjjzrs: null,
        xjmxs: null,
        xjje: null,
        jsfy: null,
        ybbf: null,
        xzq: null,
        jslb: null,
        ybd: null,
        datastarttime: null,
        xydm: null,
        addtime: null,
        jsdj: null,
        hsyj: null,
        hszt: null,
        hssj: null,
        hsr: null,
        hspfsj: null,
        rwpcid: null,
        issend: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      if(selection.length!==0){
        this.ids = selection.map(item => item.id)
        this.liushuiSetions= [...selection]
        this.isDisabled = this.isDisabledEvent(selection)
        this.xwrdForm.mxxmdj = selection[0].mxxmdj
        const shuliangList = selection.map(item=>item.mxxmsl)
        const feiyong = selection.map(item=>item.mxxmje)
        this.xwrdForm.mxxmsl = this.sum(shuliangList)
        this.xwrdForm.mxxmje = this.sum(feiyong)
        this.single = selection.length!==1
        this.multiple = !selection.length
      } else {
        this.ids=[]
        this.xwrdForm = {
          gzmc:'',
          xwrd:'',
          beizhu:'',
          mxxmdj:'',
          mxxmsl:'',
          mxxmje:''
        }
      }

    },
    //同流水下明细
    tongLiushuimx(row){
      this.tabsValue = 'five'
      this.getList()
    },
    sum(arr){
      let s = 0
      arr.forEach(item=>{
        item && (s+=item)
      })
      return s
    },
    //判断是否可以修改单价，数量，费用
    isDisabledEvent(sellection){
      let dj = true//单价
      let sl = false//数量
      let fy = false//费用
      if(sellection.length<1){
        dj = true
        sl = false
        fy = false
      } else {
        const mxxmbm = []
        const mxxmdj = []
        sellection.forEach(item => {
          if(!(mxxmbm.includes(item.mxxmbm))) {
            mxxmbm.push(item.mxxmbm)
          } 
          if(!(mxxmdj.includes(item.mxxmdj))) {
            mxxmdj.push(item.mxxmdj)
          }
        });
        if(mxxmbm.length===1){//项目明细编号相同,
          sl = false
          dj = mxxmdj.length>1?true:false
          fy = false
        }else{
          sl = true
          fy = true
          dj = true
        }
      }
     return {dj,sl,fy}
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加renwuthree";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRenwuthree(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwuthree";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenwuthree(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwuthree(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除renwuthree编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwuthree(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwuthree数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwuthree(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>