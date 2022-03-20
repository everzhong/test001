<template>
  <div class="app-container">
    <el-form class="top-search" :model="query" ref="searchForm" :inline="true"  label-width="60px" style="max-height:94px;overflow:auto">
      <div>
        <el-form-item label="批次号" prop="rwpcid">
            <el-input
              v-model="query.rwpcid"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="机构名称" prop="jgmc">
            <el-input
              v-model="query.jgmc"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="机构代码 " prop="jgdm">
             <el-input
              v-model="query.jgdm"
              placeholder="请输入"
              clearable
              size="small"
              style="width: 180px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="抽取状态" prop="sccqstatus">
            <el-select v-model="query.sccqstatus" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in chouquOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="执行状态" prop="scstatus">
            <el-select v-model="query.scstatus" placeholder="全部" clearable size="small" style="width: 180px">
              <el-option
                v-for="dict in zhixOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
      </div>
      <div>
        <el-form-item style="margin-right:0;text-align:right">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div v-loading="loading" class="table-main" :style="{top:tableHeight}">
      <sTable :data="renwuthreeList" :header="tableHeader" :fixedNum="1">
        <el-table-column type="selection" width="55" align="center" slot="fixed" fixed/>
        <el-table-column label="操作" align="center" slot="operate" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="openUrl(scope.row)" :disabled="scope.row.sccqstatus!=3">数据筛查</el-button>
          </template>
        </el-table-column>
      </sTable>
    </div>
    <pagination
      class="fixed-bottom"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { setShujusc,listRenwutwosc} from '@/api/renwu/renwutwo'
import RenwuthreeTable from '../../common/renwuthreeTable'
export default {
  name: "Thirdcheck",
  components: {
    RenwuthreeTable,
  },
  data() {
    return {
      tableHeader:[{
        prop: 'rwpcid',
        label: '批次号',
        fixedWidth:30
      },{
        prop: 'jgdm',
        label: '机构代码',
        fixedWidth:55,
      },{
        prop: 'jgmc',
        label: '机构名称',
        fixedWidth:60,
      },{
        prop: 'scrwid',
        label: '筛查任务ID',
      },{
        prop: 'addtime',
        label: '生成任务时间',
        viewFun:(time)=>{
          return this.parseTime(time)
        }
      },{
        label:"数据开始日期",
        prop:'datastarttime',
        width:'150px',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}')
        }
      },{
        label:"数据结束日期",
        prop:'dataendtime',
        width:'150px',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}')
        }
      },{
        prop: 'jsdj',
        label: '结算等级',
        // viewFun: (jsdj)=>{
        //   return this.selectDictLabels(this.$store.getters.jsdjDic, jsdj)
        // }
      },{
        prop: 'sccqstatus',
        label: '数据抽取状态',
        width:'150px',
        viewFun: (sccqstatus)=>{
          return sccqstatus==1?'未开始':sccqstatus==2?'执行中':sccqstatus==3?'完成':sccqstatus==4?'无需抽取':'--'
        }
      },{
        prop: 'scstatus',
        label: '规则执行状态',
        width:'150px',
        viewFun: (scstatus)=>{
          return scstatus==1?'未开始':scstatus==2?'执行中':scstatus==3?'完成':'--'
        }
      }],
      tableHeight:0,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // renwutwo表格数据
      renwutwoList: [],
      renwuthreeList: [],
      renwufourList: [],
      chouquOptions: [
        {dictValue:1,dictLabel:'未开始'},
        {dictValue:2,dictLabel:'执行中'},
        {dictValue:3,dictLabel:'完成'},
        {dictValue:4,dictLabel:'无需抽取'}
      ],
      zhixOptions: [
        {dictValue:1,dictLabel:'未开始'},
        {dictValue:2,dictLabel:'执行中'},
        {dictValue:3,dictLabel:'完成'},
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      query:{
        rwpcid:'',//任务批次号
        jgmc:'',//机构名称
        jgdm:'',//机构代码
        sccqstatus:'',//抽取状态
        scstatus:''//执行状态
      },
      //
      tabsValue:'two',
      hasThirdUncheck:false
    };
  },
  created() {
    this.getList();
  },
  mounted(){
    this.tableHeight = this.calcTableHeight(6)
  },
  methods: {
    openUrl(row){
      const {scrwid,scname,datastarttime,dataendtime,jgdm,id,jczid} = row
      setShujusc({
        id,
        scrwid,
        scname,
        datastarttime,
        dataendtime,
        createBy:this.$store.getters.name,
        jgdm,
        jczid,
        deptId:this.$store.getters.userId
      })
      const port = sessionStorage.getItem('sfPort')
      window.open(`${location.protocol}//${location.hostname}:${port}/#/scenarioConfiguration`)
    },
    async getList(options) {
      const params = options?{...this.queryParams,...options}:this.queryParams
      this.loading = true
      try {
        const res = await listRenwutwosc(params)
        if(res.code===200){
          this[`renwuthreeList`] = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      !this.query.sccqstatus&&(delete this.query.sccqstatus);
      this.getList(this.query);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("searchForm");
      this.handleQuery();
    },
  }
};
</script>
<style lang="scss" scoped>
.tabs-part {
  clear: both;
}
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