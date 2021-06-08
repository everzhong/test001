<template>
  <div class="jcbl">
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
            <el-input size="small" v-model="zhizuo.dwqc"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>
              机构代码
                <el-tooltip class="item" effect="dark" content="非部队医院为“统一社会信用代码”，部队医院为“机构代码" placement="top-start">
                  <i class="el-icon-info"></i>
                </el-tooltip>
            </span>
            <el-input size="small" v-model="zhizuo.jgdm"></el-input>
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
            <el-input size="small" v-model="zhizuo.tel"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>执法人员</span>
            <el-input size="small" v-model="zhizuo.zfry"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>记录人</span>
            <el-input size="small" v-model="zhizuo.jlry"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>检查内容</span>
            <el-input type="textarea" :rows="2" resize="none" v-model="zhizuo.jcnr"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>检查情况：</span>
            <el-input type="textarea" :rows="4" resize="none" v-model="zhizuo.jcqk"></el-input>
          </div>
          <div style="text-align:right">
            <el-button size="mini" type="primary" @click="saveSubmit">保存</el-button>
          </div>
        </div>
        <div class="pre-view">
          <p class="top-tip">预览检查笔录</p>
          <div id="docPart" class="doc-part" ref="docPart">
            <h1 class="doc-title">上海市静安区医疗保障局</h1>
            <p class="sub-doc-title">行政执法文书</p>
            <div class="pagation">第<span></span>页&nbsp;&nbsp;&nbsp;&nbsp;共<span></span>页</div>
            <div class="content">
              <p class="content-title">检查笔录</p>
              <div class="item">检查地点：{{zhizuo.jcdd}}</div>
              <div class="item">检查时间：{{parseTime(zhizuo.jcsj[0],'{y}年{m}月{d}日{h}时{m}分')}}&nbsp;至&nbsp;{{parseTime(zhizuo.jcsj[1],'{y}年{m}月{d}日{h}时{m}分')}}</div>
              <p class="item">被检查人（被检查单位）信息：</p>
              <div class="item item-info">单位全称：{{zhizuo.dwqc}}</div>
              <div class="item item-info">类别/性质：定点医疗机构</div>
              <div class="item item-info">单位地址：{{zhizuo.addr}}</div>
              <div class="item item-info">法定代表人：{{zhizuo.faren}}</div>
              <div class="item item-info">记录人：{{zhizuo.jlry}}</div>
              <p class="jianchaqk">我们（至少2人）是上海市医疗保险监督检查所的行政执法人员负责辖区内的医疗保障行政执法工作，这是我们的执法证件，现对&nbsp; &nbsp;进行检查。<br>检查情况：{{zhizuo.jcqk}}</p>
              <div class="sign"><span>被检查人（被检查单位）（签名）：</span><span>见证人（签名）：</span></div>
              <div class="sign"><span>执法人员（签名）：</span><span>记录人（签名）：</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <p class="qz-title has-bg">检查笔录列表</p>
    <el-radio-group v-model="tabsValue" size="small">
      <el-radio-button label="online">在线制作列表</el-radio-button>
      <el-radio-button label="upload">签字上传列表</el-radio-button>
    </el-radio-group>
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
        <el-table-column label="检查情况" align="center" prop="jcqk" show-overflow-tooltip/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="opertation(scope.row,'editQz')">修改</el-button>
            <el-button type="text" size="mini" @click="opertation(scope.row,'downloadQz')">下载</el-button>
            <el-button type="text" size="mini" @click="opertation(scope.row,'deleteQz')">删除</el-button>
            <el-button type="text" size="mini" @click="opertation(scope.row,'printQz')">打印</el-button>
          </template>
        </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import {exportPdf} from '@/utils/index'
import { listDcqz, getDcqz, delDcqz, addDcqz, updateDcqz, exportDcqz } from "@/api/renwu/dcqz";
export default {
  name:'Jcbl',
  data(){
    return {
      tableData:[],
      blCheck:false,
      queryParams:{
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
        jlry:'',
        jcnr:'',
        jcqk:''
      },
      total:0,
      urlQuery:{},
      tabsValue:'online',
      //默认标记是新增
      opertationType:'add'
    }
  },
  created(){
    this.urlQuery = this.$route.query
    this.getList()
  },
  methods:{
     /** 查询调查取证列表 type=2*/
    async getList() {
      const {rwpcid,jgbm} = this.urlQuery
      const params = {rwpcid,jgbm,...this.queryParams,type:2}
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
    async saveSubmit(){
      const params = {
        type:2,
        rwpcid:this.urlQuery.rwpcid,
        jgbm:this.urlQuery.jgdm,
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
          this.zhizuo = {
            jcsj:[],
            zfry:'',
            addr:'',
            dwqc:'',
            jgdm:'',
            faren:'',
            tel:'',
            jcdd:'',
            jlry:'',
            jcnr:'',
            jcqk:''
          }
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
        }).then(res => {
          if(res.code===200) {
            this.msgSuccess('删除成功')
            this.getList()
          }
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
    },
    opertation(row,type){
      this[type](row)
    },
    exportPdf(title){
      const name = title||'下载'+ new Date().getTime()
      this.$PDFSave(this.$refs['docPart'], name);
      // html2Canvas(document.querySelector('#docPart')).then(function(canvas) {
      //   let contentWidth = canvas.width
      //   let contentHeight = canvas.height
      //   let pageHeight = contentWidth / 592.28 * 841.89
      //   let leftHeight = contentHeight
      //   let position = 0
      //   let imgWidth = 595.28
      //   let imgHeight = 592.28 / contentWidth * contentHeight
      //   let pageData = canvas.toDataURL('image/jpeg', 1.0)
      //   let PDF = new JsPDF('', 'pt', 'a4')
      //   if (leftHeight < pageHeight) {
      //       PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      //   } else {
      //       while (leftHeight > 0) {
      //           PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
      //           leftHeight -= pageHeight
      //           position -= 841.89
      //           if (leftHeight > 0) {
      //               PDF.addPage()
      //           }
      //       }
      //   }
      //   PDF.save(name + '.pdf')
      // })
    }
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
    padding-left:60px;
    p {
      padding: 0;
      margin: 0;
    }
    .top-tip {
      font-size: 12px;
      color:#606266;
      padding-left: 30px;
    }
    .doc-part {
      width: 800px;
      padding:20px 30px;
      flex-shrink: 0;
      .doc-title {
        margin: 0;
        font-size: 18px;
        font-weight: normal;
        text-align: center;
        margin-bottom: 12px;
      }
      .sub-doc-title {
        font-size: 14px;
        text-align: center;
        letter-spacing:5px;
      }
      .pagation{
        text-align: right;
        font-size: 12px;
        margin-bottom: 10px;
        margin-right: 10px;
        margin-top: 10px;
        >span {
          padding:0 5px;
        }
      }
      .content {
        padding:20px;
        font-size: 16px;
        border:1px solid #303313;
        letter-spacing:1px;
        .content-title {
          font-weight: 600;
          text-align: center;
        }
        .item {
          line-height: 36px;
          &.item-info {
            margin-left: 16px;
          }
        }
        .jianchaqk {
          text-indent: 2em;
          letter-spacing:2px;
          margin-top:10px;
          margin-bottom: 40px;
          text-align: justify;
        }
        .sign {
          margin-bottom: 40px;
          padding-right:90px;
          display: flex;
          justify-content: space-between;
        }
      }
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