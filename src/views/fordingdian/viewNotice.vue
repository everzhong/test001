<template>
  <div class="app-container" v-loading="loading" style="padding-top:20px">
    <div class="zhizuo-port">
      <div :class="['pre-view']">
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
    <div id='jianca_0' style="display:none">
      <JcNotice :pageData="zhizuo"/>
    </div>
    <div id='jilv_0' style="display:none">
      <JlNotice :pageData="zhizuo"/>
    </div>
  </div>
</template> 
<script>
import { listRenwutwo } from "@/api/renwu/renwutwo"
import SingleNotice from '../checkup/dayintz/singleNotice.vue'
import JcNotice from '../checkup/dayintz/jcNotice.vue'
import JlNotice from '../checkup/dayintz/jlNotice.vue'

import html2canvas from 'html2canvas'
import JsPDf from 'jspdf'

export default {
  name: "Vtmp",
  components: {
    SingleNotice,
    JcNotice,
    JlNotice
  },
  data() {
    return {
      loading:false,
      zhizuo:{},
      zhzList:[],
      queryParams: {
        pageNum: 1,
        pageSize: 500,
      },
    };
  },
  created() {
    this.getList();
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
    async getList(){
      const {jgdm,rwpcid} =  this.$route.query
      this.loading = true
      try {
        const res = await listRenwutwo({
          jgdm:jgdm||'',
          rwpcid:rwpcid||'',
          ...this.queryParams
        })
        if(res.code==200 || res.code==0) {
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
    justify-content: center
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
