<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="明细项目金额" prop="mxxmje">
        <el-input
          v-model="queryParams.mxxmje"
          placeholder="请输入明细项目金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目交易金额" prop="mxxmjyfy">
        <el-input
          v-model="queryParams.mxxmjyfy"
          placeholder="请输入明细项目交易金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目医保结算金额" prop="mxxmybjsfy">
        <el-input
          v-model="queryParams.mxxmybjsfy"
          placeholder="请输入明细项目医保结算金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目使用时间" prop="mxxmsysj">
        <el-input
          v-model="queryParams.mxxmsysj"
          placeholder="请输入明细项目使用时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="就医类型" prop="jslb">
        <el-input
          v-model="queryParams.jslb"
          placeholder="请输入就医类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="险种" prop="ybbf">
        <el-input
          v-model="queryParams.ybbf"
          placeholder="请输入险种"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="记录行号" prop="jlhh">
        <el-input
          v-model="queryParams.jlhh"
          placeholder="请输入记录行号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行为认定" prop="xwrd">
        <el-input
          v-model="queryParams.xwrd"
          placeholder="请输入行为认定"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务流水号" prop="rwpcid">
        <el-input
          v-model="queryParams.rwpcid"
          placeholder="请输入任务流水号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对应的交易明细表ID" prop="mxid">
        <el-input
          v-model="queryParams.mxid"
          placeholder="请输入对应的交易明细表ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构代码" prop="jgdm">
        <el-input
          v-model="queryParams.jgdm"
          placeholder="请输入机构代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构名称" prop="jgmc">
        <el-input
          v-model="queryParams.jgmc"
          placeholder="请输入机构名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规则分类" prop="gzfl">
        <el-input
          v-model="queryParams.gzfl"
          placeholder="请输入规则分类"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="科室代码" prop="ksdm">
        <el-input
          v-model="queryParams.ksdm"
          placeholder="请输入科室代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="科室名称" prop="ksmc">
        <el-input
          v-model="queryParams.ksmc"
          placeholder="请输入科室名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医师代码" prop="ysgh">
        <el-input
          v-model="queryParams.ysgh"
          placeholder="请输入医师代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流水号" prop="lsh">
        <el-input
          v-model="queryParams.lsh"
          placeholder="请输入流水号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="卡号" prop="kh">
        <el-input
          v-model="queryParams.kh"
          placeholder="请输入卡号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参保人姓名" prop="xm">
        <el-input
          v-model="queryParams.xm"
          placeholder="请输入参保人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算日期" prop="jsrqsj">
        <el-input
          v-model="queryParams.jsrqsj"
          placeholder="请输入结算日期"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目编号" prop="mxxmbm">
        <el-input
          v-model="queryParams.mxxmbm"
          placeholder="请输入明细项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目单价" prop="mxxmdj">
        <el-input
          v-model="queryParams.mxxmdj"
          placeholder="请输入明细项目单价"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目单位" prop="mxxmdw">
        <el-input
          v-model="queryParams.mxxmdw"
          placeholder="请输入明细项目单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="明细项目数量" prop="mxxmsl">
        <el-input
          v-model="queryParams.mxxmsl"
          placeholder="请输入明细项目数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="追款单价" prop="zkdj">
        <el-input
          v-model="queryParams.zkdj"
          placeholder="请输入追款单价"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="违规数量" prop="wgsl">
        <el-input
          v-model="queryParams.wgsl"
          placeholder="请输入违规数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="违规费用" prop="wgfy">
        <el-input
          v-model="queryParams.wgfy"
          placeholder="请输入违规费用"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行为认定人" prop="xwrdr">
        <el-input
          v-model="queryParams.xwrdr"
          placeholder="请输入行为认定人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['renwu:renwufive:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['renwu:renwufive:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['renwu:renwufive:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
		  :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['renwu:renwufive:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="renwufiveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="明细项目金额" align="center" prop="mxxmje" :formatter="mxxmjeFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmje,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="明细项目交易金额" align="center" prop="mxxmjyfy" :formatter="mxxmjyfyFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmjyfy,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="明细项目医保结算金额" align="center" prop="mxxmybjsfy" :formatter="mxxmybjsfyFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.mxxmybjsfy,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="明细项目使用时间" align="center" prop="mxxmsysj" :formatter="mxxmsysjFormat" />
      <el-table-column label="就医类型" align="center" prop="jslb" :formatter="jslbFormat" />
      <el-table-column label="险种" align="center" prop="ybbf" :formatter="ybbfFormat" />
      <el-table-column label="记录行号" align="center" prop="jlhh" :formatter="jlhhFormat" />
      <el-table-column label="行为认定" align="center" prop="xwrd" :formatter="xwrdFormat" />
      <el-table-column label="ID" align="center" prop="id" :formatter="idFormat" />
      <el-table-column label="任务流水号" align="center" prop="rwpcid" :formatter="rwpcidFormat" />
      <el-table-column label="对应的交易明细表ID" align="center" prop="mxid" :formatter="mxidFormat" />
      <el-table-column label="机构代码" align="center" prop="jgdm" :formatter="jgdmFormat" />
      <el-table-column label="机构名称" align="center" prop="jgmc" :formatter="jgmcFormat" />
      <el-table-column label="规则分类" align="center" prop="gzfl" :formatter="gzflFormat" />
      <el-table-column label="科室代码" align="center" prop="ksdm" :formatter="ksdmFormat" />
      <el-table-column label="科室名称" align="center" prop="ksmc" :formatter="ksmcFormat" />
      <el-table-column label="医师代码" align="center" prop="ysgh" :formatter="ysghFormat" />
      <el-table-column label="流水号" align="center" prop="lsh" :formatter="lshFormat" />
      <el-table-column label="卡号" align="center" prop="kh" :formatter="khFormat" />
      <el-table-column label="参保人姓名" align="center" prop="xm" :formatter="xmFormat" />
      <el-table-column label="结算日期" align="center" prop="jsrqsj" :formatter="jsrqsjFormat" />
      <el-table-column label="明细项目编号" align="center" prop="mxxmbm" :formatter="mxxmbmFormat" />
      <el-table-column label="明细项目单价" align="center" prop="mxxmdj" :formatter="mxxmdjFormat" />
      <el-table-column label="明细项目单位" align="center" prop="mxxmdw" :formatter="mxxmdwFormat" />
      <el-table-column label="明细项目数量" align="center" prop="mxxmsl" :formatter="mxxmslFormat" />
      <el-table-column label="追款单价" align="center" prop="zkdj" :formatter="zkdjFormat" />
      <el-table-column label="违规数量" align="center" prop="wgsl" :formatter="wgslFormat" />
      <el-table-column label="违规费用" align="center" prop="wgfy" :formatter="wgfyFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.wgfy,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="行为认定人" align="center" prop="xwrdr" :formatter="xwrdrFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['renwu:renwufive:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['renwu:renwufive:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改renwufive对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="明细项目金额" prop="mxxmje">
          <el-input v-model="form.mxxmje" placeholder="请输入明细项目金额" />
        </el-form-item>
        <el-form-item label="明细项目交易金额" prop="mxxmjyfy">
          <el-input v-model="form.mxxmjyfy" placeholder="请输入明细项目交易金额" />
        </el-form-item>
        <el-form-item label="明细项目医保结算金额" prop="mxxmybjsfy">
          <el-input v-model="form.mxxmybjsfy" placeholder="请输入明细项目医保结算金额" />
        </el-form-item>
        <el-form-item label="明细项目使用时间" prop="mxxmsysj">
          <el-input v-model="form.mxxmsysj" placeholder="请输入明细项目使用时间" />
        </el-form-item>
        <el-form-item label="就医类型" prop="jslb">
          <el-input v-model="form.jslb" placeholder="请输入就医类型" />
        </el-form-item>
        <el-form-item label="险种" prop="ybbf">
          <el-input v-model="form.ybbf" placeholder="请输入险种" />
        </el-form-item>
        <el-form-item label="记录行号" prop="jlhh">
          <el-input v-model="form.jlhh" placeholder="请输入记录行号" />
        </el-form-item>
        <el-form-item label="行为认定" prop="xwrd">
          <el-input v-model="form.xwrd" placeholder="请输入行为认定" />
        </el-form-item>
        <el-form-item label="ID" prop="id">
          <el-input v-model="form.id" placeholder="请输入ID" />
        </el-form-item>
        <el-form-item label="任务流水号" prop="rwpcid">
          <el-input v-model="form.rwpcid" placeholder="请输入任务流水号" />
        </el-form-item>
        <el-form-item label="对应的交易明细表ID" prop="mxid">
          <el-input v-model="form.mxid" placeholder="请输入对应的交易明细表ID" />
        </el-form-item>
        <el-form-item label="机构代码" prop="jgdm">
          <el-input v-model="form.jgdm" placeholder="请输入机构代码" />
        </el-form-item>
        <el-form-item label="机构名称" prop="jgmc">
          <el-input v-model="form.jgmc" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="规则分类" prop="gzfl">
          <el-input v-model="form.gzfl" placeholder="请输入规则分类" />
        </el-form-item>
        <el-form-item label="科室代码" prop="ksdm">
          <el-input v-model="form.ksdm" placeholder="请输入科室代码" />
        </el-form-item>
        <el-form-item label="科室名称" prop="ksmc">
          <el-input v-model="form.ksmc" placeholder="请输入科室名称" />
        </el-form-item>
        <el-form-item label="医师代码" prop="ysgh">
          <el-input v-model="form.ysgh" placeholder="请输入医师代码" />
        </el-form-item>
        <el-form-item label="流水号" prop="lsh">
          <el-input v-model="form.lsh" placeholder="请输入流水号" />
        </el-form-item>
        <el-form-item label="卡号" prop="kh">
          <el-input v-model="form.kh" placeholder="请输入卡号" />
        </el-form-item>
        <el-form-item label="参保人姓名" prop="xm">
          <el-input v-model="form.xm" placeholder="请输入参保人姓名" />
        </el-form-item>
        <el-form-item label="结算日期" prop="jsrqsj">
          <el-input v-model="form.jsrqsj" placeholder="请输入结算日期" />
        </el-form-item>
        <el-form-item label="明细项目编号" prop="mxxmbm">
          <el-input v-model="form.mxxmbm" placeholder="请输入明细项目编号" />
        </el-form-item>
        <el-form-item label="明细项目单价" prop="mxxmdj">
          <el-input v-model="form.mxxmdj" placeholder="请输入明细项目单价" />
        </el-form-item>
        <el-form-item label="明细项目单位" prop="mxxmdw">
          <el-input v-model="form.mxxmdw" placeholder="请输入明细项目单位" />
        </el-form-item>
        <el-form-item label="明细项目数量" prop="mxxmsl">
          <el-input v-model="form.mxxmsl" placeholder="请输入明细项目数量" />
        </el-form-item>
        <el-form-item label="追款单价" prop="zkdj">
          <el-input v-model="form.zkdj" placeholder="请输入追款单价" />
        </el-form-item>
        <el-form-item label="违规数量" prop="wgsl">
          <el-input v-model="form.wgsl" placeholder="请输入违规数量" />
        </el-form-item>
        <el-form-item label="违规费用" prop="wgfy">
          <el-input v-model="form.wgfy" placeholder="请输入违规费用" />
        </el-form-item>
        <el-form-item label="行为认定人" prop="xwrdr">
          <el-input v-model="form.xwrdr" placeholder="请输入行为认定人" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRenwufive, getRenwufive, delRenwufive, addRenwufive, updateRenwufive, exportRenwufive } from "@/api/renwu/renwufive";

export default {
  name: "Renwufive",
  components: {
  },
  data() {
    return {
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
      total: 0,
      // renwufive表格数据
      renwufiveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 明细项目金额字典
      mxxmjeOptions: [],
      // 明细项目交易金额字典
      mxxmjyfyOptions: [],
      // 明细项目医保结算金额字典
      mxxmybjsfyOptions: [],
      // 明细项目使用时间字典
      mxxmsysjOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 险种字典
      ybbfOptions: [],
      // 记录行号字典
      jlhhOptions: [],
      // 行为认定字典
      xwrdOptions: [],
      // ID字典
      idOptions: [],
      // 任务流水号字典
      rwpcidOptions: [],
      // 对应的交易明细表ID字典
      mxidOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 机构名称字典
      jgmcOptions: [],
      // 规则分类字典
      gzflOptions: [],
      // 科室代码字典
      ksdmOptions: [],
      // 科室名称字典
      ksmcOptions: [],
      // 医师代码字典
      ysghOptions: [],
      // 流水号字典
      lshOptions: [],
      // 卡号字典
      khOptions: [],
      // 参保人姓名字典
      xmOptions: [],
      // 结算日期字典
      jsrqsjOptions: [],
      // 明细项目编号字典
      mxxmbmOptions: [],
      // 明细项目单价字典
      mxxmdjOptions: [],
      // 明细项目单位字典
      mxxmdwOptions: [],
      // 明细项目数量字典
      mxxmslOptions: [],
      // 追款单价字典
      zkdjOptions: [],
      // 违规数量字典
      wgslOptions: [],
      // 违规费用字典
      wgfyOptions: [],
      // 行为认定人字典
      xwrdrOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mxxmje: null,
        mxxmjyfy: null,
        mxxmybjsfy: null,
        mxxmsysj: null,
        jslb: null,
        ybbf: null,
        jlhh: null,
        xwrd: null,
        id: null,
        rwpcid: null,
        mxid: null,
        jgdm: null,
        jgmc: null,
        gzfl: null,
        ksdm: null,
        ksmc: null,
        ysgh: null,
        lsh: null,
        kh: null,
        xm: null,
        jsrqsj: null,
        mxxmbm: null,
        mxxmdj: null,
        mxxmdw: null,
        mxxmsl: null,
        zkdj: null,
        wgsl: null,
        wgfy: null,
        xwrdr: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmjeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmjyfyOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmybjsfyOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmsysjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jslbOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ybbfOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jlhhOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xwrdOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.idOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.rwpcidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgdmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgmcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.gzflOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ksdmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ksmcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ysghOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.lshOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.khOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jsrqsjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmbmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmdjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmdwOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.mxxmslOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.zkdjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.wgslOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.wgfyOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xwrdrOptions = response.data;
    });
  },
  methods: {
    /** 查询renwufive列表 */
    getList() {
      this.loading = true;
      listRenwufive(this.queryParams).then(response => {
        this.renwufiveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 明细项目金额字典翻译
    mxxmjeFormat(row, column) {
      return this.selectDictLabels(this.mxxmjeOptions, row.mxxmje);
    },
    // 明细项目交易金额字典翻译
    mxxmjyfyFormat(row, column) {
      return this.selectDictLabels(this.mxxmjyfyOptions, row.mxxmjyfy);
    },
    // 明细项目医保结算金额字典翻译
    mxxmybjsfyFormat(row, column) {
      return this.selectDictLabels(this.mxxmybjsfyOptions, row.mxxmybjsfy);
    },
    // 明细项目使用时间字典翻译
    mxxmsysjFormat(row, column) {
      return this.selectDictLabels(this.mxxmsysjOptions, row.mxxmsysj);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 记录行号字典翻译
    jlhhFormat(row, column) {
      return this.selectDictLabels(this.jlhhOptions, row.jlhh);
    },
    // 行为认定字典翻译
    xwrdFormat(row, column) {
      return this.selectDictLabels(this.xwrdOptions, row.xwrd);
    },
    // ID字典翻译
    idFormat(row, column) {
      return this.selectDictLabels(this.idOptions, row.id);
    },
    // 任务流水号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabels(this.rwpcidOptions, row.rwpcid);
    },
    // 对应的交易明细表ID字典翻译
    mxidFormat(row, column) {
      return this.selectDictLabels(this.mxidOptions, row.mxid);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabels(this.jgdmOptions, row.jgdm);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabels(this.jgmcOptions, row.jgmc);
    },
    // 规则分类字典翻译
    gzflFormat(row, column) {
      return this.selectDictLabels(this.gzflOptions, row.gzfl);
    },
    // 科室代码字典翻译
    ksdmFormat(row, column) {
      return this.selectDictLabels(this.ksdmOptions, row.ksdm);
    },
    // 科室名称字典翻译
    ksmcFormat(row, column) {
      return this.selectDictLabels(this.ksmcOptions, row.ksmc);
    },
    // 医师代码字典翻译
    ysghFormat(row, column) {
      return this.selectDictLabels(this.ysghOptions, row.ysgh);
    },
    // 流水号字典翻译
    lshFormat(row, column) {
      return this.selectDictLabels(this.lshOptions, row.lsh);
    },
    // 卡号字典翻译
    khFormat(row, column) {
      return this.selectDictLabels(this.khOptions, row.kh);
    },
    // 参保人姓名字典翻译
    xmFormat(row, column) {
      return this.selectDictLabels(this.xmOptions, row.xm);
    },
    // 结算日期字典翻译
    jsrqsjFormat(row, column) {
      return this.selectDictLabels(this.jsrqsjOptions, row.jsrqsj);
    },
    // 明细项目编号字典翻译
    mxxmbmFormat(row, column) {
      return this.selectDictLabels(this.mxxmbmOptions, row.mxxmbm);
    },
    // 明细项目单价字典翻译
    mxxmdjFormat(row, column) {
      return this.selectDictLabels(this.mxxmdjOptions, row.mxxmdj);
    },
    // 明细项目单位字典翻译
    mxxmdwFormat(row, column) {
      return this.selectDictLabels(this.mxxmdwOptions, row.mxxmdw);
    },
    // 明细项目数量字典翻译
    mxxmslFormat(row, column) {
      return this.selectDictLabels(this.mxxmslOptions, row.mxxmsl);
    },
    // 追款单价字典翻译
    zkdjFormat(row, column) {
      return this.selectDictLabels(this.zkdjOptions, row.zkdj);
    },
    // 违规数量字典翻译
    wgslFormat(row, column) {
      return this.selectDictLabels(this.wgslOptions, row.wgsl);
    },
    // 违规费用字典翻译
    wgfyFormat(row, column) {
      return this.selectDictLabels(this.wgfyOptions, row.wgfy);
    },
    // 行为认定人字典翻译
    xwrdrFormat(row, column) {
      return this.selectDictLabels(this.xwrdrOptions, row.xwrdr);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        mxxmje: null,
        mxxmjyfy: null,
        mxxmybjsfy: null,
        mxxmsysj: null,
        jslb: null,
        ybbf: null,
        jlhh: null,
        xwrd: null,
        id: null,
        rwpcid: null,
        mxid: null,
        jgdm: null,
        jgmc: null,
        gzfl: null,
        ksdm: null,
        ksmc: null,
        ysgh: null,
        lsh: null,
        kh: null,
        xm: null,
        jsrqsj: null,
        mxxmbm: null,
        mxxmdj: null,
        mxxmdw: null,
        mxxmsl: null,
        zkdj: null,
        wgsl: null,
        wgfy: null,
        xwrdr: null
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
      this.ids = selection.map(item => item.mxxmje)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加renwufive";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const mxxmje = row.mxxmje || this.ids
      getRenwufive(mxxmje).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwufive";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.mxxmje != null) {
            updateRenwufive(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwufive(this.form).then(response => {
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
      const mxxmjes = row.mxxmje || this.ids;
      this.$confirm('是否确认删除renwufive编号为"' + mxxmjes + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwufive(mxxmjes);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwufive数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwufive(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>