<template>
  <div class="app-container">
    <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
      <el-button type="primary" icon="el-icon-back" size="mini" @click="lianBack">返回</el-button>
    </div>
    <div class="zhizuo-port">
        <div class="zhizuo">
          <div class="zhizuo-title">申请立案</div>
        </div>
        <div :class="['pre-view']">
          <!-- <p class="top-tip">预览立案报告</p> -->
          <lianTemplate :noPrint="true" :pageData="zhizuo"></lianTemplate>
        </div>
    </div>
    <div class="shenpi">
      <div>审批意见：</div>
      <div class="radios">
        <el-radio v-model="radio" label="3">同意</el-radio>
        <el-radio v-model="radio" label="5">驳回</el-radio>
      </div>
      <div class="mark"><el-input type="text" size="small"  v-model="zhizuo.lianyy"></el-input></div>
    </div>
    <div class="shenpi">
      <div class="rq-cbr" style="padding-bottom:30px">
        <span style="width:95px">确定立案日期</span>
        <el-date-picker
          v-model="zhizuo.lianriq"
          type="date"
          size="small"
          placeholder="选择承办日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd hh:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="rq-cbr" style="padding-bottom:30px">
        <span style="width:110px;margin-left:45px">确定案件承办人</span>
        <el-input clearable v-model="zhizuo.cbr" style="width:305px;margin-right:20px" type="text" size="small"></el-input>
        <el-button type="primary" size="small" @click="submitForm">提交</el-button>
      </div>
    </div>
</div>
</template> 

<script>
import { updateRenwutwo } from "@/api/renwu/renwutwo"
import lianTemplate from './lianTemplate.vue'

export default {
  name: "LianSp",
  components: {
    lianTemplate,
  },
  data() {
    return {
      radio:'',
      // 查询参数
      xzqOptions:[],
      zhizuo:{
        lianriq:'',
        lianyy:'',
        cbr:'',
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
      if(!this.radio){
        this.msgError('请选择审批意见')
        return false
      } 
      updateRenwutwo({
        id:this.zhizuo.id,
        lian:this.radio,
        lianyy:this.zhizuo.lianyy,
        lianriq:this.zhizuo.lianriq,
        cbr:this.zhizuo.cbr,
        rwpcid:this.zhizuo.rwpcid,
        jgdm:this.zhizuo.jgdm
      }).then(res => {
        if(res.code===200){
          this.msgSuccess("操作成功！");
        }
      });
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
    width:150px;
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
  .shenpi {
    font-size: 14px;
    padding-left: 150px;
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    .radios {
      margin-left: 10px;
      margin-right: 60px;
    }
    .mark {
      width:500px;
    }
    .rq-cbr {
      display: flex;
      align-items: center;
      span {
        display:block;
        flex-shrink: 0;
      }
    }
  }
}
</style>
