<template>
  <div class="app-container" v-loading="pageLoaing" style="padding-top:20px">
    <el-row :gutter="10">
      <el-col :span="1.5" v-if="!viewTableObj.show">
        <span style="color:#606266;font-size:14px">参保地：</span>
        <el-select v-model="queryParams.ybd" size="small" @change="getList()">
          <el-option label="本地" value="01"></el-option>
          <el-option label="异地" value="02"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5" v-if="viewTableObj.show">
        <el-button type="default"  size="small" @click="viewTableObj.show = false">返回上一层</el-button>
      </el-col>
      <el-radio-group @change="typeChange" v-model="tabsValue" size="small" class="top-right-btn">
        <el-radio-button label="listjc" value="listjc">按检查方式汇总</el-radio-button>
        <el-radio-button label="listjg" value="listjg">按违规类别汇总</el-radio-button>
      </el-radio-group>
    </el-row>
    <jc-table ref="listjcTable"  v-if="tabsValue=='listjc'&&!viewTableObj.show && !pageLoaing" @view-detail="viewHanddle"/>
    <wg-table ref="listjgTable"  v-if="tabsValue=='listjg'&&!viewTableObj.show && !pageLoaing" @view-detail="viewHanddle"/>
    <div v-if="viewTableObj.show" class="table-main">
      <ViewTable :options="viewTableObj.options"/>
    </div>
  </div>
</template>
<script>

import { submitDxqd} from "@/api/renwu/dcqz"
import JcTable from '../checkup/xingchengjg/jcTable.vue'
import WgTable from './wgTable.vue'
import ViewTable from '../checkup/xingchengjg/viewTable.vue'
import { getToken } from '@/utils/auth'
export default {
  name:"Xcjg",
  data(){
    return {
      pageLoaing:true,
      topHeight:0,
      tabsValue:'listjc',
      //上页带过来的info
      queryInfoFrom:{},
      //组合查询条件
      queryParams:{
        ybd:"",
      },
      viewTableObj:{
        show:false,
        options:{}
      },
      listjc:[],
      listjg:[],
      status:'',//复核意见
      qdbh:''//具体说明
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
    if(getToken()){
      this.pageLoaing = false;
    }
  },
   mounted(){
    this.topHeight = this.calcTableHeight(68)
  },
  methods:{
    viewHanddle(row,type){
      this.viewTableObj.options = {}
      if(this.tabsValue==="listjc"){
        this.viewTableObj.options['jslb'] = row.jslb==='门诊'?'0101':row.jslb==='住院'?'0102':''
      } else {
        this.viewTableObj.options['wglx'] = row.wglx
      }
      this.viewTableObj.options.rwpcid = this.queryInfoFrom.rwpcid
      this.viewTableObj.options.jgdm = this.queryInfoFrom.jgdm
      type && ( this.viewTableObj.options = {...this.viewTableObj.options,...type})
      this.viewTableObj.show = true
    },
    /** 查询renwu列表 */
    async getList() {
      const {rwpcid,jgdm} = this.queryInfoFrom
      const params = {rwpcid,jgdm,ybd:this.queryParams.ybd}
      await this.$refs[`${this.tabsValue}Table`].getList(params,'listjgdone')
    },
    typeChange(){
      this.viewTableObj.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  height: 100% !important;
}
.table-main {
  position: absolute;
  top:60px;
  bottom:0;
  left: 20px;
  right: 20px;
}
</style>
