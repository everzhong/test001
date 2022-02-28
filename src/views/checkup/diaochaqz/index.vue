<template>
  <div class="app-container">
    <SearchItem @handleQuery="handleQuery" style="height:94px"/>
    <div v-loading="loading" class="table-main">
      <sTable :data="renwutwoList" :header="tableHeader" :fixedNum="1">
        <el-table-column label="序号" type="index" align="center" slot="fixed" width="70"/>
        <el-table-column label="操作" align="center" min-width="100" slot="operate">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="naviGateToQz(scope.row)"
            >调查取证</el-button>
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
import { listRenwutwo } from "@/api/renwu/renwutwo"

import SearchItem from '../../common/objSearchItem'
export default {
  name: "Diaochaqz",
  components: {
    SearchItem,
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
        prop: 'ajly',
        label: '案件来源',
        fixedWidth:50,
        viewFun: (ajly)=>{
          return this.selectDictLabels(this.$store.getters.ajlyDic, ajly)
        },
      },{
        prop: 'jcfs',
        label: '检查方式',
        width:'auto'
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
        prop: 'jsdj',
        label: '结算等级',
        viewFun: (jsdj)=>{
          return this.selectDictLabels(this.$store.getters.jsdjDic, jsdj)
        }
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
        prop: 'xydm',
        label: '统一社会信用代码',
      },{
        prop: 'jcjg',
        label: '承办机构',
      },{
        prop: 'jczname',
        label: '检查组',
      }],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      renwutwoList: [],
      renwuthreeList: [],
      renwufourList: [],
      // 险种字典
      ybbfOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 行政区字典
      xzqOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic

  },
  methods: {
    /** 查询renwutwo列表 */
    async getList(query) {
      const params = query?{...query,...this.queryParams}:this.queryParams
      params.status = 3
      this.loading = true
      try {
        const res = await listRenwutwo(params)
        if(res.code===200){
          this.renwutwoList = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
    /** 搜索按钮操作 */
    handleQuery(query) {
      this.queryParams.pageNum = 1;
      this.getList(query);
    },
    /**
     * tabs切换
     */
    tabsLevelChange(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    naviGateToQz(row){
      const {jgdm,rwpcid,ybbf,jslb,datastarttime,dataendtime,jgmc,jcjg,jczname,jsdj} = row
      this.$router.push({
        path:'/checkup/jcss/dcqz',
        query:{jgdm:jgdm||'',rwpcid:rwpcid||'',ybbf:ybbf||'',jslb:jslb||'',datastarttime:datastarttime||'',dataendtime:dataendtime||'',jgmc:jgmc||'',jczname:jczname||'',jcjg:jcjg||'',jsdj:jsdj||''}
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.tabs-part {
  clear: both;
}
.table-main {
  position: absolute;
  top:114px;
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