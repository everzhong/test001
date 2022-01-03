<template>
  <div class="app-container">
    <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
      <el-button type="primary" plain size="mini">查看案件信息</el-button>
      <el-button type="primary" size="mini" @click="submitForm">提交审批</el-button>
       <el-button type="primary" icon="el-icon-back" size="mini" @click="lianBack">返回</el-button>
    </div>
    <div class="zhizuo-port">
        <div class="zhizuo">
          <div class="zhizuo-title">制作不予立案报告</div>
          <div class="zhizuo-item">
            <span>被举报人</span>
            <el-input size="small" v-model="zhizuo.bjbr"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.lxdh" maxlength="12"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>身份证号码</span>
            <el-input size="small" v-model="zhizuo.sid" maxlength="19"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>案情摘要</span>
            <el-input style="width:300px" size="small" rows="5" type="textarea" v-model="zhizuo.ajzy"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>承办人</span>
            <el-input size="small" v-model="zhizuo.cbr" maxlength="20"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>承办日期</span>
            <el-date-picker
              v-model="zhizuo.cbrq"
              type="date"
              size="small"
              placeholder="选择承办日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd hh:mm:ss"
              @change="satrtTimeCgange"
              >
            </el-date-picker>
          </div>
          <div style="text-align:right;padding:10px 60px 0 0">
            <el-button size="mini" type="primary" @click="submitForm">保存</el-button>
          </div>
        </div>
        <div :class="['pre-view']">
          <p class="top-tip">预览不予立案报告</p>
          <lianTemplate :noLian="true" :pageData="zhizuo"></lianTemplate>
        </div>
    </div>
  </div>
</template> 

<script>
import { updateRenwutwo } from "@/api/renwu/renwutwo"
import lianTemplate from './lianTemplate.vue'

export default {
  name: "NoLian",
  components: {
    lianTemplate,
  },
  data() {
    return {
      // 查询参数
      xzqOptions:[],
      zhizuo:{
        bjbr:'',
        lxdh:'',
        sid:'',
        ajzy:'',
        cbr:'',
        cbrq:''
      },
      zhzList:[],
    };
  },
  created() {
    let lianData = localStorage.getItem('LADATA')
    if(lianData){
      lianData = JSON.parse(lianData)
      this.zhzList = lianData
      this.zhizuo = lianData[0]
    }
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
  },
  methods: {
    lianBack(){
      this.zhzList = []
      window.localStorage.removeItem('PRDATA')
      this.$router.back(-1)
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
    
    /** 提交按钮 */
    submitForm() {
      const {
        bjbr,
        lxdh,
        sid,
        ajzy,
        cbr,
        cbrq
      } = this.zhizuo
      if(!(bjbr&&lxdh&&sid&&ajzy&&cbr&&cbrq)){
        this.msgError('请填完所有项目后再点保存')
        return false
      } 
      updateRenwutwo({
        id:this.zhizuo.id,
        lian:'2',
        bjbr,
        lxdh,
        sid,
        ajzy,
        cbr,
        cbrq,
        rwpcid:this.zhizuo.rwpcid,
        jgdm:this.zhizuo.jgdm
      }).then(res => {
        if(res.code===200){
          this.msgSuccess("操作成功！");
        }
      });
    },
    satrtTimeCgange(val){
      this.zhzList = this.zhzList.map(item=>{
        item.dayinstarttime = val
        return item
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container  {
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
    width:450px;
    color:#606266;
    .zhizuo-title {
      font-size: 18px;
      margin-bottom: 50px;
    }
    .zhizuo-item {
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 15px;
      width: 450px;
      &::v-deep .el-input__inner {
        color:#303313;
        width: 300px;
        margin-right: 10px;
      }
      &::v-deep .el-date-editor.el-input {
        width: 300px;
      }
      >span {
        display: block;
        width: 88px;
        color:#606266;
        flex-shrink: 0;
      }
    }
  }
  .pre-view {
    padding-left:50px;
    padding-right:20px;
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
      width: 595px;
      padding:10px 20px;
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
        margin-bottom: 10px;
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
        font-size: 14px;
        border:1px solid #303313;
        .content-title {
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          margin-bottom: 45px;
        }
        .company {
          text-align: left;
          display: inline-block;
          border-bottom: 1px solid #313303;
          margin-bottom: 30px;
        }
        .jianchaqk {
          text-indent: 2em;
          letter-spacing:2px;
          margin-top:10px;
          margin-bottom: 20px;
          text-align: justify;
          >span {
            text-indent: 0;
            text-align: center;
            display: inline-block;
            min-width: 150px;
            border-bottom: 1px solid #303310;
          }
        }
        .extra {
          margin-bottom:60px;
        }
        .sign {
          margin-bottom: 40px;
          padding-right:90px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    &.margin-style {
      margin: auto;
    }
  }
}
</style>
