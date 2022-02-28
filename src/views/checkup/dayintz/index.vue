<template>
  <div class="app-container">
    <SearchItem @handleQuery="handleQuery" style="height:94px"/>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handeMutilDo"
        >批量制作通知</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          size="small"
          @click="handeMutilPrint"
        >批量打印通知</el-button>
      </el-col>
    </el-row>
      <div v-loading="loading" class="table-main">
      <sTable :data="renwutwoList" :header="tableHeader" :fixedNum="1" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" slot="fixed"></el-table-column>
        <el-table-column label="操作" align="center" min-width="280" slot="operate">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isdayin!=1"
              size="mini"
              type="text"
              @click="navigateToAdd([scope.row])"
            >制作通知</el-button>
            <el-button
              v-if="scope.row.isdayin==1"
              size="mini"
              type="text"
              @click="navigateToAdd([scope.row],true)"
            >查看通知</el-button>
            <el-button
              v-if="scope.row.isdayin==1"
              size="mini"
              type="text"
              @click="printFile([scope.row],'jianca')"
            >打印检查通知书</el-button>
            <el-button
              v-if="scope.row.isdayin==1"
              size="mini"
              type="text"
              @click="printFile([scope.row],'jilv')"
            >打印纪律告知书</el-button>
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
      <SingleNotice :pageData="item"/>
    </div>
    <div v-for="(item,i) in jiancaList" :key="item.id+'jc'" :id="'jianca_'+i" style="display:none">
      <JcNotice :pageData="item"/>
    </div>
    <div v-for="(item,i) in jilvList" :key="item.id+'jl'" :id="'jilv_'+i" style="display:none">
      <JlNotice :pageData="item"/>
    </div>
  </div>
</template>
<script>
import { listRenwutwo } from "@/api/renwu/renwutwo"
import SearchItem from '../../common/objSearchItem'
import SingleNotice from './singleNotice.vue'
import JcNotice from './jcNotice.vue'
import JlNotice from './jlNotice.vue'
import Stable from '../../../components/stable.vue'

export default {
  name: "Dayintz",
  components: {
    SearchItem,
    SingleNotice,
    JcNotice,
    JlNotice,
    Stable
  },
  data() {
    return {
      tableHeader:[{
        label:"是否制作",
        prop:"isdayin",
        viewFun:(isdayin)=>{
          return isdayin?'是':'否'
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
        },
      },{
        label:"就医类型",
        prop:'jslb',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.jslbOptions,jslb)
        }
      },{
        label:"统一社会信用代码",
        prop:'xydm'
      },{
        prop: 'jsdj',
        label: '结算等级',
        viewFun: (jsdj)=>{
          return this.selectDictLabels(this.$store.getters.jsdjDic, jsdj)
        }
      },{
        label:"承办机构",
        prop:'jcjg'
      },{
        label:"检查组",
        prop:'jczname'
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
      }],
      piliangList:[],//批量打印
      jiancaList:[],//检查通知书
      jilvList:[],//纪律通知书
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
        pageSize: 10,
      },
      //选中的数据 
      selectionData:[]
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
          this.renwutwoList= res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    navigateToAdd(row,isView){
      const data = row[0]
      window.localStorage.setItem('PRDATA',JSON.stringify(row))
      const path =`/checkup/${isView?`viewNotice?rwpcid=${data.rwpcid}&jgmc=${data.jgmc}&wjh=${data.wjh?data.wjh:''}`:'addNotice'}`
      this.$router.push({
        path:path,
      })
    },
    printFile(row,key){
      this[`${key}List`] = [...row]
      setTimeout(() => {
        this.doPrint(key)
      }, 50);
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
        this.navigateToAdd(this.selectionData)
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
  top:155px;
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