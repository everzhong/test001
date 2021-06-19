<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="序号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入序号"
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
      <el-form-item label="就医类型" prop="jslb">
        <el-input
          v-model="queryParams.jslb"
          placeholder="请输入就医类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="异本地" prop="ybd">
        <el-input
          v-model="queryParams.ybd"
          placeholder="请输入异本地"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="数据开始时间" prop="datastarttime">
        <el-date-picker clearable size="small"
          v-model="queryParams.datastarttime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择数据开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="数据结束时间" prop="dataendtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.dataendtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择数据结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="信用代码" prop="xydm">
        <el-input
          v-model="queryParams.xydm"
          placeholder="请输入信用代码"
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
      <el-form-item label="结算金额" prop="jsje">
        <el-input
          v-model="queryParams.jsje"
          placeholder="请输入结算金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算人次" prop="jsrc">
        <el-input
          v-model="queryParams.jsrc"
          placeholder="请输入结算人次"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="涉及违规数" prop="sjwgs">
        <el-input
          v-model="queryParams.sjwgs"
          placeholder="请输入涉及违规数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="疑点金额" prop="ydje">
        <el-input
          v-model="queryParams.ydje"
          placeholder="请输入疑点金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加时间" prop="addtime">
        <el-date-picker clearable size="small"
          v-model="queryParams.addtime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择添加时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="uptime">
        <el-date-picker clearable size="small"
          v-model="queryParams.uptime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="第三方筛查状态" prop="sancha">
        <el-select v-model="queryParams.sancha" placeholder="请选择第三方筛查状态" clearable size="small">
          <el-option
            v-for="dict in sanchaOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="行政区" prop="xzq">
        <el-input
          v-model="queryParams.xzq"
          placeholder="请输入行政区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算等级" prop="jsdj">
        <el-input
          v-model="queryParams.jsdj"
          placeholder="请输入结算等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="网审意见" prop="wsyj">
        <el-select v-model="queryParams.wsyj" placeholder="请选择网审意见" clearable size="small">
          <el-option
            v-for="dict in wsyjOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="网审人员" prop="wsry">
        <el-input
          v-model="queryParams.wsry"
          placeholder="请输入网审人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="网审人员2" prop="wsry2">
        <el-input
          v-model="queryParams.wsry2"
          placeholder="请输入网审人员2"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对象同意或驳回" prop="dxqd">
        <el-select v-model="queryParams.dxqd" placeholder="请选择对象同意或驳回" clearable size="small">
          <el-option
            v-for="dict in dxqdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="流程识别ID" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择流程识别ID" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="检查组ID" prop="jczid">
        <el-input
          v-model="queryParams.jczid"
          placeholder="请输入检查组ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否打印了通知" prop="isdayin">
        <el-select v-model="queryParams.isdayin" placeholder="请选择是否打印了通知" clearable size="small">
          <el-option
            v-for="dict in isdayinOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="打印通知书联系人" prop="dayinname">
        <el-input
          v-model="queryParams.dayinname"
          placeholder="请输入打印通知书联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="打印通知书联系电话(检查通知书)" prop="dayintel">
        <el-input
          v-model="queryParams.dayintel"
          placeholder="请输入打印通知书联系电话(检查通知书)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="打印日期" prop="dayinriqi">
        <el-date-picker clearable size="small"
          v-model="queryParams.dayinriqi"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择打印日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="打印通知书联系电话(纪律告知书)" prop="dayinphone">
        <el-input
          v-model="queryParams.dayinphone"
          placeholder="请输入打印通知书联系电话(纪律告知书)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="打印中的检查开始日期" prop="dayinstarttime">
        <el-date-picker clearable size="small"
          v-model="queryParams.dayinstarttime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择打印中的检查开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="形成结果同意或驳回" prop="dcjg">
        <el-select v-model="queryParams.dcjg" placeholder="请选择形成结果同意或驳回" clearable size="small">
          <el-option
            v-for="dict in dcjgOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="驳回意见" prop="bhyj">
        <el-input
          v-model="queryParams.bhyj"
          placeholder="请输入驳回意见"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构等级" prop="jgdj">
        <el-input
          v-model="queryParams.jgdj"
          placeholder="请输入机构等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构类型" prop="jglx">
        <el-input
          v-model="queryParams.jglx"
          placeholder="请输入机构类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="rwpcid">
        <el-input
          v-model="queryParams.rwpcid"
          placeholder="请输入批次号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构性质" prop="jgxz">
        <el-input
          v-model="queryParams.jgxz"
          placeholder="请输入机构性质"
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
          v-hasPermi="['renwu:renwutwo:add']"
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
          v-hasPermi="['renwu:renwutwo:edit']"
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
          v-hasPermi="['renwu:renwutwo:remove']"
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
          v-hasPermi="['renwu:renwutwo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="renwutwoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" :formatter="idFormat" />
      <el-table-column label="险种" align="center" prop="ybbf" :formatter="ybbfFormat" />
      <el-table-column label="就医类型" align="center" prop="jslb" :formatter="jslbFormat" />
      <el-table-column label="异本地" align="center" prop="ybd" :formatter="ybdFormat" />
      <el-table-column label="数据开始时间" align="center" prop="datastarttime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.datastarttime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据结束时间" align="center" prop="dataendtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dataendtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="信用代码" align="center" prop="xydm" :formatter="xydmFormat" />
      <el-table-column label="机构代码" align="center" prop="jgdm" :formatter="jgdmFormat" />
      <el-table-column label="机构名称" align="center" prop="jgmc" :formatter="jgmcFormat" />
      <el-table-column label="结算金额" align="center" prop="jsje" :formatter="jsjeFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.jsje,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算人次" align="center" prop="jsrc" :formatter="jsrcFormat" />
      <el-table-column label="涉及违规数" align="center" prop="sjwgs" :formatter="sjwgsFormat" />
      <el-table-column label="疑点金额" align="center" prop="ydje" :formatter="ydjeFormat">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.ydje,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center" prop="addtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="uptime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.uptime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="第三方筛查状态" align="center" prop="sancha" :formatter="sanchaFormat" />
      <el-table-column label="行政区" align="center" prop="xzq" :formatter="xzqFormat" />
      <el-table-column label="结算等级" align="center" prop="jsdj" :formatter="jsdjFormat" />
      <el-table-column label="网审意见" align="center" prop="wsyj" :formatter="wsyjFormat" />
      <el-table-column label="网审人员" align="center" prop="wsry" :formatter="wsryFormat" />
      <el-table-column label="网审人员2" align="center" prop="wsry2" :formatter="wsry2Format" />
      <el-table-column label="对象同意或驳回" align="center" prop="dxqd" :formatter="dxqdFormat" />
      <el-table-column label="流程识别ID" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="检查组ID" align="center" prop="jczid" :formatter="jczidFormat" />
      <el-table-column label="是否打印了通知" align="center" prop="isdayin" :formatter="isdayinFormat" />
      <el-table-column label="打印通知书联系人" align="center" prop="dayinname" :formatter="dayinnameFormat" />
      <el-table-column label="打印通知书联系电话(检查通知书)" align="center" prop="dayintel" :formatter="dayintelFormat" />
      <el-table-column label="打印日期" align="center" prop="dayinriqi" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dayinriqi, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印通知书联系电话(纪律告知书)" align="center" prop="dayinphone" :formatter="dayinphoneFormat" />
      <el-table-column label="打印中的检查开始日期" align="center" prop="dayinstarttime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dayinstarttime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="形成结果同意或驳回" align="center" prop="dcjg" :formatter="dcjgFormat" />
      <el-table-column label="驳回意见" align="center" prop="bhyj" :formatter="bhyjFormat" />
      <el-table-column label="机构等级" align="center" prop="jgdj" :formatter="jgdjFormat" />
      <el-table-column label="机构类型" align="center" prop="jglx" :formatter="jglxFormat" />
      <el-table-column label="批次号" align="center" prop="rwpcid" :formatter="rwpcidFormat" />
      <el-table-column label="机构性质" align="center" prop="jgxz" :formatter="jgxzFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['renwu:renwutwo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['renwu:renwutwo:remove']"
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

    <!-- 添加或修改renwutwo对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="序号" prop="id">
          <el-input v-model="form.id" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="险种" prop="ybbf">
          <el-input v-model="form.ybbf" placeholder="请输入险种" />
        </el-form-item>
        <el-form-item label="就医类型" prop="jslb">
          <el-input v-model="form.jslb" placeholder="请输入就医类型" />
        </el-form-item>
        <el-form-item label="异本地" prop="ybd">
          <el-input v-model="form.ybd" placeholder="请输入异本地" />
        </el-form-item>
        <el-form-item label="数据开始时间" prop="datastarttime">
          <el-date-picker clearable size="small"
            v-model="form.datastarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择数据开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数据结束时间" prop="dataendtime">
          <el-date-picker clearable size="small"
            v-model="form.dataendtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择数据结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="信用代码" prop="xydm">
          <el-input v-model="form.xydm" placeholder="请输入信用代码" />
        </el-form-item>
        <el-form-item label="机构代码" prop="jgdm">
          <el-input v-model="form.jgdm" placeholder="请输入机构代码" />
        </el-form-item>
        <el-form-item label="机构名称" prop="jgmc">
          <el-input v-model="form.jgmc" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="结算金额" prop="jsje">
          <el-input v-model="form.jsje" placeholder="请输入结算金额" />
        </el-form-item>
        <el-form-item label="结算人次" prop="jsrc">
          <el-input v-model="form.jsrc" placeholder="请输入结算人次" />
        </el-form-item>
        <el-form-item label="涉及违规数" prop="sjwgs">
          <el-input v-model="form.sjwgs" placeholder="请输入涉及违规数" />
        </el-form-item>
        <el-form-item label="疑点金额" prop="ydje">
          <el-input v-model="form.ydje" placeholder="请输入疑点金额" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addtime">
          <el-date-picker clearable size="small"
            v-model="form.addtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="uptime">
          <el-date-picker clearable size="small"
            v-model="form.uptime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="第三方筛查状态">
          <el-radio-group v-model="form.sancha">
            <el-radio
              v-for="dict in sanchaOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行政区" prop="xzq">
          <el-input v-model="form.xzq" placeholder="请输入行政区" />
        </el-form-item>
        <el-form-item label="结算等级" prop="jsdj">
          <el-input v-model="form.jsdj" placeholder="请输入结算等级" />
        </el-form-item>
        <el-form-item label="网审意见">
          <el-radio-group v-model="form.wsyj">
            <el-radio
              v-for="dict in wsyjOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="网审人员" prop="wsry">
          <el-input v-model="form.wsry" placeholder="请输入网审人员" />
        </el-form-item>
        <el-form-item label="网审人员2" prop="wsry2">
          <el-input v-model="form.wsry2" placeholder="请输入网审人员2" />
        </el-form-item>
        <el-form-item label="对象同意或驳回">
          <el-radio-group v-model="form.dxqd">
            <el-radio
              v-for="dict in dxqdOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="流程识别ID">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="检查组ID" prop="jczid">
          <el-input v-model="form.jczid" placeholder="请输入检查组ID" />
        </el-form-item>
        <el-form-item label="是否打印了通知">
          <el-radio-group v-model="form.isdayin">
            <el-radio
              v-for="dict in isdayinOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打印通知书联系人" prop="dayinname">
          <el-input v-model="form.dayinname" placeholder="请输入打印通知书联系人" />
        </el-form-item>
        <el-form-item label="打印通知书联系电话(检查通知书)" prop="dayintel">
          <el-input v-model="form.dayintel" placeholder="请输入打印通知书联系电话(检查通知书)" />
        </el-form-item>
        <el-form-item label="打印日期" prop="dayinriqi">
          <el-date-picker clearable size="small"
            v-model="form.dayinriqi"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择打印日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="打印通知书联系电话(纪律告知书)" prop="dayinphone">
          <el-input v-model="form.dayinphone" placeholder="请输入打印通知书联系电话(纪律告知书)" />
        </el-form-item>
        <el-form-item label="打印中的检查开始日期" prop="dayinstarttime">
          <el-date-picker clearable size="small"
            v-model="form.dayinstarttime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择打印中的检查开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="形成结果同意或驳回">
          <el-radio-group v-model="form.dcjg">
            <el-radio
              v-for="dict in dcjgOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回意见" prop="bhyj">
          <el-input v-model="form.bhyj" placeholder="请输入驳回意见" />
        </el-form-item>
        <el-form-item label="机构等级" prop="jgdj">
          <el-input v-model="form.jgdj" placeholder="请输入机构等级" />
        </el-form-item>
        <el-form-item label="机构类型" prop="jglx">
          <el-input v-model="form.jglx" placeholder="请输入机构类型" />
        </el-form-item>
        <el-form-item label="批次号" prop="rwpcid">
          <el-input v-model="form.rwpcid" placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="机构性质" prop="jgxz">
          <el-input v-model="form.jgxz" placeholder="请输入机构性质" />
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
import { listRenwutwo, getRenwutwo, delRenwutwo, addRenwutwo, updateRenwutwo, exportRenwutwo } from "@/api/renwu/renwutwo";

export default {
  name: "Renwutwo",
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
      // renwutwo表格数据
      renwutwoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 序号字典
      idOptions: [],
      // 险种字典
      ybbfOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 异本地字典
      ybdOptions: [],
      // 数据开始时间字典
      datastarttimeOptions: [],
      // 数据结束时间字典
      dataendtimeOptions: [],
      // 信用代码字典
      xydmOptions: [],
      // 机构代码字典
      jgdmOptions: [],
      // 机构名称字典
      jgmcOptions: [],
      // 结算金额字典
      jsjeOptions: [],
      // 结算人次字典
      jsrcOptions: [],
      // 涉及违规数字典
      sjwgsOptions: [],
      // 疑点金额字典
      ydjeOptions: [],
      // 添加时间字典
      addtimeOptions: [],
      // 更新时间字典
      uptimeOptions: [],
      // 第三方筛查状态字典
      sanchaOptions: [],
      // 行政区字典
      xzqOptions: [],
      // 结算等级字典
      jsdjOptions: [],
      // 网审意见字典
      wsyjOptions: [],
      // 网审人员字典
      wsryOptions: [],
      // 网审人员2字典
      wsry2Options: [],
      // 对象同意或驳回字典
      dxqdOptions: [],
      // 流程识别ID字典
      statusOptions: [],
      // 检查组ID字典
      jczidOptions: [],
      // 是否打印了通知字典
      isdayinOptions: [],
      // 打印通知书联系人字典
      dayinnameOptions: [],
      // 打印通知书联系电话(检查通知书)字典
      dayintelOptions: [],
      // 打印日期字典
      dayinriqiOptions: [],
      // 打印通知书联系电话(纪律告知书)字典
      dayinphoneOptions: [],
      // 打印中的检查开始日期字典
      dayinstarttimeOptions: [],
      // 形成结果同意或驳回字典
      dcjgOptions: [],
      // 驳回意见字典
      bhyjOptions: [],
      // 机构等级字典
      jgdjOptions: [],
      // 机构类型字典
      jglxOptions: [],
      // 批次号字典
      rwpcidOptions: [],
      // 机构性质字典
      jgxzOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        ybbf: null,
        jslb: null,
        ybd: null,
        datastarttime: null,
        dataendtime: null,
        xydm: null,
        jgdm: null,
        jgmc: null,
        jsje: null,
        jsrc: null,
        sjwgs: null,
        ydje: null,
        addtime: null,
        uptime: null,
        sancha: null,
        xzq: null,
        jsdj: null,
        wsyj: null,
        wsry: null,
        wsry2: null,
        dxqd: null,
        status: null,
        jczid: null,
        isdayin: null,
        dayinname: null,
        dayintel: null,
        dayinriqi: null,
        dayinphone: null,
        dayinstarttime: null,
        dcjg: null,
        bhyj: null,
        jgdj: null,
        jglx: null,
        rwpcid: null,
        jgxz: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "序号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("${column.dictType}").then(response => {
      this.idOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ybbfOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jslbOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ybdOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.datastarttimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.dataendtimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xydmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgdmOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgmcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jsjeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jsrcOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.sjwgsOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.ydjeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.addtimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.uptimeOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.sanchaOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.xzqOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jsdjOptions = response.data;
    });
    this.getDicts("sys_common_check").then(response => {
      this.wsyjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.wsryOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.wsry2Options = response.data;
    });
    this.getDicts("sys_common_yesno").then(response => {
      this.dxqdOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jczidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.isdayinOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.dayinnameOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.dayintelOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.dayinriqiOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.dayinphoneOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.dayinstarttimeOptions = response.data;
    });
    this.getDicts("sys_common_yesno").then(response => {
      this.dcjgOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.bhyjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgdjOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jglxOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.rwpcidOptions = response.data;
    });
    this.getDicts("${column.dictType}").then(response => {
      this.jgxzOptions = response.data;
    });
  },
  methods: {
    /** 查询renwutwo列表 */
    getList() {
      this.loading = true;
      listRenwutwo(this.queryParams).then(response => {
        this.renwutwoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 序号字典翻译
    idFormat(row, column) {
      return this.selectDictLabel(this.idOptions, row.id);
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabel(this.ybbfOptions, row.ybbf);
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
    // 数据结束时间字典翻译
    dataendtimeFormat(row, column) {
      return this.selectDictLabel(this.dataendtimeOptions, row.dataendtime);
    },
    // 信用代码字典翻译
    xydmFormat(row, column) {
      return this.selectDictLabel(this.xydmOptions, row.xydm);
    },
    // 机构代码字典翻译
    jgdmFormat(row, column) {
      return this.selectDictLabel(this.jgdmOptions, row.jgdm);
    },
    // 机构名称字典翻译
    jgmcFormat(row, column) {
      return this.selectDictLabel(this.jgmcOptions, row.jgmc);
    },
    // 结算金额字典翻译
    jsjeFormat(row, column) {
      return this.selectDictLabel(this.jsjeOptions, row.jsje);
    },
    // 结算人次字典翻译
    jsrcFormat(row, column) {
      return this.selectDictLabel(this.jsrcOptions, row.jsrc);
    },
    // 涉及违规数字典翻译
    sjwgsFormat(row, column) {
      return this.selectDictLabel(this.sjwgsOptions, row.sjwgs);
    },
    // 疑点金额字典翻译
    ydjeFormat(row, column) {
      return this.selectDictLabel(this.ydjeOptions, row.ydje);
    },
    // 添加时间字典翻译
    addtimeFormat(row, column) {
      return this.selectDictLabel(this.addtimeOptions, row.addtime);
    },
    // 更新时间字典翻译
    uptimeFormat(row, column) {
      return this.selectDictLabel(this.uptimeOptions, row.uptime);
    },
    // 第三方筛查状态字典翻译
    sanchaFormat(row, column) {
      return this.selectDictLabel(this.sanchaOptions, row.sancha);
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
    },
    // 结算等级字典翻译
    jsdjFormat(row, column) {
      return this.selectDictLabel(this.jsdjOptions, row.jsdj);
    },
    // 网审意见字典翻译
    wsyjFormat(row, column) {
      return this.selectDictLabel(this.wsyjOptions, row.wsyj);
    },
    // 网审人员字典翻译
    wsryFormat(row, column) {
      return this.selectDictLabel(this.wsryOptions, row.wsry);
    },
    // 网审人员2字典翻译
    wsry2Format(row, column) {
      return this.selectDictLabel(this.wsry2Options, row.wsry2);
    },
    // 对象同意或驳回字典翻译
    dxqdFormat(row, column) {
      return this.selectDictLabel(this.dxqdOptions, row.dxqd);
    },
    // 流程识别ID字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 检查组ID字典翻译
    jczidFormat(row, column) {
      return this.selectDictLabel(this.jczidOptions, row.jczid);
    },
    // 是否打印了通知字典翻译
    isdayinFormat(row, column) {
      return this.selectDictLabel(this.isdayinOptions, row.isdayin);
    },
    // 打印通知书联系人字典翻译
    dayinnameFormat(row, column) {
      return this.selectDictLabel(this.dayinnameOptions, row.dayinname);
    },
    // 打印通知书联系电话(检查通知书)字典翻译
    dayintelFormat(row, column) {
      return this.selectDictLabel(this.dayintelOptions, row.dayintel);
    },
    // 打印日期字典翻译
    dayinriqiFormat(row, column) {
      return this.selectDictLabel(this.dayinriqiOptions, row.dayinriqi);
    },
    // 打印通知书联系电话(纪律告知书)字典翻译
    dayinphoneFormat(row, column) {
      return this.selectDictLabel(this.dayinphoneOptions, row.dayinphone);
    },
    // 打印中的检查开始日期字典翻译
    dayinstarttimeFormat(row, column) {
      return this.selectDictLabel(this.dayinstarttimeOptions, row.dayinstarttime);
    },
    // 形成结果同意或驳回字典翻译
    dcjgFormat(row, column) {
      return this.selectDictLabel(this.dcjgOptions, row.dcjg);
    },
    // 驳回意见字典翻译
    bhyjFormat(row, column) {
      return this.selectDictLabel(this.bhyjOptions, row.bhyj);
    },
    // 机构等级字典翻译
    jgdjFormat(row, column) {
      return this.selectDictLabel(this.jgdjOptions, row.jgdj);
    },
    // 机构类型字典翻译
    jglxFormat(row, column) {
      return this.selectDictLabel(this.jglxOptions, row.jglx);
    },
    // 批次号字典翻译
    rwpcidFormat(row, column) {
      return this.selectDictLabel(this.rwpcidOptions, row.rwpcid);
    },
    // 机构性质字典翻译
    jgxzFormat(row, column) {
      return this.selectDictLabel(this.jgxzOptions, row.jgxz);
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
        ybbf: null,
        jslb: null,
        ybd: null,
        datastarttime: null,
        dataendtime: null,
        xydm: null,
        jgdm: null,
        jgmc: null,
        jsje: null,
        jsrc: null,
        sjwgs: null,
        ydje: null,
        addtime: null,
        uptime: null,
        sancha: 0,
        xzq: null,
        jsdj: null,
        wsyj: "0",
        wsry: null,
        wsry2: null,
        dxqd: "0",
        status: 0,
        jczid: null,
        isdayin: 0,
        dayinname: null,
        dayintel: null,
        dayinriqi: null,
        dayinphone: null,
        dayinstarttime: null,
        dcjg: "0",
        bhyj: null,
        jgdj: null,
        jglx: null,
        rwpcid: null,
        jgxz: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加renwutwo";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRenwutwo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改renwutwo";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRenwutwo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRenwutwo(this.form).then(response => {
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
      this.$confirm('是否确认删除renwutwo编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRenwutwo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有renwutwo数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportRenwutwo(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
    }
  }
};
</script>