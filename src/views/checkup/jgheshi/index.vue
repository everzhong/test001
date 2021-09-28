<template>
<div class="app-container">
  <div class="table-main">
    <el-table :data="tableData" border height="100%" style="width:100%">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" align="center"  />
      <el-table-column label="批次号" align="center" prop="rwpcid"  :width="flexColumnWidth('rwpcid',tableData)"/>
      <el-table-column label="统一社会信用代码" align="center" prop="xydm"  :width="flexColumnWidth('xydm',tableData)"/>
      <el-table-column label="机构代码" align="center" prop="jgdm" :width="flexColumnWidth('jgdm',tableData)"/>
      <el-table-column label="机构名称" align="center" prop="jgmc"  :width="flexColumnWidth('jgmc',tableData)"/>
      <el-table-column label="行政区" align="center" prop="xzq" :formatter="xzqFormat"  show-overflow-tooltip/>
      <el-table-column label="结算等级" align="center" prop="jsdj"  :width="flexColumnWidth('jsdj',tableData)"/>
      <el-table-column label="险种" align="center" prop="ybbf"  :width="flexColumnWidth('ybbf',tableData)"/>
      <el-table-column label="就医类型" align="center" prop="jslb"  :width="flexColumnWidth('jslb',tableData)"/>
      <el-table-column label="异地/本地" align="center" prop="ybd"  :width="flexColumnWidth('ybd',tableData)"/>
      <el-table-column label="数据开始日期" align="center" prop="datastarttime"  :width="flexColumnWidth('datastarttime',tableData)">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.datastarttime,'{y}-{m}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据结束日期" align="center" prop="dataendtime" :width="flexColumnWidth('dataendtime',tableData)">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dataendtime,'{y}-{m}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则分类" align="center" prop="gzfl"/>
      <el-table-column label="规则名称" align="center" prop="gzmc" width="350" show-overflow-tooltip/>
      <el-table-column label="违反条数(违反规则的明细数量)" align="center" prop="xjmxs"  :width="flexColumnWidth('xjmxs',tableData)"/>
      <el-table-column label="涉及金额" align="center" prop="xjje"  :width="flexColumnWidth('xjje',tableData)">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.xjje,2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="核实状态" align="center" prop="hszt">
        <template slot-scope="scope">
          <span>{{scope.row.hszt==='2'?'已核实':'未核实'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="110">
        <template slot-scope="scope" >
          <el-button v-if="scope.row.hszt!=='2'" size="mini" type="text" primary @click="submitHsyj(scope.row)">提交核实意见</el-button>
        </template> 
      </el-table-column>
    </el-table>
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
      xzqOptions:[]
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