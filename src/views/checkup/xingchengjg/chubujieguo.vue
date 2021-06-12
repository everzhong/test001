<template>
  <div class="app-container">
    <el-form size="small" label-width="100px" class="top-search" ref="queryForm" :inline="true">
          <el-form-item label="案件来源" prop="ajly">
            <el-input readonly v-model="queryInfoFrom.ajly"></el-input>
          </el-form-item>
          <el-form-item label="险种" prop="ybbf">
            <el-input readonly v-model="queryInfoFrom.ybbf"></el-input>
          </el-form-item>
          <el-form-item label="就医类型" prop="jslb">
            <el-input readonly v-model="queryInfoFrom.jslb"></el-input>
          </el-form-item>
          <el-form-item label="批次号" prop="rwpcid">
            <el-input readonly v-model="queryInfoFrom.rwpcid"></el-input>
          </el-form-item>
          <el-form-item label="数据开始日期" prop="datastarttime">
            <el-input readonly v-model="queryInfoFrom.datastarttime"></el-input>
          </el-form-item>
          <el-form-item label="数据结束日期" prop="dataendtime">
            <el-input readonly v-model="queryInfoFrom.dataendtime"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="jgmc">
            <el-input readonly v-model="queryInfoFrom.jgmc"></el-input>
          </el-form-item>
            <el-form-item label="检查机构" prop="cxjg">
            <el-input readonly v-model="queryInfoFrom.cxjg"></el-input>
          </el-form-item>
            <el-form-item label="检查组" prop="jcz">
            <el-input readonly v-model="queryInfoFrom.jcz"></el-input>
          </el-form-item>
          <div style="position:absolute;right:20px;top:-31px">
            <el-button type="primary" size="mini">回退</el-button>
            <el-button type="primary" size="mini">提交</el-button>
            <el-button type="primary" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
          </div>
    </el-form>
    <p style="font-size:12px;margin:0px 0 10px 0;color:#606626">初步结果-预览</p>
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span>参保人：</span>
        <el-select v-model="queryParams.ybd" size="small">
          <el-option label="本地" value="本地"></el-option>
          <el-option label="异地" value="异地"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5" v-if="viewTableObj.show">
        <el-button type="warning" plain size="small" @click="viewTableObj.show = false">返回上一层</el-button>
      </el-col>
      <el-radio-group @change="viewTableObj.show = false" v-model="tabsValue" size="small" class="top-right-btn">
        <el-radio-button label="1" :value="1">按检查方式汇总</el-radio-button>
        <el-radio-button label="2" :value="2">按违规类别汇总</el-radio-button>
        <el-radio-button label="3" :value="3">按参保地汇总</el-radio-button>
      </el-radio-group>
    </el-row>
    <jc-table v-if="tabsValue==1&&!viewTableObj.show" @view-detail="viewTableObj.show = true"/>
    <wg-table v-if="tabsValue==2&&!viewTableObj.show" @view-detail="viewTableObj.show = true"/>
    <cbd-table v-if="tabsValue==3&&!viewTableObj.show" @view-detail="viewTableObj.show = true"/>
    <ViewTable v-if="viewTableObj.show" :tableData="viewTableObj.tdata"/>
  </div>
</template>
<script>
import { listRenwufour } from '@/api/renwu/renwufour'
import { listRenwufive } from '@/api/renwu/renwufive'
import JcTable from './jcTable.vue'
import WgTable from './wgTable.vue'
import CbdTable from './cbdTable.vue'
import ViewTable from './viewTable.vue'
export default {
  name:"Chubujieguo",
  data(){
    return {
      tabsValue:1,
      //上页带过来的info
      queryInfoFrom:{},
      //组合查询条件
      queryParams:{
        ybd:"本地"
      },
      viewTableObj:{
        show:false,
        tdata:[]
      }
    }
  },
  components:{
    JcTable,
    WgTable,
    CbdTable,
    ViewTable
  },
  created(){
    this.queryInfoFrom = this.$route.query
     this.getList();
  },
  methods:{
    goBackUpLevel(){
      
    },
    /** 查询renwu列表 */
    async getList(query) {
      // const params = query?{...query,...this.queryParams}:this.queryParams
      let params = {...this.queryForm,...this.queryParams}
      if(query){
        params = {...query,...params}
      } else {
        const {rwpcid,jgdm} = this.queryInfoFrom
        params = {rwpcid,jgdm,...params}
      }
      
      this.loading = true
      try {
        const  res = await listRenwufour(params)
        if(res.code===200){
          this[`renwu${this.tabsValue}List`] = res.rows;
          this.total = res.total;
          if(this.chaxunDialog){
            this.$refs['chaxunForm'].resetFields()
            this.chaxunDialog = false
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
  }
}
</script>
