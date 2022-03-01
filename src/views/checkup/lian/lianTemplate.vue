<template>
  <section>
    <div id="printJc" class="print-area" ref="printJc" style="width:635px;padding:0px;flex-shrink:0;margin-bottom:15px">
      <h1 style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 15px">上海市医疗保险监督检查所</h1>
      <p style="font-size: 14px;text-align: center;letter-spacing: 5px;margin-bottom: 10px;">行政执法文书</p>
      <div style="text-align:right;font-size:12px;margin-bottom:10px;margin-right:10px;margin-top:10px;">沪/医保案立{{pageData.slbh}}号</div>
        <section style="padding: 20px 40px;font-size: 14px;border: 1px solid #303313;">
          <div style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 45px;">{{noLian?'不予':''}}立案报告</div>
          <div style="margin-bottom:20px">
            <span style="width:60%;display:inline-block">案件受理编号：{{pageData.slbh}}</span>
            <span style="width:40%;display:inline-block;text-align:right">受理时间：<span style="margin:0 5px 0 0;">{{parseTime(pageData.lianrq,'{y}')}}</span>年<span style="margin:0 8px">{{parseTime(pageData.lianrq,'{m}')}}</span>月<span style="margin:0 8px">{{parseTime(pageData.lianrq,'{d}')}}</span>日</span>
          </div>
          <div style="margin-bottom:20px">
            <span style="width:100%;display:inline-block">案件来源：{{selectDictLabels($store.getters.ajlyDic, pageData.ajly)}}</span>
          </div>
          <div style="margin-bottom:20px">
            <span style="width:100%;display:inline-block;margin-bottom:20px">举报人/检查部门（单位）信息：</span>
            <div style="padding-left:50px;margin-bottom:15px">
              单位名称：<span style="text-align:center;display:inline-block;">上海市医疗保障局监督检查所</span>
            </div>
            <div style="padding-left:50px;">
              联系电话：<span style="text-align:center;display:inline-block;">{{pageData.jcbmdh}}</span>
            </div>
          </div>
          <div style="margin-bottom:20px">
            <span style="width:100%;display:inline-block;margin-bottom:20px">被举报人/被检查人（单位）信息：</span>
            <div style="padding-left:50px;margin-bottom:15px">
              单位名称：<span style="text-align:center;display:inline-block;">{{pageData.jgmc}}</span>
            </div>
            <div style="padding-left:50px;margin-bottom:15px">
              联系电话：<span style="text-align:center;display:inline-block;">{{pageData.lxdh}}</span>
            </div>
            <div style="padding-left:50px;">
              机构代码：<span style="display:inline-block">{{pageData.sid}}</span>
            </div>
          </div>
          <div style="margin-bottom:20px">
            <span style="width:100%;display:inline-block;margin-bottom:15px">案情摘要：</span>
            <div style="padding-left:50px;margin-bottom:40px">{{pageData.ajzy}}</div>
            <div v-if="noLian" style="padding-left:50px;margin-bottom:25px">经初步核实，不符合立案条件，建议不予立案。</div>
          </div>
          <div>
            <div style="width:60%;display:inline-block;margin-bottom:20px"></div>
            <div style="width:40%;display:inline-block;margin-bottom:10px">
              <p style="margin-bottom:10px">承办人（签名）：<span style="width:108px;display:inline-block;text-align:center">{{pageData.cbr}}</span></p>
              <p style="text-align:right"><span style="display:inline-block;min-width:30px;text-align:center">{{parseTime(pageData.cbrq,'{y}')}}</span >年<span style="display:inline-block;min-width:30px;text-align:center">{{parseTime(pageData.cbrq,'{m}')}}</span>月<span style="display:inline-block;min-width:30px;text-align:center">{{parseTime(pageData.cbrq,'{d}')}}</span>日</p>
            </div>
          </div>
        </section>
      <div style="font-size:14px;border:1px solid #303313;border-top:none;padding:10px 40px 10px;">
        负责人审批意见：
        <div v-if="!noLian" style="padding-left:50px;margin-top:15px;font-size:14px;">
          本案自<span style="text-align:center;min-width:60px;display:inline-block;padding:0 5px;border-bottom:1px solid #000">{{parseTime(pageData.cbrq,'{y}年{m}月{d}日')}}</span>起立案，由<span style="text-align:center;min-width:60px;display:inline-block;padding:0 5px;border-bottom:1px solid #000">{{pageData.cbr}}</span>承办
        </div>
        <div v-else style="margin-top:15px">{{pageData.lianyy}}</div>
        <div style="margin-top:30px;font-size:14px;">
            <div style="width:60%;display:inline-block;margin-bottom:20px"></div>
            <div style="width:40%;display:inline-block;margin-bottom:10px">
              <p style="margin-bottom:10px">负责人（签名）：<span style="width:108px;display:inline-block;"></span></p>
              <p style="text-align:right"><span style="display:inline-block;min-width:30px;text-align:center"></span >年<span style="display:inline-block;min-width:30px;text-align:center"></span>月<span style="display:inline-block;min-width:30px;text-align:center"></span>日</p>
            </div>
          </div>
      </div>
    </div>
    <div style="text-align:right;margin-bottom:30px;" v-if="!noPrint">
      <el-button @click ="toImage()" size="mini" type="primary">下载</el-button>
      <el-button @click="printFile()" size="mini" type="primary">打印</el-button>
    </div>
  </section>
</template>
<script>
import html2canvas from 'html2canvas'
import JsPDf from 'jspdf'
export default {
  name:'LianTemplate',
  data(){
    return {}
  },
  props:['pageData','noLian','noPrint'],
  methods:{
    printFile(){
      const newWin = window.open() // 新打开一个空窗口
      const imageToPrint = document.getElementById('printJc') // 获取需要打印的内容
      newWin.document.write(imageToPrint.outerHTML) // 将需要打印的内容添加进新的窗口
      const styleSheet = `<style>.print-area{width:669px;height:1020px;margin:auto}</style>`
      newWin.document.head.innerHTML = styleSheet // 给打印的内容加上样式
      newWin.document.close() // 在IE浏览器中使用必须添加这一句
      newWin.focus() // 在IE浏览器中使用必须添加这一句
      setTimeout(function() {
          newWin.print() // 打印
          newWin.close() // 关闭窗口
      }, 10)
    },
    toImage(){
      const name = `${this.noLian?'不予':''}立案报告`
      const {rwpcid,jgmc} = this.pageData
      let canvasImg = document.getElementById('printJc')
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
  },
}
</script>