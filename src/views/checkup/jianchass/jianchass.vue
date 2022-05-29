<template>
  <div class="app-container container_1">
    <SearchItem @handleQuery="handleQuery" @toggle-search="h=>topValue=h"/>
    <div v-loading="loading" class="table-main" :style="{top:topValue}">
      <sTable :data="renwutwoList" :header="tableHeader" :fixedNum="1">
        <el-table-column label="序号" type="index" align="center" slot="fixed"/>
        <el-table-column label="操作"  fixed="right" align="center" slot="operate" min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="doCheck(scope.row)"
            >实施检查</el-button>
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
import { listRenwutwo } from "@/api/renwu/renwutwo"
import SearchItem from '../../common/objSearchItem'
export default {
  name: "Jianchass",
  components: {
    SearchItem,
  },
  data() {
    return {
      topValue:0,
      tableHeader:[{
        label:"状态",
        prop:"istui",
        width:'140px',
        viewFun:(istui,row)=>{
          let text = ''
          if(istui){
            if(row.dxqd==='复核驳回'){
              text = '复核驳回'
            } else {
             text = '法核退回'
            }
          } else {
            if(row.dxqd==='复核驳回'){
              text = '复核驳回'
            } else {
             text = '待检查'
            }
          }
          return text 
        }
      },{
        label: '批次号',
        fixedWidth:30,
        prop:'rwpcid'
      },{
       label: '机构代码',
        fixedWidth:55,
        prop:'jgdm'
      },{
        label: '机构名称',
        fixedWidth:60,
        prop:'jgmc'
      },{
        label: '案件来源',
        fixedWidth:50,
        prop:'ajly',
        viewFun: (ajly)=>{
          return this.selectDictLabels(this.$store.getters.ajlyDic, ajly)
        },
      },{
        label:"检查方式",
        prop:'jcfs',
        width:'auto'
      },{
        label:"险种",
        prop:'ybbf',
        width:'auto',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.ybbfOptions, ybbf)
        }
      },{
        label:"就医类型",
        prop:'jslb',
         viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        }
      },{
        prop: 'jsdj',
        label: '结算等级',
        // viewFun: (jsdj)=>{
        //   return this.selectDictLabels(this.$store.getters.jsdjDic, jsdj)
        // }
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
        label:"统一社会信用代码",
        prop:'xydm'
      },{
        label:"承办机构",
        prop:'jcjg'
      },{
        label:"检查组",
        prop:'jczname'
      }],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // renwutwo表格数据
      renwutwoList: [],
      renwuthreeList: [],
      renwufourList: [],
      // 险种字典
      ybbfOptions: [],
      // 就医类型字典
      jslbOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //
      tabsValue:'two'
    };
  },
  created() {
    this.getList();
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  methods: {
    /** 查询renwutwo列表 */
    async getList(query) {
      const params = query?{...query,...this.queryParams}:this.queryParams
      params.status = 3 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
      this.loading = true
      try {
        const res = await listRenwutwo(params)
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows;
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
    /** 搜索按钮操作 */
    handleQuery(query) {
      this.queryParams.pageNum = 1;
      this.getList(query);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**
     * 实施网申
     */
    handleNetCheck(){
      if(!this.ids.length){
        this.msgWarning('请至少选择一项')
      } else {
        
      }
      //检查任务中有未执行第三方筛查的

    },
    /**
     * tabs切换
     */
    tabsLevelChange(){
      this.queryParams.pageNum = 1
      this.getList()
    },
    doCheck(row){
      this.$router.push({
        path:'/checkup/jcss/shisjc',
        query:{...row}
      },()=>{})
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
  bottom:45px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  bottom:8px;
  right: 0px;
}
</style>