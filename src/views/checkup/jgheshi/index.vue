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
      },{
        prop: 'xydm',
        label: '统一社会信用代码',
      },{
        prop: 'jgdm',
        label: '机构代码',
      },{
        prop: 'jgmc',
        label: '机构名称',
      },{
        prop: 'xzq',
        label: '行政区',
        width: 'auto',
        formatter:this.xzqFormat
      },{
        prop: 'jsdj',
        label: '结算等级',
      },{
        prop: 'ybbf',
        label: '险种',
        width:'auto'
      },{
        prop: 'jslb',
        label: '就医类型',
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
        width:'auto'
      },{
        prop: 'gzmc',
        label: '规则名称',
      },{
        prop: 'xjmxs',
        label: '违反条数(违反规则的明细数量)',
      },{
        prop: 'xjje',
        label: '涉及金额',
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
  },
  methods:{
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabel(this.xzqOptions, row.xzq);
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
              // this.addJcfl({
              //   jglc:'机构核实',
              //   gjxx:`提交机构核实：批号为${row.rwpcid}机构代码为${row.jgdm}`,
              //   rwpcid:row.rwpcid,
              //   jgdm:row.jgdm,
              //   zhczr:this.$store.getters.name,
              // })
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