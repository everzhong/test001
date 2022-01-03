<template>
  <section>
    <div id="printJc" class="print-area" ref="printJc" style="width:635px;padding:0px;flex-shrink:0;margin-bottom:15px">
      <h1 style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 15px">上海市医疗保险监督检查所</h1>
      <p style="font-size: 14px;text-align: center;letter-spacing: 5px;margin-bottom: 10px;">行政执法文书</p>
      <div style="text-align:right;font-size:12px;margin-bottom:10px;margin-right:10px;margin-top:10px;">沪/医保案立{{pageData.wjh}}号</div>
        <section style="padding: 20px 40px;font-size: 14px;border: 1px solid #303313;">
          <div style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 45px;">{{noLian?'不予':''}}立案报告</div>
          <div style="margin-bottom:20px">
            <span style="width:60%;display:inline-block">案件受理编号：{{pageData.slbh}}</span>
            <span style="width:40%;display:inline-block;text-align:right">受理时间：<span style="margin:0 5px 0 0;">{{parseTime(pageData.cbrq,'{y}')}}</span>年<span style="margin:0 8px">{{parseTime(pageData.cbrq,'{m}')}}</span>月<span style="margin:0 8px">{{parseTime(pageData.cbrq,'{d}')}}</span>日</span>
          </div>
          <div style="margin-bottom:20px">
            <span style="width:100%;display:inline-block">案件来源：{{pageData.ajly}}</span>
          </div>
          <div style="margin-bottom:20px">
            <span style="width:100%;display:inline-block;margin-bottom:20px">举报人/检查部门（单位）信息：</span>
            <div style="padding-left:50px;">
              姓名（单位名称）：<span style="text-align:center;min-width:90px;display:inline-block;border-bottom:1px solid #454545">{{pageData.jbr}}</span>，&nbsp;&nbsp;联系电话：<span style="text-align:center;min-width:120px;display:inline-block;border-bottom:1px solid #454545">{{pageData.jbrdh}}</span>
            </div>
          </div>
          <div style="margin-bottom:20px">
            <span style="width:100%;display:inline-block;margin-bottom:20px">被举报人/被检查人（单位）信息：</span>
            <div style="padding-left:50px;margin-bottom:15px">
              姓名（单位名称）：<span style="text-align:center;min-width:90px;display:inline-block;border-bottom:1px solid #454545">{{pageData.bjbr}}</span>，&nbsp;&nbsp;联系电话：<span style="text-align:center;min-width:120px;display:inline-block;border-bottom:1px solid #454545">{{pageData.lxdh}}</span>
            </div>
            <div style="padding-left:50px;">
              身份证号码（机构代码）：<span style="min-width:180px;display:inline-block;border-bottom:1px solid #454545">{{pageData.sid}}</span>
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
              <p style="margin-bottom:10px">承办人（签名）：<span style="width:108px;display:inline-block;border-bottom:1px solid #454545;text-align:center">{{pageData.cbr}}</span></p>
              <p style="text-align:right"><span style="display:inline-block;min-width:30px;text-align:center">{{parseTime(pageData.cbrq,'{y}')}}</span >年<span style="display:inline-block;min-width:30px;text-align:center">{{parseTime(pageData.cbrq,'{m}')}}</span>月<span style="display:inline-block;min-width:30px;text-align:center">{{parseTime(pageData.cbrq,'{d}')}}</span>日</p>
            </div>
          </div>
        </section>
      <div style="font-size:14px;border:1px solid #303313;border-top:none;padding:10px 40px 10px;">
        负责人审批意见：
        <div style="padding-left:50px;margin-top:15px;font-size:14px;">
          本案自<span style="text-align:center;min-width:60px;display:inline-block;border-bottom:1px solid #454545">{{parseTime(pageData.cbrq,'{y}')}}</span>年<span style="text-align:center;min-width:60px;display:inline-block;border-bottom:1px solid #454545">{{parseTime(pageData.cbrq,'{m}')}}</span>月<span style="text-align:center;min-width:60px;display:inline-block;border-bottom:1px solid #454545">{{parseTime(pageData.cbrq,'{d}')}}</span>日起立案，由<span style="text-align:center;min-width:140px;display:inline-block;border-bottom:1px solid #454545">{{pageData.cbr}}</span>承办
        </div>
        <div style="margin-top:30px;font-size:14px;">
            <div style="width:60%;display:inline-block;margin-bottom:20px"></div>
            <div style="width:40%;display:inline-block;margin-bottom:10px">
              <p style="margin-bottom:10px">负责人（签名）：<span style="width:108px;display:inline-block;border-bottom:1px solid #454545"></span></p>
              <!-- <p style="text-align:right"><span style="margin-left:30px">年</span ><span style="margin-left:15px">月</span><span style="margin-left:15px">日</span></p> -->
              <p style="text-align:right"><span style="display:inline-block;min-width:30px;text-align:center"></span >年<span style="display:inline-block;min-width:30px;text-align:center"></span>月<span style="display:inline-block;min-width:30px;text-align:center"></span>日</p>
            </div>
          </div>
      </div>
    </div>
    <div style="text-align:right;margin-bottom:30px;" v-if="!noPrint">
      <el-button @click="printFile()" size="small" type="primary">打印</el-button>
    </div>
  </section>
</template>
<script>
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
  },
}
</script>