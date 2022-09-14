<template>
  <section class="zsk">
   <el-form class="top-search1" :inline="true" :model="searchForm" label-width="60px" size="small">
    <el-form-item label="培训主题">
      <el-input v-model="searchForm.noticeTitle" clearable></el-input>
    </el-form-item>
    <el-form-item label="培训时间">
      <el-date-picker
        style="width:250px"
        v-model="searchForm.pssj"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="主讲人">
      <el-input v-model="searchForm.zjr" clearable></el-input>
    </el-form-item>
     <el-form-item>
      <el-button type="primary" @click="getList">查询</el-button>
    </el-form-item>
   </el-form>
    <div style="margin-bottom:8px;margin-top:15px">
      <el-button type="primary" size="small"  @click="addPeixun">新增培训</el-button>
    </div>
    <div v-loading="loading" style="height:calc(100% - 140px)">
      <s-table :data="tableData" :header="tableHeader" :fixedNum="1">
        <el-table-column align="center" type="index" width="60" label="序号" slot="fixed"></el-table-column>
        <el-table-column align="center" label="操作"  fixed="right" slot="operate" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="checkDetail(scope.row)">查看详情</el-button>
            <el-button type="text" size="mini" @click="deleteNotice(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </s-table>
    </div>
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
      :title="editType?'新增培训':'查看详情'"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      width="800px"
      class="up-file"
      @closed="dialogClosed"
      >
          <el-form ref="addpsform" :model="psForm" label-width="90px" size="small">
            <el-form-item label="培训主题" prop="noticeTitle">
              <el-input v-model="psForm.noticeTitle" :disabled="!editType"></el-input>
            </el-form-item>
            <el-form-item label="培训内容" prop="noticeContent">
              <el-input v-model="psForm.noticeContent" :disabled="!editType"></el-input>
            </el-form-item>
            <el-form-item label="主讲人" prop="zjr">
              <el-input v-model="psForm.zjr" :disabled="!editType"></el-input>
            </el-form-item>
            <el-form-item label="培训时间" prop="pssj">
              <el-date-picker
                style="width:282px"
                v-model="psForm.pssj"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd" :disabled="!editType">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="培训方式" prop="psfs">
              <el-input v-model="psForm.psfs" :disabled="!editType"></el-input>
            </el-form-item>
            <el-form-item label="培训地点" prop="psdd">
              <el-input v-model="psForm.psdd" :disabled="!editType"></el-input>
            </el-form-item>
            <el-form-item label="培训对象" prop="psdx">
              <el-input v-model="psForm.psdx" :disabled="!editType"></el-input>
              <!-- <el-select v-model="psForm.psdx" placeholder="请选择" style="width:282px">
                <el-option
                  v-for="item in psdxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="状 态" prop="status">
              <el-select v-model="psForm.status" placeholder="请选择" style="width:282px" :disabled="!editType">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="file-list">
            <el-upload
              v-if="editType"
              :action="uploadFileUrl"
              :before-upload="handleBeforeUpload"
              :limit="15"
              :file-list="hasSlectedList"
              :on-error="handleUploadError"
              :on-exceed="handleExceed"
              :on-success="handleUploadSuccess"
              :show-file-list="false"
              :auto-upload="true"
              class="upload-file-uploader"
              ref="upload"
            >
              <el-button type="text" size="mini">添加附件</el-button>
            </el-upload>
            <div v-for="(item,i) in fileList" :key="i">
              <div class="file-item" v-if="editType">
                <el-input  @blur="fileNameBlur(i)" :ref="'fileName'+i" :class="item.isEdit?'':'no-border'" v-model="item.fileName" size="mini"></el-input>
                <el-button type="text" size="mini" @click="eidtFileName(i)">编辑名称</el-button>
                <el-button type="text" size="mini" @click="delFile(i)" >删除</el-button>
              </div>
              <div class="file-item" v-else  @click="dowwnFile(item)">
                <span>{{item.fileName}}</span>
                <el-button type="text" size="mini">附件{{i+1}}</el-button>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button v-if="editType===1" type="primary" @click="addPsjh" size="small" element-loading-spinner="el-icon-loading" :disabled="addLoading" v-loading="addLoading">确 定</el-button>
            <el-button @click="dialogClosed" size="small" >返 回</el-button>
          </span>
    </el-dialog>
  </section>
</template>
<script>
import FileUpload from '@/components/FileUpload';
import {listNotice,addNotice,delNotice} from '@/api/system/notice.js'
import { Loading } from 'element-ui';
import axios from 'axios'

export default {
  name:'Ybzc',
  components:{
    FileUpload
  },
  data(){
    return {
      uploadFileUrl: axios.defaults.baseURL + "/common/upload", // 上传的图片服务器地址
      fileType:['doc','docs','pdf'],
      loadingUI:'',
      hasSlectedList:[],
      wenjian:{
        url:'',
      },
      dialogVisible: false,
      searchForm: {
        noticeTitle:'',
        pssj:'',
        zjr:''
      },
      total:0,
      pageParams:{
        pageNum:1,
        pageSize:50
      },
      psForm: {
        noticeTitle: '',
        noticeContent: '',
        pssj: '',
        zjr: '',
        psfs:'',
        psdd:'',
        psdx:'',
        status:'0'
      },
      tableHeader: [{
        prop: 'noticeTitle',
        label: '培训主题',
        fixedWidth:65
      }, {
        prop: 'noticeContent',
        label: '培训内容',
        fixedWidth:65
      }, {
        prop: 'psstart',
        label: '培训开始时间',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}-{d}')
        }
      }, {
        prop: 'psend',
        label: '培训结束时间',
        viewFun:(time)=>{
          return this.parseTime(time,'{y}-{m}-{d}')
        }
      }, {
        prop: 'zjr',
        label: '主讲人',
      }, {
        prop: 'psfs',
        label: '培训方式',
      }, {
        prop: 'psdx',
        label: '培训对象',
      }, {
        prop: 'status',
        label: '状态',
        viewFun:(status)=>{
          return ((status!==null&&status!==undefined)?['待培训','已取消','培训中','已培训'][status*1]:'')
        }
      }],
      tableData: [],
      fileList:[],
      editType:1,//1新增0查看
      psdxOptions:[],
      statusOptions:[{
        value:'0',
        label:'待培训'
      },{
        value:'1',
        label:'已取消'
      },{
        value:'2',
        label:'培训中'
      },{
        value:'3',
        label:'已培训'
      }],
      loading:false,
      addLoading:false
    }
  },
  created(){
    this.getList()
  },
  methods:{
    dowwnFile(i){
      const el = document.createElement('a')
      el.style.display='none'
      el.setAttribute('target','_blank')
      el.setAttribute('download',i.fileName)
      el.href = i.url
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    },
    dialogClosed(){
      this.psForm = {
        noticeTitle: '',
        noticeContent: '',
        pssj: '',
        zjr: '',
        psfs:'',
        psdd:'',
        psdx:'',
        status:'0'
      },
      this.dialogVisible = false
      this.fileList = []
      this.hasSlectedList = []
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
      // // 校检文件大小
      // if (this.fileSize) {
      //   const isLt = file.size / 1024 / 1024 < this.fileSize;
      //   if (!isLt) {
      //     this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
      //     return false;
      //   }
      // }
      this.loadingUI = Loading.service();
      return true;
    },
    // 上传失败
    handleUploadError(err) {
      this.loadingUI.close();
      this.$message.error("上传失败, 请重试");
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
    eidtFileName(index){
      this.fileList[index].isEdit = true
      this.$refs[`fileName${index}`][0]?.focus()
    },
    fileNameBlur(index){
      this.fileList[index].isEdit = false
    },
    delFile(i){
      this.$confirm(`确定移除 ${ this.fileList[i].fileName }？`).then(()=>{
        this.fileList.splice(i,1)
        this.hasSlectedList.splice(i, 1);
      });
    },
    addPeixun () {
      this.editType = 1
      this.dialogVisible = true
    },
    checkDetail (row) {
      const {
        noticeTitle,
        noticeContent,
        psstart,
        psend,
        zjr,
        psfs,
        psdd,
        psdx,
        status
      } = row
      const pssj = (psstart && psend)?[new Date(psstart),new Date(psend)]:''
      this.psForm ={
        noticeTitle,
        noticeContent,
        pssj,
        zjr,
        psfs,
        psdd,
        psdx,
        status
      }
      for(let i=1;i<16;i++){
        if(row[`filename${i}`]&&row[`url${i}`]){
          this.fileList.push({
            fileName:row[`filename${i}`],
            url:row[`url${i}`],
            isEdit:false
          })
        }
      }
      this.editType = 0
      this.dialogVisible = true
    },
    deleteNotice(row){
      this.$confirm('是否确认取消?', "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delNotice(row.noticeId);
      }).then(() => {
        this.msgSuccess("取消成功");
        this.getList()
      })
    },
    async addPsjh(){
      const { pssj } = this.psForm
      const params = { ...this.psForm, noticeType:'2' }
      delete params.pssj
      params.psstart = pssj?pssj[0]:''
      params.psend = pssj?pssj[1]:''
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
      this.addLoading = true
      try {
        const res = await addNotice(params)
        if(res.code===200||res.code===0){
          this.msgSuccess("新增成功");
          this.getList()
          this.dialogClosed()
         
        }
      } catch (error) {
        console.log(error)
      }
      this.addLoading = false

    },
    async getList(){
      this.loading = true
      try {
        const {noticeTitle,zjr,pssj} = this.searchForm
        console.log(pssj)
        let params = {
          noticeTitle,
          zjr,
          psstart:pssj?pssj[0].toLocaleDateString():'',
          psend:pssj?pssj[1].toLocaleDateString():'',
          noticeType:'2'
        }
        params = {...this.pageParams,...params}
        console.log(params,787)
        const res = await listNotice(params)
        if(res.code===200||res.code===0){
          this.total = res.total;
          this.tableData = res.rows
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
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
      justify-content: space-between;
      align-items: center;
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
      span {
        width: 100%;
        padding-left: 15px;
        cursor: pointer;
        font-size: 12px;
      }
    }
  }
}
</style>