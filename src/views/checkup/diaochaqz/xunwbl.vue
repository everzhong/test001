<template>
  <div class="jcbl" v-loading="loading">
    <section class="zhizuo-outer">
      <p class="qz-title has-bg">制作询问笔录</p>
      <div class="zhizuo-port">
        <div class="zhizuo">
          <div class="zhizuo-item">
            <span>调查时间</span>
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
           <div class="zhizuo-item">
            <span>调查地点</span>
            <el-input size="small" v-model="zhizuo.jcdd"></el-input>
          </div>
          <p class="qz-title">被询问人信息</p>
          <div class="zhizuo-item">
            <span>姓名</span>
            <el-input size="small" v-model="zhizuo.xwname"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>
              性别
            </span>
            <el-select style="width:100%" v-model="zhizuo.sex" placeholder="全部" clearable size="small">
              <el-option
                v-for="dict in sexOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <!-- <el-input size="small" v-model="zhizuo.sex"></el-input> -->
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.tel" maxlength="12"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>身份证号</span>
            <el-input size="small" v-model="zhizuo.sfz" maxlength="18"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系地址</span>
            <el-input size="small" v-model="zhizuo.lxdz"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>工作单位</span>
            <el-input size="small" v-model="zhizuo.dwqc"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>记录人</span>
            <el-input size="small" v-model="zhizuo.upman"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>调查事项</span>
            <el-input type="textarea" :rows="2" resize="none" v-model="zhizuo.z1"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>询问内容：</span>
            <el-input type="textarea" :rows="4" resize="none" v-model="zhizuo.z2"></el-input>
          </div>
          <div style="text-align:right">
            <!-- <el-button size="mini" type="primary" plain @click="exportPdf">导出PDF</el-button> -->
            <el-button size="mini" type="primary" @click="saveSubmit">保存</el-button>
          </div>
        </div>
        <div class="pre-view">
          <p class="top-tip">预览询问笔录</p>
          <xw-doc :pageData="{dcjg:urlQuery.dcjg,...zhizuo,jcstarttime:zhizuo.jcsj[0]||'',jcendtime:zhizuo.jcsj[1]||''}"/>
        </div>
      </div>
    </section>
    <p class="qz-title has-bg">询问笔录列表</p>
    <el-radio-group v-model="tabsValue" size="small" @change="radioChange">
      <el-radio-button label="3">在线制作列表</el-radio-button>
      <el-radio-button label="5">签字上传列表</el-radio-button>
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
    <div v-show="tabsValue==='3'">
    <el-table class="qztable" :data="tableData" border style="margin-top:10px">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column  align="center" width="55">
          <template slot-scope="scope">
            <el-radio :label="scope.row.qzid" v-model="blCheck"></el-radio>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="xwname"  :width="flexColumnWidth('xwname',tableData)"/>
        <el-table-column label="身份证" align="center" prop="sfz"  show-overflow-tooltip/>
        <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" width="65"></el-table-column>
        <el-table-column label="工作单位" align="center" prop="dwqc" show-overflow-tooltip/>
        <el-table-column label="联系电话" align="center" prop="tel" show-overflow-tooltip/>
        <el-table-column label="询问内容" align="center" prop="z2" show-overflow-tooltip/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="opertation(scope.row,'editQz')">修改</el-button>
            <el-button type="text" size="mini" @click="downloadQz(scope.row)">下载</el-button>
            <el-button type="text" size="mini" @click="opertation(scope.row,'deleteQz')">删除</el-button>
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
    <div v-show="tabsValue==='5'">
      <el-table  class="qztable" :data="uploadList" border style="margin-top:10px">
        <el-table-column label="序号" type="index" align="center"  width="66"/>
          <el-table-column label="资料文件" align="left" prop="wenjian" />
          <el-table-column label="上传人" align="left" prop="upman" :width="flexColumnWidth('upman',uploadList)"/>
          <el-table-column label="上传时间" align="left" prop="addtime"  :width="150">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.addtime,'{y}-{m}-{d} {h}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" :width="100">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="downFile(scope.row.wenjianurl)">下载</el-button>
              <el-button type="text" size="mini" @click="deleteDoc(scope.row)">删除</el-button>
            </template>
        </el-table-column>
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
      <xw-doc :pageData="{dcjg:urlQuery.dcjg, ...printData}"/>
    </div>
  </div>
</template>
<script>
import { listDcqz, delDcqz, addDcqz, updateDcqz } from "@/api/renwu/dcqz";
import FileUpload from '@/components/FileUpload';
import XwDoc from './xwDoc.vue'
import html2canvas from 'html2canvas'
import JsPDf from 'jspdf'
export default {
  name:'Xunwbl',
  data(){
    return {
      loading:false,
      wenjianurl:'',
      tableData:[],
      uploadList:[],
      blCheck:'',
      sexOptions:[],
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
        jcdd:'',
        xwname:'',
        sex:'',
        lxdz:'',
        dwqc:'',
        tel:'',
        upman:'',
        sfz:'',
        z1:'',
        z2:'',
        
      },
      total:0,
      uploadTotal:0,
      urlQuery:{},
      tabsValue:'3',
      opertationType:'add',
      printData:{}
    }
  },
  created(){
    this.urlQuery = this.$route.query
    this.getList()
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
  },
  methods:{
    downFile(url){
      window.open(url)
    },
    deleteDoc(row){
      this.$confirm('是否确认删除此文件?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delDcqz(row.qzid)
        }).then((res)=> {
          this.msgSuccess('删除成功')
          setTimeout(()=>{
            this.getList()
          },1000)
        })
    },
     /** 查询调查取证列表 type=3*/
    async getList(options) {
      const {rwpcid,jgdm} = this.urlQuery
      let params = {rwpcid,jgdm,...this.queryParams,type:this.tabsValue}
      options && (params={...params,...options})
      this.loading = true;
      try {
        const res = await listDcqz(params)
        if(res.code===200){
          this.tabsValue==='3'?this.tableData = res.rows:this.uploadList = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async saveSubmit(){
      const params = {
        type:3,
        rwpcid:this.urlQuery.rwpcid,
        jgdm:this.urlQuery.jgdm,
        ...this.zhizuo
      }
      params.jcstarttime = this.zhizuo.jcsj[0]?this.parseTime(this.zhizuo.jcsj[0].getTime()):""
      params.jcendtime = this.zhizuo.jcsj[1]?this.parseTime(this.zhizuo.jcsj[1].getTime()):""
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
          this.zhizuo = {
            jcsj:[],
            jcdd:'',
            xwname:'',
            sex:'',
            lxdz:'',
            dwqc:'',
            tel:'',
            upman:'',
            sfz:'',
            z1:'',
            z2:'',
          }
          this.getList()
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async deleteQz(row){
      console.log(this,this.layer)
      this.$confirm('是否确认删除此项询问笔录?', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delDcqz(row.qzid)
        }).then(res => {
          if(res.code===200) {
            this.msgSuccess('删除成功')
            this.getList()
          }
        })
    },
    downloadQz(row){
      this.editQz(row,true)
      const {xwname} = row
      let canvasImg = document.getElementById('xwbl')
      setTimeout(()=>{
        html2canvas(canvasImg,{
          width:1000,
          allowTaint:true,
          useCORS:true
        }).then(canvas=>{
          let url = canvas.toDataURL('image/jpeg');
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let imgWidth = 595.28
          let imgHeight = 595.28/(contentWidth/contentHeight)
          let PDF = new JsPDf('p','px','a4')
          PDF.addImage(url,"JPEG",30,25,imgWidth,imgHeight)
          PDF.save(`${xwname}-询问笔录.pdf`)
        },300)
      })
    },
    editQz(row,noScoll){
      this.opertationType = 'edit'
      row.jcsj = []
      if(row.jcendtime && row.jcstarttime) {
        row.jcsj = [new Date(row.jcstarttime),new Date(row.jcendtime)]
      }
      this.zhizuo = {...row}
      if(!noScoll){
        window.scrollTo(0,100);
        document.getElementsByClassName('zhizuo-outer')[0].scrollTop = 0
      }
    },
    printQz(){

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
      const name = title+'询问笔录下载'
      this.$PDFSave(this.$refs['docPart'], name);
    },
    // 性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabels(this.sexOptions, row.sex);
    },
    radioChange(){
      this.getList()
    },
    upSuccess(fileUrl,file){
      if(fileUrl) {
        addDcqz({
          type:5,//扫描文件资料type:5 询问笔录的扫描件
          rwpcid:this.$route.query.rwpcid,
          jgdm:this.$route.query.jgdm,
          upman:this.$store.getters.name,
          addtime: this.parseTime(new Date().getTime()),
          wenjian:file.name,
          wenjianurl:fileUrl
        }).then(res=>{
          if(res.code===200) {
            this.msgSuccess('上传成功')
            this.tabsValue==='5'&&(this.getList())
          }
        })
      }
    },
  },
  components:{
    FileUpload,
    XwDoc
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