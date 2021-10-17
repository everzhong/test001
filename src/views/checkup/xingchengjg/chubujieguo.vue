<template>
  <div class="app-container">
    <el-form size="small" label-width="100px" class="top-search1" ref="searchForm" :inline="true">
          <el-form-item label="案件来源" prop="ajly">
            <el-input readonly v-model="queryInfoFrom.ajly"></el-input>
          </el-form-item>
          <el-form-item label="险种" prop="ybbf">
            <el-input readonly :value="selectDictLabels($store.getters.ybbfDic, queryInfoFrom.ybbf)"></el-input>
          </el-form-item>
          <el-form-item label="就医类型" prop="jslb">
            <el-input readonly :value="selectDictLabels($store.getters.jslbDic, queryInfoFrom.jslb)"></el-input>
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
            <el-form-item label="承办机构" prop="jcjg">
            <el-input readonly v-model="queryInfoFrom.jcjg"></el-input>
          </el-form-item>
            <el-form-item label="检查组" prop="jczname">
            <el-input readonly v-model="queryInfoFrom.jczname"></el-input>
          </el-form-item>
          <!-- <div style="position:absolute;right:20px;top:-31px;background-color:#fff" v-if="!queryInfoFrom.fromLuli">
            <el-button type="primary" size="mini" @click="handleAgree(5)">提交</el-button>
            <el-button type="primary" size="mini" @click="handleAgree(3)">回退</el-button>
            <el-button type="primary" plain icon="el-icon-back" style="margin-left:50px" size="mini" @click="$router.back(-1)">返回</el-button>
          </div> -->
          <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
            <el-button type="primary" icon="el-icon-back" style="margin-left:50px" size="mini" @click="$router.back(-1)">返回</el-button>
          </div>
    </el-form>
    <p style="font-size:12px;margin:0px 0 10px 0;color:#606626">初步结果-预览</p>
    <el-row :gutter="10">
      <el-col :span="1.5">
        <span style="color:#606266;font-size:14px">参保人：</span>
        <el-select v-model="queryParams.ybd" size="small" @change="getList">
          <el-option label="本地" value="01"></el-option>
          <el-option label="异地" value="02"></el-option>
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
    <jc-table :tableData="listjc" v-if="tabsValue=='listjc'&&!viewTableObj.show" @view-detail="viewHanddle"/>
    <wg-table :tableData="listjg" v-if="tabsValue=='listjg'&&!viewTableObj.show" @view-detail="viewHanddle"/>
    <!-- <cbd-table v-if="tabsValue==3&&!viewTableObj.show" @view-detail="viewTableObj.show = true"/> -->
    <div v-if="viewTableObj.show" class="table-main" :style="{top:topHeight}">
      <ViewTable :options="viewTableObj.options"/>
    </div>
    <el-form inline style="margin-top:30px" v-if="!viewTableObj.show">
      <el-form-item label="复核意见：" style="margin-right:50px">
        <el-radio v-model="status" label="5">同意</el-radio>
        <el-radio v-model="status" label="3">驳回</el-radio>
      </el-form-item>
      <el-form-item label="具体说明：" style="margin-right:30px">
        <el-input v-model="qdbh" type="textarea" style="width:300px"/>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" size="small" @click="saveDxqd">保存</el-button>
      </el-form-item>
    </el-form>
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
    // this.getList();
  },
   mounted(){
    this.topHeight = this.calcTableHeight(68)
  },
  methods:{
    viewHanddle(row,type){
      if(this.tabsValue==="listjc"){
        this.viewTableObj.options = {
          ybbf:row.ybbf,
          jslb:row.label
        }
      } else {
        this.viewTableObj.options = {
          wglx:row.wglx,
          jslb:row.ybbf
        }
      }
      this.viewTableObj.options.rwpcid = this.queryInfoFrom.rwpcid
      this.viewTableObj.show = true
    },
    saveDxqd(){
      if(!this.status){
        this.msgError('请选择复核意见')
        return false
      }
      const params = {
        ids:[this.queryInfoFrom.id],
        status:this.status,//提交5，退回3
        dxqd:this.status==5?'提交':'退回',
        qdbh:this.qdbh//驳回意见字段
      }
      this.doSubmit(params)
    },
     /**
     *  
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
        this.addJcfl({
          jglc:'初步形成结果',
          gjxx:`初步形成结果 ${params.status===5?'提交':'退回'}：批号为${this.queryInfoFrom.rwpcid}机构代码为${this.queryInfoFrom.jgdm}`,
          rwpcid:this.queryInfoFrom.rwpcid,
          jgdm:this.queryInfoFrom.jgdm,
          zhczr:this.$store.getters.name,
          sort:8
        })
      })
    },
    /** 查询renwu列表 */
    async getList() {
      const {rwpcid,jgdm} = this.queryInfoFrom
      const params = {rwpcid,jgdm,ybd:this.queryParams.ybd}
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
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:155px;
  bottom:0;
  left: 20px;
  right: 20px;
}
</style>
