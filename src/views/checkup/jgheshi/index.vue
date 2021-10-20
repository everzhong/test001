<template>
<div class="app-container">
  <div class="table-main">
    <sTable :data="tableData" :header="tableHeader" :fixedNum="1">
      <el-table-column label="序号" type="index" align="center" min-width="65" slot="fixed"/>
      <el-table-column label="操作" align="center"  width="110" slot="operate">
        <template slot-scope="scope" >
          <el-button v-if="scope.row.hszt!=='2'" size="mini" type="text" primary @click="submitHsyj(scope.row)">提交核实意见</el-button>
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
import {listjgRenwuthree,updateRenwuthree} from '@/api/renwu/renwuthree'
export default {
  name:'Listjg',
  data(){
    return {
      total:0,
      tableData:[],
      queryParams: {
      pageNum: 1,
      pageSize: 10
      },
      xzqOptions:[],
      tableHeader:[{
        prop: 'rwpcid',
        label: '批次号',
        fixedWidth:30
      },{
        prop: 'xydm',
        label: '统一社会信用代码',
      },{
        prop: 'jgdm',
        label: '机构代码',
        fixedWidth:55,
      },{
        prop: 'jgmc',
        label: '机构名称',
        fixedWidth:60,
      },{
        prop: 'xzq',
        label: '行政区',
        width: 'auto',
        viewFun: (xzq)=>{
          return this.selectDictLabels(this.xzqOptions, xzq)
        }
      },{
        prop: 'jsdj',
        label: '结算等级',
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
        prop: 'ybd',
        label: '异地/本地',
        width:'auto'
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
        prop: 'gzfl',
        label: '规则分类',
        align: 'left',
        width:'auto'
      },{
        prop: 'gzmc',
        label: '规则名称',
        align: 'left'
      },{
        prop: 'xjmxs',
        label: '违反条数(违反规则的明细数量)',
      },{
        prop: 'xjje',
        label: '疑点金额',
        viewFun: (xjje)=>{
          return this.formatMoney(xjje,2)
        }
      },{
        prop: 'hszt',
        label: '核实状态',
        viewFun:(hszt)=>{
          return hszt==2?'已核实':'未核实'
        }
      }]
    }
  },
  created(){
    this.getList()
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
    this.ybbfOptions = this.$store.getters.ybbfDic
    this.jslbOptions = this.$store.getters.jslbDic
  },
  methods:{
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
     // 险种字典翻译
    ybbfFormat(row, column) {
      return this.selectDictLabels(this.ybbfOptions, row.ybbf);
    },
    // 就医类型字典翻译
    jslbFormat(row, column) {
      return this.selectDictLabels(this.jslbOptions, row.jslb);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // this.$emit('handleSelectionChange',selection)
      // this.ids = selection.map(item => item.rwpcid)
      // this.single = selection.length!==1
      // this.multiple = !selection.length
    },
    checkdetail(row){
      this.$emit('checkdetail',row)
    },
    async getList(){
      const jgdm = this.$store.getters.remark
      this.loading = true
      try {
        const res = await listjgRenwuthree({
          jgdm,
          ...this.queryParams
        })
        if(res.code === 200) {
          this.tableData = res.rows
          this.total = res.total
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    submitHsyj(row){
      this.$prompt('机构核实意见', '核实意见填写', {
          inputType:'textarea',
          confirmButtonText: '确定',
          cancelButtonText: '返回',
        }).then(({ value }) => {
          updateRenwuthree({
            id:row.id,
            hszt:'2',
            hsyj:value,
            hsr:this.$store.getters.name,
            hssj: this.parseTime(new Date(),'{y}-{m}-{d} {h}:{m}:{s}')
          }).then(res=>{
            if(res.code===200) { 
              this.msgSuccess('机构核实成功')
              this.getList()
            } 
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:20px;
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