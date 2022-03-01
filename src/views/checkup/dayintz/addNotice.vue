<template>
  <div class="app-container">
    <div style="position:absolute;right:20px;top:-72px;background-color:#fff">
      <el-button type="primary" icon="el-icon-back" size="mini" @click="dayinBack">返回</el-button>
    </div>
    <div class="zhizuo-port">
        <div class="zhizuo">
          <el-table v-if="zhzList.length>1" :data="zhzList" border style="margin-bottom:10px">
            <el-table-column label="机构代码" prop="jgdm" align="center" :width="flexColumnWidth('jgdm',zhzList)"></el-table-column>
            <el-table-column label="机构名称" prop="jgmc" align="center" :width="flexColumnWidth('jgmc',zhzList)"></el-table-column>
            <el-table-column label="行政区" align="center" prop="xzq" :formatter="xzqFormat"  show-overflow-tooltip/>
            <el-table-column fixed="right" label="检查开始时间" prop="dayinstarttime" align="center" :width="flexColumnWidth('dayinstarttime',zhzList)">
              <template slot-scope="scope">
                <span>{{parseTime(scope.row.dayinstarttime,'{y}年{m}月{d}日')}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="zhizuo-item">
            <span>检查开始日期</span>
            <el-date-picker
              v-model="zhizuo.dayinstarttime"
              type="date"
              size="small"
              placeholder="选择检查开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd hh:mm:ss"
              @change="satrtTimeCgange"
              >
            </el-date-picker>
          </div>
          <div class="zhizuo-item">
            <span>联系人</span>
            <el-input size="small" v-model="zhizuo.dayinname"></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.dayintel" maxlength="12"></el-input>
            <span>(检查通知书)</span>
          </div>
          <div class="zhizuo-item">
            <span>制作日期</span>
            <el-date-picker
              v-model="zhizuo.dayinriqi"
              type="date"
              size="small"
              placeholder="选择制作日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd hh:mm:ss"
              >
            </el-date-picker>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.dayinphone" maxlength="12"></el-input>
            <span>(纪律告知书)</span>
          </div>
          <div style="text-align:right;padding:5px 15px 0 0">
            <el-button :disabled="(!!zhizuo.isdayin && !this.checkRole(['admin']))" size="mini" type="primary" @click="submitForm">保存</el-button>
          </div>
        </div>
        <div :class="['pre-view']">
          <p class="top-tip">预览通知书</p>
          <single-notice v-if="zhzList.length<2" :pageData="zhizuo"></single-notice>
          <mutile-notice v-else :zhizuo="zhizuo" :noticeList="zhzList"></mutile-notice>
        </div>
    </div>
  </div>
</template> 

<script>
import { setDytz } from "@/api/renwu/renwutwo"
import SingleNotice from './singleNotice.vue'
import mutileNotice from './mutilNotice.vue'

export default {
  name: "AddNotice",
  components: {
    SingleNotice,
    mutileNotice
  },
  data() {
    return {
      // 选中数组
      ids: [],
      // 查询参数
      xzqOptions:[],
      zhizuo:{},
      zhzList:[],
    };
  },
  created() {
    let printData = localStorage.getItem('PRDATA')
    if(printData){
      printData = JSON.parse(printData)
      this.zhzList = printData
      //不管批量还是单个，首先默认编辑的都是第一份
      this.zhizuo = printData[0]
      this.ids = printData.map(item => item.id)
    }
    this.getDicts("sys_job_jgxx").then(response => {
      this.xzqOptions = response.data;
    });
  },
  methods: {
    dayinBack(){
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
        dayinstarttime,
        dayintel,
        dayinname,
        dayinphone,
        dayinriqi
      } = this.zhizuo
      if(!(dayintel&&dayinname&&dayinphone&&dayinriqi)){
        this.msgError('请填完所有项目后再点保存')
        return false
      } 
      setDytz({
        ids:this.ids,
        isdayin:'1',
        dayinstarttime,
        dayintel,
        dayinname,
        dayinphone,
        dayinriqi,
        rwpcid:this.zhizuo.rwpcid,
        jgdm:this.zhizuo.jgdm
        }).then(response => {
        this.msgSuccess("制作成功");
        this.zhizuo.isdayin = true
        this.zhzList.forEach(item=>{
          this.addJcfl({
            jglc:'打印通知',
            gjxx:`检查通知书：已打印；纪律告知书：已打印`,
            rwpcid:item.rwpcid,
            jgdm:item.jgdm,
            zhczr:this.$store.getters.name,
            sort:6
          })
        })
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
    width: 600px;
    color:#606266;
    padding-top: 10px;
    .zhizuo-item {
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 5px;
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
        width: 100px;
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
