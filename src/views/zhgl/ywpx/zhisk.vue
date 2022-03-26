<template>
  <section class="zsk">
   <div class="search">
      <el-input clearable placeholder="支持信息标题、信息标题关键字搜索" style="width:500px;margin-right:10px" v-model="fileName" size="small"></el-input>
      <el-button slot="append" icon="el-icon-search" type="primary" size="small" @click="getList">搜索</el-button>
    </div>
    <div style="margin-bottom:8px">
      <!-- <el-button type="primary" size="small">信息修改</el-button> -->
      <el-button type="primary" size="small" @click="uploadFile" plain>信息上传</el-button>
    </div>
    <s-table v-loading="loading" style="height:calc(100% - 140px)" :data="tableData" :header="tableHeader" :fixedNum="1">
      <!-- <el-table-column align="center" type="selection" width="55" slot="fixed"></el-table-column> -->
      <el-table-column align="center" label="序号" type="index" width="60" slot="fixed"></el-table-column>
      <el-table-column align="center" label="操作"  fixed="right" slot="operate" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看详情</el-button>
          <el-button type="text" size="mini" @click="editFile(scope.row)">修改</el-button>
          <!-- <el-button type="text" size="mini">下载</el-button> -->
        </template>
      </el-table-column>
    </s-table>
    <div class="bottom">
     <pagination
      style="height:40px"
      :total="total"
      :page.sync="pageParams.pageNum"
      :limit.sync="pageParams.pageSize"
      @pagination="getList"
      />
    </div>
    <el-dialog
      :title="editType?'信息上传':'信息修改'"
      :visible.sync="dialogVisible"
      width="800px"
      class="up-file"
      :close-on-click-modal='false'
      >
      <el-form ref="addform" :model="upForm" label-width="90px" size="small">
        <el-form-item label="索引号" prop="syh">
          <el-input v-model="upForm.syh"></el-input>
        </el-form-item>
        <el-form-item label="信息标题" prop="syh">
          <el-input v-model="upForm.noticeTitle"></el-input>
        </el-form-item>
        <el-form-item label="发文机构" prop="sybt">
          <el-input v-model="upForm.sybt"></el-input>
        </el-form-item>
        <el-form-item label="发文时间" prop="createTime">
           <el-date-picker
            :disabled="editType!==1"
            style="width:275px"
            v-model="upForm.createTime"
            type="datetime"
            >
          </el-date-picker>
        </el-form-item>
         <el-form-item label="主题分类" prop="ztfl">
          <el-input v-model="upForm.ztfl" disabled></el-input>
        </el-form-item>
      </el-form>
      <div class="file-list">
        <el-upload
          style="margin-bottom:10px"
          :action="uploadFileUrl"
          :before-upload="handleBeforeUploadZw"
          :limit="1"
          :file-list="zwSlectedList"
          :on-error="handleUploadError"
          :on-exceed="handleExceedZw"
          :on-success="handleUploadSuccessZw"
          :show-file-list="false"
          :auto-upload="true">
          <el-button size="small" type="text">添加正文文件<span style="color:#999;margin-left:10px">(仅支持PDF格式的正文文件)</span></el-button>
        </el-upload>
        <div class="file-item" v-if="zwFileName">
            <el-input  @blur="fileNameBlur('zw')" ref="fileNamezw" :class="iszwEdit?'':'no-border'" v-model="zwFileName" size="mini"></el-input>
            <el-button type="text" size="mini" @click="eidtFileName('zw')" v-if="editType">编辑名称</el-button>
            <el-button type="text" size="mini" @click="delFile('zw')" v-if="editType">删除</el-button>
        </div>
        <el-upload
            :action="uploadFileUrl"
            :before-upload="handleBeforeUpload"
            :limit="15"
            :file-list="hasSlectedList"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            :on-success="handleUploadSuccess"
            :show-file-list="false"
            :auto-upload="true"
            @closed="dialogClosed"
            class="upload-file-uploader"
            ref="upload"
          >
            <el-button type="text" size="small">添加附件</el-button>
        </el-upload>
        <div class="file-item" v-for="(item,i) in fileList" :key="i">
            <el-input :disabled="!editType" @blur="fileNameBlur(i)" :ref="'fileName'+i" :class="item.isEdit?'':'no-border'" v-model="item.fileName" size="mini"></el-input>
            <el-button type="text" size="mini" @click="eidtFileName(i)" v-if="editType">编辑名称</el-button>
            <el-button type="text" size="mini" @click="delFile(i)" v-if="editType">删除</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPsjh"  element-loading-spinner="el-icon-loading" :disabled="addLoading" v-loading="addLoading" size="small">{{editType===2?'修 改':'确 定'}}</el-button>
        <el-button @click="dialogClosed" size="small" plain>返 回</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查看详情"
      :visible.sync="detailVisible"
      width="800px"
      class="check-detail"
      >
      <el-row class="top-part">
        <el-col :span="14">
          <span class="title">索引号：</span><span class="content">{{detail.syh}}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">主题分类：</span><span class="content">{{this.zstype==1?"医保正策":"法律法规"}}</span>
        </el-col>
        <el-col :span="14">
          <span class="title">发文机构：</span><span class="content">{{detail.sybt}}</span>
        </el-col>
        <el-col :span="8">
          <span class="title">发文时间：</span><span class="content">{{parseTime(detail.createTime)}}</span>
        </el-col>
      </el-row>
      <div style="padding:20px;margin-top:10px;border:1px solid #ecedf1;min-height:100px">
        <pdf
          v-if="detail.url"
          style="height:200px;overflow:auto"
          :src="detail.url"
        ></pdf>
        <!-- <h1 style="text-align:center;margin-bottom:0">基本医疗保险政策</h1>
        <p style="text-align:center;margin-top:5px">医保办发(2020)17号</p>
        <div style="text-indent:2em;margin-top:20px;line-height:24px;text-align:justify;color:#333">医疗保障是减轻群众就医负担、增进民生福祉、维护社会和谐稳定的重大制度安排。习近平总书记指出，要加快建立覆盖全民、城乡统筹、权责清晰、保障适度、可持续的多层次医疗保障体系。新一轮医改以来，贯彻党中央、国务院决策部署，我国已建成全世界最大、覆盖全民的基本医疗保障网，为全面建成小康社会、实现第一个百年奋斗目标作出了积极贡献。为进一步推进医疗保障高质量发展，保障人民健康，促进共同富裕，依据《中华人民共和国国民经济和社会发展第十四个五年规划和2035年远景目标纲要》和《中共中央国务院关于深化医疗保障制度改革的意见》，制定本规划。
</div> -->
        <br><el-button size="mini" type="text" @click="downLoadZw(detail.url)" v-if="detail.url">下载正文：{{detail.filename}}</el-button><br>
        <div v-if="detail.fjList.length">
          <el-button size="mini" style="display:block;margin-left:0" @click="downLoadZw(list.url)" type="text" v-for="list in detail.fjList" :key="list.filename">下载附件：{{list.filename}}</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClosed" size="small" plain>返 回</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import {listNotice,addNotice,updateNotice} from '@/api/system/notice.js'
import axios from 'axios'
import { Loading } from 'element-ui';
import pdf from 'vue-pdf'
export default {
  name:'Ybzc',
  components:{
    pdf
  },
  props:['zstype'],
  data(){
    return {
      editType:1,
      uploadFileUrl: axios.defaults.baseURL + "/common/upload", // 上传的图片服务器地址
      dialogVisible: false,
      detailVisible: false,
      loading:false,
      addLoading:false,
      fileName: '',
      total:0,
      pageParams:{
        pageNum:1,
        pageSize:50
      },
      upForm: {
        noticeTitle:'',
        syh: '',
        ztfl: '',
        sybt: '',
        createTime: ''
      },
      tableHeader: [{
        prop: 'noticeTitle',
        label: '信息标题',
      }, {
        prop: 'createTime',
        label: '上传时间',
        viewFun:(time)=>{
          return this.parseTime(time)
        }
      }],
      detail:{
        fjList:[]
      },
      tableData: [],
      loadingUI:'',
      fileList:[],//附件列表
      zwSlectedList:[],//上传的正文文件列表
      zwFileName:'',//正文文件名
      zwFileUrl:'',//正文文件url
      iszwEdit:false,
      hasSlectedList:[],//附件选择的列表
      fileType:['doc','docs','pdf'],//附件文件类型
    }
  },
  created(){
    this.getList()
  },
  methods:{
    // 上传前校检格式和大小
    handleBeforeUploadZw(file) {
      // 校检文件类型
      // if (this.fileType) {
      let fileExtension = "";
      if (file.name.lastIndexOf(".") > -1) {
        fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
      }
      const isTypeOk = ['pdf'].some((type) => {
        if (file.type.indexOf(type) > -1) return true;
        if (fileExtension && fileExtension.indexOf(type) > -1) return true;
        return false;
      });
      if (!isTypeOk) {
        this.$message.error(`文件格式不正确, 请上传PDF格式文件!`);
        return false;
      }
      // }
      this.loadingUI = Loading.service();
      return true;
    },
    // 上传成功回调
    handleUploadSuccessZw(res, file) {
      // this.zwSlectedList = []
      console.log(file.name,res.url)
      this.zwFileName = file.name
      this.zwFileUrl = res.url
      this.loadingUI.close();
      // this.fileList.push({
      //   fileName:file.name,
      //   url:res.url,
      //   isEdit:false
      // })
      // console.log(this.fileList)
    },
    handleExceedZw(files, fileList,limit) {
      this.$message.warning(`当前限制选择 1 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$message.error(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      this.loadingUI = Loading.service();
      return true;
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      // this.$message.success("上传成功");
      this.loadingUI.close();
      this.fileList.push({
        fileName:file.name,
        url:res.url,
        isEdit:false
      })
      console.log(this.fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 15 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
     // 上传失败
    handleUploadError(err) {
      this.loadingUI.close();
      this.$message.error("上传失败, 请重试");
    },
    eidtFileName(index){
      if(index!=='zw'){
        this.fileList[index].isEdit = true
        this.$refs[`fileName${index}`][0]?.focus()
      } else {
        this.iszwEdit = true
        this.$refs.fileNamezw.focus()
      }
      
    },
    fileNameBlur(index){
      if(index!=='zw'){
        this.fileList[index].isEdit = false
      } else {
        this.iszwEdit = false
      }
    },
    delFile(index){
      this.$confirm(`确定移除文件？`).then(()=>{
        if(index!=='zw'){
          this.fileList.splice(index,1)
          this.hasSlectedList.splice(index, 1);
        }else{
          this.zwFileName = ''
          this.zwFileUrl = ''
          this.zwSlectedList = []
        }
        
      });
    },
    uploadFile () {//信息上传
      this.editType = 1
      this.upForm.ztfl = this.zstype==1?"医保政策":'法律法规'
      this.dialogVisible = true
    },
    editFile(row){//信息修改
      this.editType = 2
      const {noticeTitle,syh,sybt,createTime,filename,url,noticeId} = row
      this.upForm = {noticeTitle,syh,sybt,createTime,noticeId}
      this.upForm.ztfl = this.zstype==1?"医保政策":'法律法规'
      this.zwFileName = filename
      this.zwFileUrl = url
      for(let i=1;i<15;i++) {
        if(row[`filename${i}`] && row[`url${i}`]){
          this.fileList.push({
            fileName:row[`filename${i}`],
            url:row[`url${i}`],
            isEdit:false
          })
        }
      }
      this.dialogVisible = true
    },
    checkDetail (row) {
      const url = row.url?pdf.createLoadingTask(row.url):''
      this.detail = {...row}
      this.detail.url = url
      const fjList = []
      for(let i=1;i<15;i++) {
        if(row[`url${i}`]){
          fjList.push({
            filename:row[`filename${i}`],
            url:row[`url${i}`]
          })
        }
      }
      this.detail.fjList = fjList
      this.detailVisible = true
      console.log(this.detail)
    },
    dialogClosed(){
      this.upForm = {
        noticeTitle:'',
        syh: '',
        ztfl: '医保政策',
        sybt: '',
        createTime: ''
      },
      this.detail = {
        fjList:[]
      }
      this.dialogVisible = false
      this.detailVisible = false
      this.fileList = []
      this.hasSlectedList = []
      this.zwSlectedList = []
    },
    downLoadZw(url){
      window.open(url,"_blank")
    },
    async getList(){
      this.loading = true
      try {
        const params = {...this.pageParams,noticeTitle:this.fileName,noticeType:1,zstype:this.zstype}
        const res = await listNotice(params)
        if(res.code===200){
          this.total = res.total;
          this.tableData = res.rows
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    async addPsjh(){
      const {createTime} = this.upForm
      const params = { ...this.upForm, noticeType:1, zstype:this.zstype,filename:this.zwFileName,url:this.zwFileUrl}//zstype:1医保政策，2法律法规
      if(this.fileList.length){
        this.fileList.forEach((item,i)=>{
          params[`filename${(i+1)}`] = item.fileName,
          params[`url${(i+1)}`] = item.url
        })
      }
      const len = this.fileList.length+1
      for(let i=len;i<16;i++){
        params[`filename${i}`] = ''
        params[`url${(i)}`] = ''
      }
      if(this.zwFileName){
        params.fileName = this.zwFileName
        params.url = this.zwFileUrl
      }
      this.addLoading = true
      try {
        let res = ''
        if(this.editType===2){//编辑
          params.updateTime = this.parseTime(new Date().toLocaleDateString())
          res = await updateNotice(params)
        } else {//新增
          params.createTime = createTime?(this.parseTime(createTime.toLocaleDateString())):''
          res = await addNotice(params)
        }
        if(res.code===200){
          this.msgSuccess(this.editType===2?"修改成功":"新增成功");
          this.getList()
          this.dialogClosed()
        }
      } catch (error) {
        console.log(error)
      }
      this.addLoading = false

    },
  }
}
</script>
<style lang="scss" scoped>
.zsk {
  padding: 15px 20px;
  text-align: left;
  box-sizing: border-box;
  position: absolute;
  top:0;
  right: 0;
  bottom: 0;
  left: 0;
  .search {
    margin-bottom: 20px;
    display: flex;
  }
  .check-detail {
    &::v-deep .el-dialog__body {
      padding-bottom:5px;
    }
    .top-part {
      padding: 15px 20px;
      border: 1px solid #ecedf1;
    }
    .title,.content {
      line-height: 28px;
    }
    .title {
      display: inline-block;
      color:#999;
      width: 80px;
    }
    .content {
      font-size: 16px;
      color:#333
    }
  }
  .up-file {
    &::v-deep .el-dialog__body {
      padding: 25px 35px 20px 20px;
    }
    &::v-deep .el-form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .el-form-item {
      width: 49%;
      margin-bottom: 14px;
    }
  }
  .dialog-footer {
    &::v-deep .el-loading-mask{
      border-radius: 3px;
      .el-loading-spinner {
        top:100%
      }
    }
  }
  .file-list {
     padding-left:20px;
     .file-item {
      display: flex;
      padding-right: 18px;
      background-color: #f2f2f2;
      margin-bottom: 3px;
      &::v-deep .el-input {
        // width: auto;
        background-color: transparent;
        margin-right: 15px;
        .el-input__inner {
          background-color: transparent;
        }
        &.no-border {
          .el-input__inner {
            border-color: transparent !important;
          }
        }
      }
    }
  }
}
</style>