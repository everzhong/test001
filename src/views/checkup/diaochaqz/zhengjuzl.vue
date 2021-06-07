<template>
  <section class="diaocqz">
    <div class="content">
      <p class="qz-title">上传资料</p>
      <div class="item"><span class="tips-title">上传格式：</span><span>jpg、png、pdf、doc、docs、xls、xlsx,单个文件不超过10M</span></div>
      <div class="item">
        <div class="tips-title">选择文件：</div>
        <fileUpload
          v-model="wenjianurl"
          :fileSize="10"
          :fileType="uploadType"
          :isShowTip="false"
          ref="fileUpload"
        />
      </div>
      <div class="item">
        <span class="tips-title">资料说明：</span>
        <el-input type="text" v-model="wjsm" style="width:400px"></el-input>
      </div>
    </div>
    <div class="content">
      <p class="qz-title">资料文件列表</p>
      <el-table :data="tableData" border>
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="序号" type="index" align="center"  />
        <el-table-column label="资料说明" align="center" prop="zlsm"  show-overflow-tooltip/>
        <el-table-column label="资料文件" align="center" prop="wenjian"  show-overflow-tooltip/>
        <el-table-column label="上传人" align="center" prop="upman" show-overflow-tooltip/>
        <el-table-column label="上传时间" align="center" prop="addtime"  show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.addtime,'{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
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
      uploadType:["jpg","png","pdf","doc","docs","xls","xlsx"],
      wenjianurl:'',
      wjsm:'',
      tableData:[],
      queryParams:{
        pageNum: 1,
        pageSize: 10
      },
      total:0
    }
  },
  created(){
    this.getList()
  },
  methods:{
    /** 查询调查取证列表 type:1*/
    async getList() {
      const {rwpcid,jgbm} = this.$route.query
      const params = {rwpcid,jgbm,...this.queryParams,type:1}
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