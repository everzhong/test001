<template>
  <div class="app-container">
    <div class="zhizuo-port" >
        <div class="zhizuo">
          <div class="zhizuo-titlev1">{{zhizuo.lian==3?'已立案':'未立案'}}<span>{{zhizuo.lianrq}}</span></div>
          <div class="zhizuo-title">{{zhizuo.lian==3?'':'不予'}}立案报告</div>
        </div>
        <div :class="['pre-view']" v-loading="loading">
          <!-- <p class="top-tip">预览立案报告</p> -->
          <lianTemplate :noLian="zhizuo.lian==4" :pageData="zhizuo" noPrint="1"></lianTemplate>
        </div>
    </div>
</div>
</template> 

<script>
import { listRenwutwo } from '@/api/renwu/renwutwo'
import lianTemplate from '../checkup/lian/lianTemplate.vue'

export default {
  name: "LianSp",
  components: {
    lianTemplate,
  },
  data() {
    return {
      loading:false,
      // 查询参数
      xzqOptions:[],
      zhizuo:{
        lianrq:''
      },
      zhzList:[],
    };
  },
  created() {
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
    this.getList()
  },
  methods: {
    lianBack(){
      this.zhzList = []
      window.localStorage.removeItem('PRDATA')
      this.$router.replace('/checkup/jcss/lian')
    },
    async getList(){
      const {rwpcid,jgdm} = this.$route.query
      try {
        this.loading = true
        const res = await listRenwutwo({
          rwpcid,
          jgdm,
          status:3,
          pageNum:1,
          pageSize:1
        })
        if(res.code==200){
          this.zhzList = res.rows
          this.zhizuo = res.rows[0]
        }
      } catch (error) {
        console.log(error)
      }
      this.loading = false
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
    .zhizuo-titlev1 {
      font-size: 15px;
       margin-bottom: 20px;
       span {
        margin-left: 15px;
       }
    }
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
