<template>
  <div style="height:100%;padding-top:20px">
    <section style="height:100%">
      <el-row :gutter="10">
        <el-col :span="1.5" v-if="tabsValue==='three'">
          <span style="color:#606266;font-size:14px">参保地：</span>
          <el-select v-model="gzQueryForm.ybd" size="small" @change="getList()">
            <el-option label="本地" value="01"></el-option>
            <el-option label="异地" value="02"></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="setyy('1')">有异议</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="small" @click="setyy('2')">无异议</el-button>
        </el-col> -->
        <el-col :span="1.5" v-if="tabsValue==='three'">
          <el-button type="primary" plain size="small" @click="showCheckForm">查询条件</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='six'">
          <el-button type="primary" plain size="small" @click="showHecha=true">选择核查数据</el-button>
        </el-col>
        <el-col :span="1.5" v-if="tabsValue==='six'">
          <label style="font-size:12px;color:#606266;padding-right:6px;margin-left:10px">盘库时间</label>
          <el-date-picker
          v-model="pksj"
          align="right"
          type="daterange"
          size="small"
          start-placeholder="盘库期初时间"
          end-placeholder="盘库期末时间"
         >
        </el-date-picker>
        </el-col>
        <el-radio-group v-model="tabsValue" v-if="tabsValue=='three'||tabsValue=='six'"  size="small" class="top-right-btn" @change="tabsLevelChange1">
          <el-radio-button label="three">规则筛查</el-radio-button>
          <el-radio-button label="six">进销存核查</el-radio-button>
        </el-radio-group>
      </el-row>
      <div class="table-main"  v-loading="loading" v-if="tabsValue!=='four'&&tabsValue!=='six'">
        <sTable v-if="tabsValue=='three'" :data="renwuthreeList" :header="tableHeader" :fixedNum="2" :checkAll="false"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" slot="fixed" fixed/>
            <el-table-column label="序号" width="55" type="index" align="center" slot="fixed"/>
            <el-table-column label="操作" align="center"  min-width="180px" slot="operate">
              <template slot-scope="scope">
                <el-button type="text" @click="tongLiushuimx(scope.row)" size="mini">同流水号明细</el-button>
              </template>
            </el-table-column>
        </sTable>
      </div>
      <div v-loading="loading" v-else style="height:calc(100% - 159px)">
        <jxhecha v-if="tabsValue=='six'" :exHeight="88" :tableData="renwusixList" @on-change="handleSelectionChange" @on-log="checkLog" @update="getList"/>
      </div>
      <tongls ref="tongLiumx" v-if="tabsValue==='five'" :tableData="renwufiveList" :gzmc="xwrdForm.mxxmmc"></tongls>
      <div  class="fixed-bottom">
        <pagination
          v-show="!logShow&&!qmxOptions.show"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <div class="xingweirz" v-show="tabsValue!=='five'">
          <div class="yy-content">
            <span>核实意见</span>
            <el-radio-group v-model="queren" size="small">
              <el-radio label="1">确认</el-radio>
              <el-radio  label="2">不确认--需要说明并提供材料</el-radio>
            </el-radio-group>
          </div>
          <div>
            <div style="margin-bottom:8px">
              <span>上传相关资料（格式：jpg、png、pdf、doc、docx、xls、xlsx，单个文件不超过10M）</span>
            </div>
            <div>
              <fileUpload
                v-model="wenjian.wenjianurl"
                :fileSize="10"
                :fileType='["jpg","jpeg","png","pdf","doc","docs","xls","xlsx"]'
                :isShowTip="false"
                :needHide="true"
                :hideFileList="false"
                :buttonOPtions="{size:'mini',text:'选择文件'}"
                @input="upSuccess"
                ref="fileUpload"
              />
            </div>
          </div>
          <div class="yy-content">
            <span>情况说明</span>
            <el-input rows="2" type="textarea" v-model="hsyj"></el-input>
          </div>
          <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
        </div>
      </div>
      <hechashuju v-if="showHecha" :isShow="showHecha" @onClose="showHecha=false" @update="getList"/>
    </section>
     <!-- 查询条件 -->
    <el-dialog title="查询条件" class="check-dialog" :visible.sync="chaxunDialog" width="800px" >
      <el-form ref="chaxunForm" :model="gzQueryForm" :rules="rules" label-width="118px" size="small">
        <div class="form-group" v-if="tabsValue==='three'">
          <el-form-item label="规则分类" prop="gzfl">
            <el-select v-model="gzQueryForm.gzfl">
              <el-option
                v-for="item in gzflOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规则名称" prop="gzmc">
              <el-input clearable v-model="gzQueryForm.gzmc"></el-input>
          </el-form-item>
          <el-form-item label="涉及结算人次数" prop="xjjzrs">
            <div class="item-group">
              <el-input type="number" min="0"  v-model="gzQueryForm.xjjzrs"></el-input>
              <span>-</span>
              <el-input type="number" min="0"  v-model="gzQueryForm.sjrcs"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="涉及项目数" prop="xjmxs" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="gzQueryForm.xjmxs"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="gzQueryForm.bz"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="涉及金额" prop="xjje" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="gzQueryForm.xjje"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="gzQueryForm.ydsm"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="结算总费用" prop="jsfy" >
            <div class="item-group">
              <el-input type="number" min="0" v-model="gzQueryForm.jsfy"></el-input>
              <span>-</span>
              <el-input type="number" min="0" v-model="gzQueryForm.jsdj"></el-input>
            </div>
          </el-form-item>
        </div>
        <div class="form-group"  v-if="tabsValue==='six'">
          <el-form-item label="明细项目编号" prop="mxxmbm">
            <xmbm @onChecked="mxxmbmChecked" ref="mxxmbmPopo"/>
          </el-form-item>
          <el-form-item label="明细项目名称" prop="mxxmmc">
              <el-input clearable v-model="bmQueryForm.mxxmmc"></el-input>
          </el-form-item>
          <el-form-item label="明细项目数量" prop="mxxmsl">
            <div class="item-group">
              <el-input type="number" v-model="bmQueryForm.mxxmsl"></el-input>
              <span>-</span>
              <el-input type="number" v-model="bmQueryForm.wgsl"></el-input>
            </div>
          </el-form-item>
          <el-form-item class="long-label" label="明细项目医保结算范围费用" prop="mxxmbjsfy" >
            <div class="item-group">
              <el-input type="number" v-model="bmQueryForm.mxxmbjsfy"></el-input>
              <span>-</span>
              <el-input type="number" v-model="bmQueryForm.mxxmjyfy"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="明细项目单价" prop="mxxmdj" >
            <div class="item-group">
              <el-input type="number" v-model="bmQueryForm.mxxmdj"></el-input>
              <span>-</span>
              <el-input type="number" v-model="bmQueryForm.mxxmje"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="行为认定" prop="xwrd" >
              <el-select clearable v-model="bmQueryForm.xwrd">
                <el-option label="全部" value=""></el-option>
                <el-option label="未认定" value="1"></el-option>
                <el-option label="已认定" value="2"></el-option>
                <el-option label="疑点标记" value="3"></el-option>
              </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getList()" size="small">确 定</el-button>
        <el-button @click="resetCheckForm" size="small">重置</el-button>
      </div>
    </el-dialog>
    <guizeshuom :options="guizeOptions"></guizeshuom>
    <operate-log v-if="logOption.show" :options="logOption"></operate-log>
  </div>
</template>

<script>
// import { listRenwuthree,updateRenwuthree} from "@/api/renwu/renwuthree";
import {setYynr} from  '@/api/renwu/renwutwo'
import { listRenwufour, updateRenwufour } from '@/api/renwu/renwufour'
import { addDcqz} from "@/api/renwu/dcqz"
import Guizeshuom from '../jianchass/guizeshuom.vue'
import operateLog from '../jianchass/operateLog.vue'
import Jxhecha from './jxhecha.vue'
import Hechashuju from '../jianchass/hechashuju.vue'
import Tongls from './tongls.vue'
import xmbm from '../jianchass/xmbm.vue'
import FileUpload from '@/components/FileUpload';
import { getTLS } from '@/api/renwu/mingxi'
// import { getToken } from '@/utils/auth'
export default {
  name: "Hsshiliushuimx",
  components: {
    Guizeshuom,
    operateLog,
    Jxhecha,
    Hechashuju,
    xmbm,
    FileUpload,
    Tongls
  },
  props:{
    listConfig:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {
      queren:'',
      pageLoaing:true,
      showHecha:false,//显示选择核查数据
      wenjian:{
        wenjianurl:'',
        wenjian:''
      },
      tableHeader:[{
        prop: 'queren',
        label: '核实意见',
        fixedWidth:55,
        viewFun:(queren)=>{
          return queren==1?'确认':'不确认'
        },
      },{
        prop: 'jgmc',
        label: '机构名称',
        fixedWidth:60,
      },{
        prop: 'gzfl',
        label: '规则分类',
        align: 'left'
      },{
        prop: 'gzmc',
        label: '规则名称',
        align: 'left'
      },{
        prop: 'xwrd',
        label: '认定行为',
      },{
        prop: 'bz',
        label: '备注',
      },{
        prop: 'jslb',
        label: '就医类型',
        viewFun:(jslb)=>{
          return this.selectDictLabels(this.$store.getters.jslbDic,jslb)
        },
      },{
        prop: 'ybbf',
        label: '险种',
        viewFun: (ybbf)=>{
          return this.selectDictLabels(this.$store.getters.ybbfDic, ybbf)
        },
      },{
        prop: 'lsh',
        label: '交易流水号',
      },{
        prop: 'kh',
        label: '参保人卡号',
      },{
        prop: 'xm',
        label: '参保人姓名',
      },{
        prop: 'sfzh',
        label: '身份证号',
      },{
        prop: 'ksdm',
        label: '科室代码',
      },{
        prop: 'ksmc',
        label: '科室名称',
      },{
        prop: 'mxxmbm',
        label: '明细项目编号',
      },{
        prop: 'mxxmmc',
        label: '明细项目名称',
      },{
        prop: 'tym',
        label: '通用名',
      },{
        prop: 'mxxmdj',
        label: '明细项目单价(元)',
        viewFun: (mxxmdj)=>{
          return this.formatMoney(mxxmdj,2)
        }
      },{
        prop: 'mxxmsl',
        label: '明细项目数量',
        width: 'auto'
      },{
        prop: 'mxxmje',
        label: '明细项目金额(元)',
        viewFun: (mxxmje)=>{
          return this.formatMoney(mxxmje,2)
        }  
      },{
        prop: 'mxxmjyfy',
        label: '明细项目交易费用(元)',
        viewFun: (mxxmjyfy)=>{
          return this.formatMoney(mxxmjyfy,2)
        }  
      },{
        prop: 'mxxmbjsfy',
        label: '明细项目医保医保结算费用(元)',
        viewFun: (mxxmbjsfy)=>{
          return this.formatMoney(mxxmbjsfy,2)
        }  
      },{
        prop: 'jyrq',
        label: '结算日期',
        viewFun: (jyrq)=>{
          return this.parseTime(jyrq,'{y}-{m}-{d}')
        }
      },{
        prop: 'zkdj',
        label: '追款单价',
        viewFun: (zkdj)=>{
          return this.formatMoney(zkdj,2)
        }  
      },{
        prop: 'wgsl',
        label: '违规数量',
        width:'auto' 
      },{
        prop: 'wgfy',
        label: '违规费用(元)',
        width: 'auto',
        viewFun: (wgfy)=>{
          return this.formatMoney(wgfy,2)
        }
      },{
        prop: 'fylb',
        label: '费用类别',
        viewFun: (fylb)=>{
          return this.selectDictLabels(this.$store.getters.fyDic, fylb)
        },
        width: 'auto'
      }],
      qmxOptions:{
        show:false,
        query:{}
      },
      logShow:false,//操作记录
      heshiOption:{
        show:false
      },
      isDisabled:{
        dj:true,
        sl:false,
        fy:false
      },
      xwrdDialog:{
        show:false
      },
      hsyj:'',
      xwrdForm:{
        mxxmmc:'',
        xwrd:'',
        bz:'',
        zkdj:'',
        wgsl:'',
        wgfy:'',
        qckc:'',
        bqgr:'',
        xjxs:'',
        qmkc:'',
        ybjs:''
      },
      //选中的违规行为对象
      xwrdChecd:{},
      xwRules:{
        xwrd:[{required:true,message:'必填项'}],
        zkdj:[{required:true,message:'必填项'}],
        wgsl:[{required:true,message:'必填项'}],
        wgfy:[{required:true,message:'必填项'}],
        qckc:[{required:true,message:'必填项'}],
        bqgr:[{required:true,message:'必填项'}],
        xjxs:[{required:true,message:'必填项'}],
        qmkc:[{required:true,message:'必填项'}],
        ybjs:[{required:true,message:'必填项'}]
      },
      guizeOptions:{
        show:false
      },
      chaxunDialog:false,
      isAll:false,
      liushuiSetions:[],
      selectedId:"",
      selectionList:[],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      renwuthreeList: [],
      renwufourList:[],
      renwufiveList:[],
      renwusixList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
      },
      bmQueryForm:{
        mxxmbm:'',
        mxxmmc:'',
        mxxmsl:'',
        wgsl:'',
        mxxmbjsfy:'',
        mxxmjyfy:'',
        mxxmdj:'',
        mxxmje:'',
        xwrd:''
      },
      gzQueryForm:{
        gzfl:'',
        gzmc:'',
        xjjzrs:'',
        sjrcs:'',
        xjmxs:'',
        bz:'',
        xjje:'',
        ydsm:'',
        jsfy:'',
        jsdj:'',
        ybd:''
      },
      // 表单校验
      rules: {
        id: [
          { required: true, message: "序号不能为空", trigger: "blur" }
        ],
      },
      //默认只有一个规则筛查tab(第三层)
      tabsValue:'three',
      searchLsNextParams:{},
      searchTlsNextParams:{},
      logOption:{
        show:false,
        xwrd:'',
        type:'',
        id:''
      },
      lsh:'',//第四层的参数，查询同流水号明细需要用到
      mxxmbm:'',//第四层的参数，查询同流水号明细需要用到
      pksj:'', //盘库时间
      gzflOptions:[],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    tongLiushuimx(row){
      this.tabsValue = 'five'
      this.selectedId = ''
      this.lsh = row.lsh || ''
      this.mxxmbm = row.mxxmbm || ''
      this.searchTlsNextParams = {lsh:row.lsh||'',mxxmbm:row.mxxmbm}
      this.getList()
    },
    upSuccess(fileUrl,file){
      if(fileUrl) {
        this.wenjian.wenjian = file.name
      } else {
        this.wenjian.wenjian = ''
      }
    },
    setyy(){
      if(!this.ids.length){
        this.msgError('请至少选择一项')
        this.queren = ''
        return
      }
      let api = updateRenwufour
      let responseCount = 0
      this.loading = true
      this.ids.forEach(async id=>{
        try {
          await api({id,queren:this.queren})
          responseCount++
          if(responseCount===this.ids.length){
            this.getList()
          }
        } catch (error) {
          this.loading = false
          responseCount++
        }
      })
    },
    handleSubmit(){
      if(!this.ids.length){
        this.msgError('请至少选择一项')
        this.queren = ''
        return
      }
      if(!this.queren){
        this.msgError('请选择核实意见')
        return
      }
      if(!this.hsyj){
        this.msgError('请输入情况说明')
        return
      }
      if(this.queren==2&&!this.wenjian.wenjianurl){
        this.msgError('请上传说明材料')
        return
      }
      let responseCount = 0
      this.loading = true
      this.ids.forEach(async id=>{
        try {
          await updateRenwufour({id,queren:this.queren,hsyj:this.hsyj,type:this.tabsValue=='three'?1:2})
          responseCount++
          if(responseCount===this.ids.length){
            this.queren = ''
            this.hsyj = ''
            this.getList()
          }
        } catch (error) {
          this.loading = false
          responseCount++
        }
      })
      // setYynr({
      //   rwpcid:this.listConfig.rwpcid,
      //   jgdm:this.listConfig.jgdm,
      //   hsyj:this.hsyj
      // }).then(res=>{
      //   if(res.code===200){
      //     this.msgSuccess('操作成功')
      //     this.hsyj = ''
      //   }
      // })
      if(this.wenjian.wenjianurl){
        this.submitFileInfo()
      }
      
    },
    submitFileInfo(){
      const {wenjian,wenjianurl} = this.wenjian
      addDcqz({
        type: this.tabsValue==='three'?7:8,//文件资料
        rwpcid:this.listConfig.rwpcid,
        jgdm:this.listConfig.jgdm,
        upman:this.$store.getters.name,
        addtime: this.parseTime(new Date().getTime()),
        wenjian,
        wenjianurl,
      }).then(res=>{
        if(res.code===200) {
          this.wenjian.wenjian = ''
          this.wenjian.wenjianurl = ''
        }
      })
    },
    mxxmbmChecked(val){
      this.bmQueryForm.mxxmbm = val
    },
    resetCheckForm(){
      this.bmQueryForm = {
        mxxmbm:'',
        mxxmmc:'',
        mxxmsl:'',
        wgsl:'',
        mxxmbjsfy:'',
        mxxmjyfy:'',
        mxxmdj:'',
        mxxmje:'',
        xwrd:''
      }
      this.gzQueryForm = {
        gzfl:'',
        gzmc:'',
        xjjzrs:'',
        sjrcs:'',
        xjmxs:'',
        bz:'',
        xjje:'',
        ydsm:'',
        jsfy:'',
        jsdj:'',
        ybd:''
      }
      this.$refs['chaxunForm'].resetFields()
      this.$refs.mxxmbmPopo && (this.$refs.mxxmbmPopo.clear())
    },
    showCheckForm(){
      this.chaxunDialog = true
      if(this.tabsValue==='three'){
        this.gzflOptions.length===0 && (this.remoteGzflMethod())
      }
    },
    async remoteGzflMethod(){
      try {
        const res = await this.getDicts('sys_renwu_gzfl')
        if(res.code==200){
          this.gzflOptions = res.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    //规则筛查，进销存核查切换
    tabsLevelChange1(){
      this.queren = ''
      this.hsyj = ''
      this.wenjian.wenjianurl = ''
      this.ids = []
      this.getList()
    },
    //选择行为回调
    onChecked(res){
      this.xwrdChecd = res
      this.xwrdForm.xwrd = res.wgxw
    },
    /** 查询renwu列表 */
    async getList(query) {
      let params = {...this.queryParams,...this.listConfig, hszt:'3'}
      if(query){
        params = {...params,...query}
      }
      this.loading = true
      try {
        let  res = null
        switch(this.tabsValue) {
          case 'three':
            params.type=1
            res = await listRenwufour({...params,...this.gzQueryForm})
            break;
          case 'six':
            params.type=2
            res = await listRenwufour({...params,...this.bmQueryForm})
            break;
          default:
            // params.statu = 2 //0待网审1实施网审2对象确定3任务派发了4打印通知和实施检查5形成结果
            // res = await listRenwutwo(params)
            res = await getTLS({...this.params})
            break;
        }
        if(res.code===200){
          if(this.tabsValue=='five'){
            this[`renwufiveList`] = res.rows;
          } else {
            this[`renwu${this.tabsValue}List`] = res.rows;
          }
          this.total = res.total;
          if(this.chaxunDialog){
            this.resetCheckForm()
            this.chaxunDialog = false
          }
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 规则分类字典翻译
    gzflFormat(row, column) {
      return this.selectDictLabels(this.gzflOptions, row.gzfl);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      if(selection.length!==0){
        this.ids = selection.map(item => item.id)
        this.hsyj = selection[0]?.hsyj||''
      } else {
        this.ids=[]
      }
    },
    //操作记录
    checkLog(row,type){
      this.logOption.type = type
      this.logOption.rwpcid = row.rwpcid
      this.logOption.id = row.id
      this.logOption.xwrd = row.xwrd
      this.logOption.show = true
    },
  }
};
</script>
<style lang="scss" scoped>
.table-main {
  position: absolute;
  top:58px;
  bottom:162px;
  left: 20px;
  right: 20px;
}
.fixed-bottom {
  position: absolute;
  width: 100%;
  bottom:0px;
  left:0;
  padding-bottom: 10px;
}
.xingweirz {
  height: 80px;
  font-size: 14px;
  color: #606266;
  padding:0 20px;
  >div {
    float: left;
    margin-right: 30px;
    position: relative;
    &::v-deep .el-upload-list {
      position: absolute !important;
      width: 100%;
      top:15px;
    }
  }
  .yy-content {
    display: flex;
    width: 450px;
    span {
      width:80px;
    }
  }
}
.check-dialog {
  &::v-deep .el-dialog__body {
    padding:30px 20px 5px;
  }
  &::v-deep .el-dialog__footer {
    text-align: center;
  }
  .form-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-select {
      width: 100%;
    }
    .el-form-item {
      width: 48%;
      display: block;
    }
    .long-label {
      &::v-deep .el-form-item__label {
        line-height: normal;
        font-size: 12px;
      }
    }
  }
  .item-group {
    width: 100%;
    display: flex;
  }
}
</style>