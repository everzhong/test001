<template>
  <div class="app-container container_1">
    <div ref="containerTop">
      <div class="container-top" v-show="showShearch">
        <el-form size="small" label-width="100px" class="top-search1" ref="searchForm" :inline="true">
              <el-form-item label="案件来源" prop="ajly">
                <el-input readonly :value="selectDictLabels($store.getters.ajlyDic, queryInfoFrom.ajly)"></el-input>
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
              <!-- <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
                <el-button type="primary" icon="el-icon-back" style="margin-left:50px" size="mini" @click="$router.back(-1)">返回</el-button>
              </div> -->
              <div class="page-back-icon" @click="$router.back(-1)">
                  <i class="el-icon-arrow-left"></i>
                </div>
        </el-form>
      </div>
      <div class="toggle-search" @click="toggleShearch">
        <i v-if="this.showShearch" class = "el-icon-caret-top"></i>
        <i v-else class = "el-icon-caret-bottom"></i>
      </div>
    </div>
    <div class="table-main" :style="{top:topValue}">
      <p style="font-size:12px;margin:0px 0 10px 0;color:#606626">初步结果-预览</p>
      <el-row :gutter="10">
        <el-col :span="1.5" v-if="!viewTableObj.show">
          <span style="color:#606266;font-size:14px">参保地：</span>
          <el-select v-model="queryParams.ybd" size="small" @change="getList()">
            <el-option label="本地" value="01"></el-option>
            <el-option label="异地" value="02"></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="1.5" v-if="viewTableObj.show">
          <el-button type="default"  size="small" @click="viewTableObj.show = false">返回上一层</el-button>
        </el-col> -->
        <el-radio-group @change="typeChange" v-model="tabsValue" size="small" class="top-right-btn">
          <el-radio-button label="listjc" value="listjc">按疑点来源方式汇总</el-radio-button>
          <el-radio-button label="listjg" value="listjg">按违规类别汇总</el-radio-button>
        </el-radio-group>
      </el-row>
      <div v-if="viewTableObj.show" style="height:calc(100% - 110px);margin-top:5px">
        <ViewTable :options="viewTableObj.options" @click-back="viewTableObj.show = false"/>
      </div>
      <jc-table ref="listjcTable" v-if="tabsValue=='listjc'&&!viewTableObj.show" @view-detail="viewHanddle"/>
      <wg-table ref="listjgTable" v-if="tabsValue=='listjg'&&!viewTableObj.show" @view-detail="viewHanddle2"/>
      <el-form style="margin-top:10px" inline v-if="!viewTableObj.show && !queryInfoFrom.fromLuli">
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
  </div>
</template>
<script>

import { submitDxqd} from "@/api/renwu/dcqz"
import JcTable from './jcTable.vue'
import WgTable from './wgTable.vue'
import ViewTable from './viewTable.vue'
import {pageMixin} from '@/utils/pageMixin.js'
export default {
  name:"Chubujieguo",
  mixins:[pageMixin],
  data(){
    return {
      topValue:0,
      tabsValue:'listjc',
      //上页带过来的info
      queryInfoFrom:{},
      //组合查询条件
      queryParams:{
        ybd:"",
      },
      viewTableObj:{
        show:false,
        options:{
          rwpcid:"",
          jgdm:""
        }
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
    ViewTable
  },
  created(){
    this.queryInfoFrom = this.$route.query
  },
  methods:{
    viewHanddle(row,type){
      const {jcfs} = row
      this.viewTableObj.options = {}
      this.viewTableObj.options.rwpcid = this.queryInfoFrom.rwpcid
      this.viewTableObj.options.jgdm = this.queryInfoFrom.jgdm
      if(row.jslb==='门诊'){
        this.viewTableObj.options['jslb'] = '0101'
      } else if(row.jslb==='住院'){
        this.viewTableObj.options['jslb'] = '0102'
      }
      if(jcfs && jcfs!=='小计'){
        this.viewTableObj.options['jcfs'] = jcfs
      }
      type && ( this.viewTableObj.options = {...this.viewTableObj.options,...type})
      this.viewTableObj.show = true
    },
    viewHanddle2(row,type){
      this.viewTableObj.options = {}
      this.viewTableObj.options.rwpcid = this.queryInfoFrom.rwpcid
      this.viewTableObj.options.jgdm = this.queryInfoFrom.jgdm
      row.wglx && row.wglx !=='合计' && (this.viewTableObj.options['wglx'] = row.wglx)
      row.xwrd && row.xwrd !=='小计' && (this.viewTableObj.options['xwrd'] = row.xwrd)
      type && ( this.viewTableObj.options = {...this.viewTableObj.options,...type})
      this.viewTableObj.show = true
      // console.log(this.viewTableObj,row)
    },
    saveDxqd(){
      if(!this.status){
        this.msgError('请选择复核意见')
        return false
      }
      const params = {
        ids:[this.queryInfoFrom.id],
        status:this.status,//提交5，退回3
        dxqd:this.status==5?'提交':'复核驳回',
        qdbh:this.qdbh,//驳回意见字段
        fhry:this.$store.getters.name,//登录账户
        fhbm:this.$store.getters.dept,//登录人员部门
        type:this.queryInfoFrom.mxsum?2:1
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
        setTimeout(()=>{
          this.$router.back(-1)
        },500)
        this.addJcfl({
          jglc:'形成结果',
          // gjxx:`形成结果 ${params.status===5?'提交':'退回'}：批号为${this.queryInfoFrom.rwpcid}机构代码为${this.queryInfoFrom.jgdm}`,
          gjxx:``,
          rwpcid:this.queryInfoFrom.rwpcid,
          jgdm:this.queryInfoFrom.jgdm,
          zhczr:this.$store.getters.name,
          sort:10
        })
        this.addJcfl({
          jglc:'结果复核',
          gjxx:`复核意见：${this.status==5?'提交':'复核驳回'}；具体说明：${this.qdbh}`,
          rwpcid:this.queryInfoFrom.rwpcid,
          jgdm:this.queryInfoFrom.jgdm,
          zhczr:this.$store.getters.name,
          sort:11
        })
      })
    },
    /** 查询renwu列表 */
    async getList() {
      const {rwpcid,jgdm} = this.queryInfoFrom
      const params = {rwpcid,jgdm,ybd:this.queryParams.ybd}
      await this.$refs[`${this.tabsValue}Table`].getList(params)
    },
    typeChange(){
      this.viewTableObj.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:202px;
  bottom:0;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  padding-left: 20px;
  position: absolute;
  bottom:0;
  left:0;
}
</style>
