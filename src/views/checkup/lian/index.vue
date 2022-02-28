<template>
  <div class="app-container">
    <SearchItem ref="searchForm" @handleQuery="handleQuery" style="height:94px;overflow:auto"/>
    <div v-loading="loading" class="table-main">
    <sTable :data="renwutwoList" :header="tableHeader" :fixedNum="1" @selection-change="handleSelectionChange">
        <el-table-column type="index" width="55" align="center" slot="fixed" label="序号"></el-table-column>
        <el-table-column label="操作" align="center" min-width="210" slot="operate">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.lian==0||scope.row.lian==5"
              size="mini"
              type="text"
              @click="navigateToLian([scope.row],'sqLian')"
            >申请立案</el-button>
            <el-button
               v-if="scope.row.lian==0||scope.row.lian==5"
              size="mini"
              type="text"
              @click="navigateToLian([scope.row],'noLian')"
            >申请不予立案</el-button>
            <span v-hasRole="['jiancha', 'common']">
              <el-button
                v-if="scope.row.lian==1"
                size="mini"
                type="text"
                @click="navigateToLian([scope.row],'lasp')"
              >立案审批</el-button>
            </span>
            <span v-hasRole="['jiancha', 'common']">
              <el-button
                v-if="scope.row.lian==2"
                size="mini"
                type="text"
                @click="navigateToLian([scope.row],'lansp')"
              >不予立案审批</el-button>
            </span>
            <el-button
              v-if="scope.row.lian==3||scope.row.lian==4"
              size="mini"
              type="text"
              @click="navigateToLian([scope.row],'prlian')"
            >打印文书</el-button>
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
  <div v-for="(item,i) in piliangList" :key="item.id" :id="'piliang_'+i" style="display:none">
    <lianTemplate :pageData="item"/>
  </div>
  </div>
</template>
<script>
import { listRenwutwo } from "@/api/renwu/renwutwo"
import lianTemplate from './lianTemplate.vue'
import Stable from '../../../components/stable.vue'
import SearchItem from '../../common/objSearchItem'

export default {
  name: "Lian",
  components: {
    lianTemplate,
    Stable,
    SearchItem
  },
  data() {
    return {
      tableHeader:[{
        label: '批次号',
        fixedWidth:30,
        prop:'rwpcid'
      },{
       label: '案件来源',
        fixedWidth:55,
        prop:'ajly',
        viewFun: (ajly)=>{
          return this.selectDictLabels(this.$store.getters.ajlyDic, ajly)
        },
      },{
        label: '检查方式',
        fixedWidth:60,
        prop:'jcfs'
      },{
         label: '险种',
        fixedWidth:50,
        prop:'ybbf',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.$store.getters.ybbfDic, ybbf)
        },
      },{
        label:"就医类型",
        prop:'jslb',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.$store.getters.jslbDic,jslb)
        },
      },{
        label:"数据开始日期",
        prop:'datastarttime',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}-{d}')
        }
      },{
        label:"数据结束日期",
        prop:'dataendtime',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}-{d}')
        }
      },{
        label:"机构代码",
        prop:'jgdm',
      },{
        label:"机构名称",
        prop:'jgmc',
      },{
        label:"检查机构",
        prop:'jcjg',
      },{
        label:"检查组",
        prop:'jczname',
      },{
        label:"立案状态",
        prop:'lian',
        viewFun:(lian)=>{
          return ['未申请','申请立案','申请不立案','同意立案','同意不立案','驳回'][lian*1]
        }
      }],
      piliangList:[],//批量立案
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
      //案件类型
      ajlxOptions:[],
      //立案状态
      lianOptions:[
        {dictValue:'0',dictLabel:'未申请'},
        {dictValue:'1',dictLabel:'申请立案'},
        {dictValue:'2',dictLabel:'申请不立案'},
        {dictValue:'3',dictLabel:'同意立案'},
        {dictValue:'4',dictLabel:'同意不立案'},
        {dictValue:'5',dictLabel:'驳回'}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      //选中的数据 
      selectionData:[]
    };
  },
  created() {
    // this.getDicts("sys_renwu_ajlx").then(response => {
    //   this.ajlxOptions = response.data;
    // });
    this.getList();
  },
  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 查询renwutwo列表 */
    async getList(query) {
      const params = query?{...this.queryParams,...query}:this.queryParams
      params.status = 3
      this.loading = true
      try {
        const res = await listRenwutwo(params)
        if(res.code===200){
          this.renwutwoList= res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    navigateToLian(row,router){
      // const data = row[0]
      window.localStorage.setItem('LADATA',JSON.stringify(row))
      const path =`/checkup/jcss/${router}`
      // const path =`/checkup/${isView?`viewNotice?rwpcid=${data.rwpcid}&jgmc=${data.jgmc}&wjh=${data.wjh?data.wjh:''}`:'addNotice'}`
      this.$router.push({
        path:path,
      })
    },
    /** 搜索按钮操作 */
    handleQuery(query) {
      this.queryParams.pageNum = 1;
      this.getList(query);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.selectionData = selection
      this.piliangList = [...selection]
    },
    /**
     * 批量制作
     */
    handeMutilDo(){
      if(!this.ids.length){
        this.msgWarning('请至少选择一项')
      } else {
        const pcidList = []
        this.selectionData.forEach(item=>{
          item.isdayin*1===1 && (pcidList.push(item.rwpcid))
        })
        if(pcidList.length){
          this.$alert(`取消 已制作/已打印 的项目后再进行操作。`, '提示', {
            confirmButtonText: '确定'
          }).catch(_=>{});
          return
        } 
        this.navigateToLian(this.selectionData)
      }
    },
    handeMutilPrint(){
      if(!this.ids.length){
        this.msgWarning('请至少选择一项')
      } else {
        const pcidList = []
        this.selectionData.forEach(item=>{
          item.isdayin*1!==1 && (pcidList.push(item.rwpcid))
        })
        if(pcidList.length){
          this.$alert(`取消 未制作 通知的项目后再进行操作。`, '提示', {
            confirmButtonText: '确定'
          }).catch(_=>{});
        } else {
          this.doPrint('piliang')
        }
      }
    },
    /**
     * 执行打印
     */
    doPrint(type){
      const dayinList = []
      const newWin = window.open() // 新打开一个空窗口
      const dyList = this[`${type}List`]
      for (let i = 0; i < dyList.length; i++) {
        const imageToPrint = document.getElementById(`${type}_${i}`) // 获取需要打印的内容
        imageToPrint.style.display = 'block'
        dayinList.push(imageToPrint)
        newWin.document.write(imageToPrint.outerHTML) // 将需要打印的内容添加进新的窗口
      }
      const styleSheet = `<style>.print-area{width:669px;height:1020px;margin:auto}</style>`
      newWin.document.head.innerHTML = styleSheet // 给打印的内容加上样式
      newWin.document.close() // 在IE浏览器中使用必须添加这一句
      newWin.focus() // 在IE浏览器中使用必须添加这一句
      setTimeout(function() {
          newWin.print() // 打印
          newWin.close() // 关闭窗口
      }, 10)
      dayinList.forEach(item=>{
        item.style.display = 'none'
      })
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
  top:115px;
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