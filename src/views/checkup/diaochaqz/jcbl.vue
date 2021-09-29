<template>
  <div class="jcbl" v-loading="loading">
    <section class="zhizuo-outer">
      <p class="qz-title has-bg">制作检查笔录</p>
      <div class="zhizuo-port">
        <div class="zhizuo">
          <div class="zhizuo-item">
            <span>检查地点</span>
            <el-input size="small" v-model="zhizuo.jcdd"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>检查时间</span>
            <el-date-picker
                clearable
                size="small"
                v-model="zhizuo.jcsj"
                type="datetimerange"
                format="yyyy-MM-dd hh:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
          </div>
          <p class="qz-title">被检查单位信息</p>
          <div class="zhizuo-item">
            <span>单位全称</span>
            <el-input size="small" v-model="zhizuo.dwqc" disabled></el-input>
          </div>
          <div class="zhizuo-item">
            <span>
              机构代码
                <el-tooltip style="line-height:36px" effect="dark" content="非部队医院为“统一社会信用代码”，部队医院为“机构代码" placement="top-start">
                  <i class="el-icon-info"></i>
                </el-tooltip>
            </span>
            <el-input size="small" v-model="zhizuo.jgdm" disabled></el-input>
          </div>
          <div class="zhizuo-item">
            <span>地址</span>
            <el-input size="small" v-model="zhizuo.addr"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>法定代表人</span>
            <el-input size="small" v-model="zhizuo.faren"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input maxlength="12" size="small" v-model="zhizuo.tel"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>执法人员</span>
            <el-input size="small" v-model="zhizuo.zfry"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>记录人</span>
            <el-input size="small" v-model="zhizuo.upman"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>检查内容</span>
            <el-input type="textarea" :rows="2" resize="none" v-model="zhizuo.z1"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>检查情况：</span>
            <el-input type="textarea" :rows="4" resize="none" v-model="zhizuo.z2"></el-input>
          </div>
          <div style="text-align:right">
            <el-button size="mini" type="primary" @click="saveSubmit">保存</el-button>
          </div>
        </div>
        <div class="pre-view">
          <p class="top-tip">预览检查笔录</p>
          <!-- <div id="docPart" style="width:655px;padding:0;margin-left:32px" class="doc-part" ref="docPart">
            <h1 style="margin:0 0 12px 0;font-size:18px;font-weight:normal;text-align:center">上海市医疗保险监督检查所{{urlQuery.dcjg?`/${urlQuery.dcjg}`:''}}</h1>
            <p style="font-size:14px;text-align:center;letter-spacing:5px">行政执法文书</p>
            <div style="text-align:right;font-size: 12px;margin-bottom: 10px;margin-right: 10px;margin-top: 10px;">
              第<span style="padding:0 8px"></span>页&nbsp;&nbsp;&nbsp;&nbsp;共<span style="padding:0 8px"></span>页</div>
            <div class="content" style="padding:30px 35px;font-size:16px;border:1px solid #303313;letter-spacing:1px">
              <p style="font-weight:600;text-align: center;">检查笔录</p>
              <div style="line-height:36px">检查地点：{{zhizuo.jcdd}}</div>
              <div style="line-height:36px">检查时间：{{parseTime(zhizuo.jcsj[0],'{y}年{m}月{d}日{h}时{m}分')}}&nbsp;至&nbsp;{{parseTime(zhizuo.jcsj[1],'{y}年{m}月{d}日{h}时{m}分')}}</div>
              <p style="line-height:36px">被检查人（被检查单位）信息：</p>
              <div style="line-height:36px;margin-left:16px;">姓名（单位全称）：<span>{{zhizuo.dwqc}}</span></div>
              <div style="line-height:36px;margin-left:16px;">性别（类别/性质）：<span></span></div>
              <div style="line-height:36px;margin-left:16px;">住址（单位地址）：<span>{{zhizuo.addr}}</span></div>
              <div style="line-height:36px;margin-left:16px;">工作单位（法定代表人）：<span>{{zhizuo.faren}}</span></div>
              <div style="line-height:36px;margin-left:16px;">执法人员：<span>{{zhizuo.zfry}}</span></div>
              <div style="line-height:36px;margin-left:16px;">记录人：<span>{{zhizuo.upman}}</span></div>
              <br/>
              <br/>
              <div style="text-indent:2em;letter-spacing:2px;margin-top:10px;margin-bottom:40px;text-align:justify;line-height: 28px;">
                我们（至少2人）是上海市医疗保险监督检查所的行政执法人员{{urlQuery.dcjg?`/${urlQuery.dcjg}`:''}}的行政执法人员，负责辖区内的医疗保障行政执法工作，这是我们的执法证件，现对<span style="display:inline-block;text-indent:0;min-width:80px;border-bottom:1px solid #333;padding:0;margin:0 5px;"> {{zhizuo.z1}} </span>进行检查。
              <br/>检查情况：{{zhizuo.z2}}</div>
              <br/>
              <div style="margin-bottom:40px;padding-right:90px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;"><span>被检查人（被检查单位）（签名）：</span><span>见证人（签名）：</span></div>
              <div style="margin-bottom:40px;padding-right:90px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;"><span>执法人员（签名）：</span><span>记录人（签名）：</span></div>
            </div>
          </div> -->
          <bl-doc :pageData="{...zhizuo,dcjg:urlQuery.dcjg,jcstarttime:zhizuo.jcsj[0]||'',jcendtime:zhizuo.jcsj[1]||''}"/>
        </div>
      </div>
    </section>
    <p class="qz-title has-bg">检查笔录列表</p>
    <el-radio-group v-model="tabsValue" size="small" @change="radioChange">
      <el-radio-button label="2">在线制作列表</el-radio-button>
      <el-radio-button label="4">签字上传列表</el-radio-button>
    </el-radio-group>
    <el-radio-group size="small" class="top-right-btn">
      <fileUpload
        :fileSize="10"
        :isShowTip="false"
        :hideFileList="true"
        @input="upSuccess"
        ref="fileUpload"
      >
        <el-button slot="select-btn" size="small" type="parmary" plain class="el-icon-plus">上传签字扫描件</el-button>
      </fileUpload>
    </el-radio-group>
    <div v-show="tabsValue==='2'">
      <el-table class="qztable" :data="tableData" border style="margin-top:10px">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column  align="center" width="55">
            <template slot-scope="scope">
              <el-radio :label="scope.row.qzid" v-model="blCheck"></el-radio>
            </template>
          </el-table-column>
          <el-table-column label="单位全称" align="center" prop="dwqc"  show-overflow-tooltip/>
          <el-table-column label="法定代表人" align="center" prop="faren"  show-overflow-tooltip/>
          <el-table-column label="联系电话" align="center" prop="tel" show-overflow-tooltip/>
          <el-table-column label="检查地点" align="center" prop="jcdd" show-overflow-tooltip/>
          <el-table-column label="执法人员" align="center" prop="zfry" show-overflow-tooltip/>
          <el-table-column label="检查情况" align="center" prop="z2" show-overflow-tooltip/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="opertation(scope.row,'editQz')">修改</el-button>
              <!-- <el-button type="text" size="mini" @click="opertation(scope.row,'downloadQz')">下载</el-button> -->
              <el-button type="text" size="mini" @click="printDoc(scope.row)">下载</el-button>
              <el-button type="text" size="mini" @click="opertation(scope.row,'deleteQz')">删除</el-button>
              <!-- <el-button type="text" size="mini" v-print="{id:'docPart',popTitle:'检查笔录'}">打印</el-button> -->
              <el-button type="text" size="mini" @click="printDoc(scope.row)">打印</el-button>
            </template>
          </el-table-column>
      </el-table>
      <pagination
        style="float:right"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :autoScroll="false"
        @pagination="getList"
      />
    </div>
    <div v-show="tabsValue==='4'">
      <el-table  class="qztable" :data="uploadList" border style="margin-top:10px">
        <el-table-column label="序号" type="index" align="center"  />
          <el-table-column label="资料文件" align="center" prop="wenjianurl"/>
          <el-table-column label="上传人" align="center" prop="upman" :width="flexColumnWidth('upman',uploadList)"/>
          <el-table-column label="上传时间" align="center" prop="addtime"  :width="150">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.addtime,'{y}-{m}-{d} {h}:{s}') }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center" :width="100">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="downFile(scope.row.wenjianurl)">下载</el-button>
              <el-button type="text" size="mini" @click="deleteDoc(scope.row)">删除</el-button>
            </template>
        </el-table-column> -->
      </el-table>
      <pagination
        style="float:right"
        :total="total"
        :page.sync="uploadQuery.pageNum"
        :limit.sync="uploadQuery.pageSize"
        :autoScroll="false"
        @pagination="getList"
      />
    </div>
    <div id="printDoc" style="display:none;">
      <bl-doc :pageData="{...printData,dcjg:urlQuery.dcjg}"/>
    </div>
  </div>
</template>
<script>
import { listDcqz, getDcqz, delDcqz, addDcqz, updateDcqz, exportDcqz } from "@/api/renwu/dcqz";
import FileUpload from '@/components/FileUpload';
import BlDoc from './blDoc.vue'
import axios from 'axios'
export default {
  name:'Jcbl',
  data(){
    return {
      loading:false,
      tableData:[],
      uploadList:[],
      blCheck:false,
      queryParams:{
        pageNum: 1,
        pageSize: 10
      },
      uploadQuery:{
        pageNum: 1,
        pageSize: 10
      },
      zhizuo:{
        jcsj:[],
        zfry:'',
        addr:'',
        dwqc:'',
        jgdm:'',
        faren:'',
        tel:'',
        jcdd:'',
        upman:'',
        z1:'',
        z2:'',
      },
      total:0,
      uploadTotal:0,
      urlQuery:{},
      tabsValue:'2',
      //默认标记是新增
      opertationType:'add',
      printData:{
        jcsj:[],
      }
    }
  },
  created(){
    this.urlQuery = this.$route.query
    this.getList()
    this.zhizuo.jgdm = this.urlQuery.jgdm
    this.zhizuo.dwqc = this.urlQuery.jgmc
  },
  methods:{
     /** 查询调查取证列表 type=2*/
    async getList(options) {
      const {rwpcid,jgdm} = this.urlQuery
      let params = {rwpcid,jgdm,...this.queryParams,type:this.tabsValue}
      options && (params={...params,...options})
      this.loading = true;
      try {
        const res = await listDcqz(params)
        if(res.code===200){
          this.tabsValue==='2'?this.tableData = res.rows:this.uploadList = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async saveSubmit(){
      const params = {
        type:2,
        rwpcid:this.urlQuery.rwpcid,
        jgdm:this.urlQuery.jgdm,
        ...this.zhizuo
      }
      params.jcstarttime = this.zhizuo.jcsj[0]
      params.jcendtime = this.zhizuo.jcsj[1]
      delete params.jcsj
      if(this.opertationType==='edit'){//修改
        this.editQuzheng(params)
      } else {//新增
        delete params.qzid
        this.addQz(params)
      }
    },
    async addQz(params){
      this.loading = true
      try {
        const res = await addDcqz(params)
        if(res.code===200) {
          this.msgSuccess('保存成功')
          this.getList()
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async editQuzheng(padams){
      this.loading = true
      try {
        const res = await updateDcqz(padams)
        if(res.code===200) {
          this.opertationType = 'add'
          this.msgSuccess('修改成功')
          //清空还回默认新增的状态
          this.zhizuo ={...this.zhizuo,...{
            jcsj:[],
            zfry:'',
            addr:'',
            faren:'',
            tel:'',
            jcdd:'',
            upman:'',
            z1:'',
            z2:''
          }}
          this.getList()
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async deleteQz(row){
      this.$confirm('是否确认删除此项询问笔录?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delDcqz(row.qzid)
        }).then((res)=> {
          this.msgSuccess('删除成功')
          this.getList()
        })
    },
    downloadQz(row){
      row.jcsj = []
      if(row.jcendtime && row.jcstarttime) {
        row.jcsj = [new Date(row.jcstarttime),new Date(row.jcendtime)]
      }
      this.zhizuo = {...row}
      this.exportPdf()
    },
    editQz(row){
      this.opertationType = 'edit'
      row.jcsj = []
      if(row.jcendtime && row.jcstarttime) {
        row.jcsj = [new Date(row.jcstarttime),new Date(row.jcendtime)]
      }
      this.zhizuo = {...row}
      window.scrollTo(0,100);
      document.getElementsByClassName('zhizuo-outer')[0].scrollTop = 0

    },
    opertation(row,type){
      this[type](row)
    },
    printDoc(row){
      this.printData = row
      setTimeout(()=>{
        const newWin = window.open() // 新打开一个空窗口
        const print = document.getElementById('printDoc') // 获取需要打印的内容
        print.style.display = 'block'
        newWin.document.write(print.outerHTML) // 将需要打印的内容添加进新的窗口
        const styleSheet = `<style>#printDoc{margin:auto}</style>`
        newWin.document.head.innerHTML = styleSheet // 给打印的内容加上样式
        newWin.document.close() // 在IE浏览器中使用必须添加这一句
        newWin.focus() // 在IE浏览器中使用必须添加这一句
        newWin.print() // 打印
        newWin.close() // 关闭窗口
        print.style.display = 'none'
      },10)
    },
    exportPdf(title){
      const name = title||'检查笔录下载'
      this.$PDFSave(this.$refs['docPart'], name);
    },
    upSuccess(fileUrl,file){
      if(fileUrl) {
        addDcqz({
          type:4,//扫描文件资料type:4
          rwpcid:this.$route.query.rwpcid,
          jgdm:this.$route.query.jgdm,
          upman:this.$store.getters.name,
          addtime: new Date().getTime(),
          wenjian:file.name,
          wenjianurl:fileUrl
        }).then(res=>{
          if(res.code===200) {
            this.msgSuccess('上传成功')
            this.tabsValue==='4'&&(this.getList())
          }
        })
      }
    },
    radioChange(){
      this.getList()
    },
  },
  components:{
    FileUpload,
    BlDoc
  }
}
</script>
<style lang="scss" scoped>
.jcbl {
  .zhizuo-outer {
    height:380px;
    overflow: auto;
    margin-bottom: 15px;
  }
  .zhizuo-port {
    display: flex;
    padding-left:10px;
  }
  .zhizuo {
    flex-shrink: 0;
    width: 500px;
    color:#606266;
    .zhizuo-item {
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 10px;
      &::v-deep .el-input__inner {
        color:#303313;
      }
      >span {
        display: block;
        width: 100px;
        color:#606266;
        flex-shrink: 0;
      }
    }
  }
  .pre-view {
    padding-left:50px;
    padding-right:20px;
    margin-bottom: 20px;
    p {
      padding: 0;
      margin: 0;
    }
    .top-tip {
      font-size: 12px;
      color:#606266;
      padding-left: 30px;
      margin-bottom: 10px;
    }
  }
  .qz-title {
    &.has-bg {
      background-color: #f0f2f5;
      padding:10px;
      margin:10px 0;
    }
  }
  .qztable {
    &::v-deep .el-radio__label {
      display: none !important;
    }
  }
}
</style>