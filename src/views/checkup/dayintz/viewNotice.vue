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
              disabled
              >
            </el-date-picker>
          </div>
          <div class="zhizuo-item">
            <span>联系人</span>
            <el-input size="small" v-model="zhizuo.dayinname" disabled></el-input>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.dayintel" maxlength="12" disabled></el-input>
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
              disabled
              >
            </el-date-picker>
          </div>
          <div class="zhizuo-item">
            <span>联系电话</span>
            <el-input size="small" v-model="zhizuo.dayinphone" maxlength="12" disabled></el-input>
            <span>(纪律告知书)</span>
          </div>
        </div>
        <div :class="['pre-view']">
          <p class="top-tip">预览通知书</p>
          <jc-notice :pageData="zhizuo"/>
          <div class="dy-xz">
            <el-button type="primary" size="mini" @click="printFile([zhizuo],'jianca')">打印</el-button>
            <el-button type="primary" size="mini" @click="toImage('jcNotice','检查通知书')">下载</el-button>
          </div>
          <jl-notice :pageData="zhizuo"/>
          <div class="dy-xz">
            <el-button type="primary" size="mini" @click="printFile([zhizuo],'jilv')">打印</el-button>
            <el-button type="primary" size="mini" @click="toImage('jlNotice','纪律告知书')">下载</el-button>
          </div>
        </div>
    </div>
    <div v-for="(item,i) in jiancaList" :key="item.id+'jc'" :id="'jianca_'+i" style="display:none">
      <JcNotice :pageData="item"/>
    </div>
    <div v-for="(item,i) in jilvList" :key="item.id+'jl'" :id="'jilv_'+i" style="display:none">
      <JlNotice :pageData="item"/>
    </div>
  </div>
</template> 

<script>
import SingleNotice from './singleNotice.vue'
import JcNotice from './jcNotice.vue'
import JlNotice from './jlNotice.vue'

import html2canvas from 'html2canvas'
import JsPDf from 'jspdf'

export default {
  name: "AddNotice",
  components: {
    SingleNotice,
    JcNotice,
    JlNotice
  },
  data() {
    return {
      // 选中数组
      ids: [],
      // 查询参数
      xzqOptions:[],
      zhizuo:{},
      zhzList:[],
      jiancaList:[],
      jilvList:[]
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
    toImage(id,name){
      const {rwpcid,jgmc} = this.$route.query
      let canvasImg = document.getElementById(id)
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
        PDF.addImage(url,"JPEG",36,25,imgWidth,imgHeight)
        PDF.save(`${[rwpcid,jgmc,name].join('-')}.pdf`)
      })
    },
    printFile(data,key){
      console.log(data,key)
      this[`${key}List`] = [...data]
      setTimeout(() => {
        this.doPrint(key)
      }, 50);
    },
    /**
     * 执行打印
     */
    doPrint(type){
      const dayinList = []
      const newWin = window.open() // 新打开一个空窗口
      const dyList = this[`${type}List`]
      for (let i = 0; i < dyList.length; i++) {
        const imageToPrint = document.getElementById(`${type}_${i}`) // 获取需要打印的内容
        imageToPrint.style.display = 'block'
        dayinList.push(imageToPrint)
        newWin.document.write(imageToPrint.outerHTML) // 将需要打印的内容添加进新的窗口
      }
      const styleSheet = `<style>.print-area{width:669px;height:1020px;margin:auto}</style>`
      newWin.document.head.innerHTML = styleSheet // 给打印的内容加上样式
      newWin.document.close() // 在IE浏览器中使用必须添加这一句
      newWin.focus() // 在IE浏览器中使用必须添加这一句
      setTimeout(function() {
          newWin.print() // 打印
          newWin.close() // 关闭窗口
      }, 10)
      dayinList.forEach(item=>{
        item.style.display = 'none'
      })
    },
    dayinBack(){
      this.zhzList = []
      window.localStorage.removeItem('PRDATA')
      this.$router.back(-1)
    },
    // 行政区字典翻译
    xzqFormat(row, column) {
      return this.selectDictLabels(this.xzqOptions, row.xzq);
    },
    
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
    width: 500px;
    color:#606266;
    padding-top: 10px;
    .zhizuo-item {
      display: flex;
      font-size: 14px;
      align-items: center;
      margin-bottom: 5px;
      &::v-deep .el-input__inner {
        color:#303313;
        width: 290px;
        margin-right: 5px;
      }
      &::v-deep .el-date-editor.el-input {
        width: 290px;
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
    padding-left:40px;
    padding-right:20px;
    padding-bottom: 20px;
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
    .dy-xz {
      text-align: right;
      padding:10px 0;
    }
  }
}
</style>
