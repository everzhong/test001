<template>
  <section class="diaocqz">
    <div class="content">
      <p class="qz-title">上传资料</p>
      <div class="item"><span class="tips-title">上传格式：</span><span>jpg、jpeg、png、pdf、doc、docs、xls、xlsx,单个文件不超过10M</span></div>
      <div class="item">
        <div class="tips-title">选择文件：</div>
        <fileUpload
          v-model="wenjian.wenjianurl"
          :fileSize="10"
          :fileType="uploadType"
          :isShowTip="false"
          :needHide="true"
          @input="upSuccess"
          ref="fileUpload"
        />
        <el-button v-if="this.wenjian.wenjianurl" type="primary" size="small" @click="submitFileInfo">提交</el-button>
      </div>
      <div class="item">
        <span class="tips-title">资料说明：</span>
        <el-input type="text" v-model="wenjian.zlsm" style="width:400px" clearable></el-input>
      </div>
    </div>
    <div class="content">
      <p class="qz-title">资料文件列表</p>
      <div style="max-height:450px;overflow:auto">
        <el-table :data="tableData" border>
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="序号" type="index" align="center"  />
          <el-table-column label="资料说明" align="center" prop="zlsm"  show-overflow-tooltip/>
          <el-table-column label="资料文件" align="center" prop="wenjianurl"  show-overflow-tooltip/>
          <el-table-column label="上传人" align="center" prop="upman" show-overflow-tooltip/>
          <el-table-column label="上传时间" align="center" prop="addtime"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.addtime,'{y}-{m}-{d} {h}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="downFile(scope.row.wenjianurl)">下载</el-button>
              <el-button type="text" size="mini" @click="deleteDoc(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </section>
</template>
<script>
import FileUpload from '@/components/FileUpload';
import { listDcqz, getDcqz, delDcqz, addDcqz, updateDcqz, exportDcqz } from "@/api/renwu/dcqz";
export default {
  name:'zhengjuzl',
  components:{
    FileUpload
  },
  data(){
    return {
      uploadType:["jpg","jpeg","png","pdf","doc","docs","xls","xlsx"],
      tableData:[],
      queryParams:{
        pageNum: 1,
        pageSize: 10
      },
      total:0,
      wenjian:{
        wenjianurl:'',//文件链接
        zlsm:'',//文件说明
        wenjian:''//文件明称
      }
    }
  },
  created(){
    this.getList()
  },
  methods:{
    /** 查询调查取证列表 type:1*/
    async getList() {
      const {rwpcid,jgdm} = this.$route.query
      const params = {rwpcid,jgdm,...this.queryParams,type:1}
      this.loading = true;
      try {
        const res = await listDcqz(params)
        if(res.code===200){
          this.tableData = res.rows;
          this.total = res.total;
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    upSuccess(fileUrl,file){
      if(fileUrl) {
        this.wenjian.wenjian = file.name
      } else {
        this.wenjian.wenjian = ''
      }
      
    },
    /**
     * 提交上传文件记录
     */
    submitFileInfo(){
      const {wenjian,wenjianurl,zlsm} = this.wenjian
      addDcqz({
        type:1,//文件资料type:1
        rwpcid:this.$route.query.rwpcid,
        jgdm:this.$route.query.jgdm,
        upman:this.$store.getters.name,
        addtime: new Date().getTime(),
        wenjian,
        wenjianurl,
        zlsm
      }).then(res=>{
        if(res.code===200) {
          this.msgSuccess('提交成功')
          this.wenjian.wenjianurl = ''
          this.getList()
        }
      })
    },
    downFile(url){
      window.open(url)
    },
    deleteDoc(row){
      this.$confirm('确定删除？')
      this.$confirm('确定删除此记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return delDcqz(row.qzid)
      }).then(res=>{
        if(res.code===200) {
          this.msgSuccess('删除成功')
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.diaocqz {
  .tips-title {
    margin-right:15px;
    flex-shrink: 0;
  }
  .content {
    font-size: 14px;
    color:#606266;
    .item {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }
  }
  &::v-deep .upload-file {
    .upload-file-uploader {
      float:right;
      margin-top: 2px;
      margin-bottom: 0;
    }
    .upload-file-list {
      float: right;
      margin-right: 15px;
      .el-upload-list__item {
        margin-top: 1px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.qz-title {
  font-size: 16px;
  color: #303133;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>