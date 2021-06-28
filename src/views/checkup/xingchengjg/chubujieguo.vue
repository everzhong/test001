<template>
  <div class="app-container">
    <el-form size="small" label-width="100px" class="top-search" ref="queryInfoFrom" :inline="true">
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
          <div style="position:absolute;right:20px;top:-31px;background-color:#fff">
            <el-button type="primary" size="mini" @click="handleAgree(3)">回退</el-button>
            <el-button type="primary" size="mini" @click="handleAgree(5)">提交</el-button>
            <el-button type="primary" icon="el-icon-back" size="mini" @click="$router.back(-1)">返回</el-button>
          </div>
    </el-form>
    <p style="font-size:12px;margin:0px 0 10px 0;color:#606626">初步结果-预览</p>
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span>参保人：</span>
        <el-select v-model="queryParams.ybd" size="small" @change="getList">
          <el-option label="本地" value="本地"></el-option>
          <el-option label="异地" value="异地"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5" v-if="viewTableObj.show">
        <el-button type="warning" plain size="small" @click="viewTableObj.show = false">返回上一层</el-button>
      </el-col>
      <el-radio-group @change="typeChange" v-model="tabsValue" size="small" class="top-right-btn">
        <el-radio-button label="listjc" value="listjc">按检查方式汇总</el-radio-button>
        <el-radio-button label="listjg" value="listjg">按违规类别汇总</el-radio-button>
        <!-- <el-radio-button label="3" :value="3">按参保地汇总</el-radio-button> -->
      </el-radio-group>
    </el-row>
    <jc-table :tableData="listjc" v-if="tabsValue=='listjc'&&!viewTableObj.show" @view-detail="viewTableObj.show = true"/>
    <wg-table :tableData="listjg" v-if="tabsValue=='listjg'&&!viewTableObj.show" @view-detail="viewTableObj.show = true"/>
    <!-- <cbd-table v-if="tabsValue==3&&!viewTableObj.show" @view-detail="viewTableObj.show = true"/> -->
    <ViewTable v-if="viewTableObj.show" :tableData="viewTableObj.tdata"/>
  </div>
</template>
<script>
import { getListjg,getListjc} from '@/api/renwu/renwufour'
// import { listRenwufive } from '@/api/renwu/renwufive'
import { submitDxqd} from "@/api/renwu/dcqz"
import JcTable from './jcTable.vue'
import WgTable from './wgTable.vue'
// import CbdTable from './cbdTable.vue'
import ViewTable from './viewTable.vue'

export default {
  name:"Chubujieguo",
  data(){
    return {
      tabsValue:'listjc',
      //上页带过来的info
      queryInfoFrom:{},
      //组合查询条件
      queryParams:{
        ybd:"本地",
      },
      viewTableObj:{
        show:false,
        tdata:[]
      },
      listjc:[],
      listjg:[]
    }
  },
  components:{
    JcTable,
    WgTable,
    // CbdTable,
    ViewTable
  },
  created(){
    this.queryInfoFrom = this.$route.query
    // this.getList();
  },
  methods:{
     /**
     * 实施网申 
     */
    handleAgree(type){
      if(type===5){
        this.doSubmit({
          ids:[this.queryInfoFrom.id],
          status:type,//提交5，退回3
          dxqd:'提交',
          qdbh:''//驳回意见字段
        },type)
      } else {
        this.handleNg()
      }
    },
    /**
     * 第三方筛查
     */
    handleNg(){
      const self = this
      this.$prompt('退回意见', '退回意见填写', {
          inputType:'textarea',
          confirmButtonText: '确定',
          cancelButtonText: '返回',
        }).then(({ value }) => {
          self.doSubmit({
            ids:[this.queryInfoFrom.id],
            status:3,//驳回到4
            dxqd:'退回',
            qdbh:value//驳回意见字段
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    doSubmit(params){
      submitDxqd(params).then(res=>{
        this.msgSuccess("操作成功")
        this.getList()
      })
    },
    /** 查询renwu列表 */
    async getList() {
      const {rwpcid,jgdm} = this.queryInfoFrom
      const params = {rwpcid,jgdm}
      this.loading = true
      try {
        let res = null
        if(this.tabsValue === 'listjc') {
          res = await getListjc(params)
        } else {
          res = await getListjg(params)
        }
        if(res.code===200){
          this[this.tabsValue] = res.data
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    typeChange(){
      this.viewTableObj.show = false
      this.getList()
    }
  }
}
</script>
