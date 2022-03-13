<template>
  <section id="jcNotice">
    <div class="print-area" ref="printJc" style="width:635px;padding:0px;flex-shrink:0">
      <h1 style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 15px">上海市医疗保障局监督检查所 </h1>
      <p style="font-size: 14px;text-align: center;letter-spacing: 5px;margin-bottom: 10px;">行政执法文书</p>
      <div style="text-align:right;font-size:12px;margin-bottom:10px;margin-right:10px;margin-top:10px;">沪医保监督通{{$route.query.wjh}}号</div>
        <section style="padding: 20px 40px;font-size: 14px;border: 1px solid #303313;">
          <div style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 45px;">监督检查通知书</div>
          <div style="text-align: left;display:inline-block;border-bottom: 1px solid #330313;margin-bottom: 30px;min-width:80px">{{pageData.jgmc?(pageData.jgmc+'：'):''}}</div>
          <div style="text-indent: 2em;letter-spacing: 2px;margin-top: 10px;margin-bottom: 20px;text-align: justify;">根据《上海市基本医疗保险监督管理办法》（市政府第31号令）的有关规定，决定于
            <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 60px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{y}')}}</span>年
            <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 40px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{m}')}}</span>月
            <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 40px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{d}')}}</span>日起对你单位实施医疗保险监督检查。请予配合，并按要求提供相关资料。
          </div>
          <p style="margin-bottom:60px">(监督检查具体内容和要求见附件)</p>
          <div style="margin-bottom:25px">
            <span style="width:60%;display:inline-block">联系人：{{pageData.dayinname}}</span>
            <span style="width:40%;display:inline-block;text-align:right">联系电话：<span style="display:inline-block;width:40%">{{pageData.dayintel}}</span></span>
          </div>
          <div style="text-align:right;margin-bottom:70px">
            <p style="width:100%;margin-bottom:10px;;text-align:right">上海市医疗保障局监督检查所</p>
            <p style="width:40%;text-align:left;margin-left:60%;text-align:right">
              <span style="margin-right:5px">{{parseTime(pageData.dayinriqi,'{y}')}}</span>年
              <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{m}')}}</span>月
              <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{d}')}}</span>日
            </p>
          </div>
          <div>
            <div style="width:60%;display:inline-block;margin-bottom:20px">
              <p style="margin-bottom:10px">送达人（签名）：</p>
              <p><span style="margin-left:30px">年</span ><span style="margin-left:15px">月</span><span style="margin-left:15px">日</span></p>
            </div>
            <div style="width:40%;display:inline-block;margin-bottom:10px">
              <p style="margin-bottom:10px">收件人（签名）：</p>
              <p><span style="margin-left:30px">年</span ><span style="margin-left:15px">月</span><span style="margin-left:15px">日</span></p>
            </div>
          </div>
        </section>
      <div style="border:1px solid #303313;border-top:none;padding:3px 20px 20px;">备注：本文书一式二份，一份留存执法案卷，一份交被检机构。</div>
      </div>
  </section>
</template>
<script>
export default {
  name:'JcNotice',
  data(){
    return {}
  },
  mounted(){
  },
  props:['pageData'],
  methods:{
    printEvent(ref) {
      this.$print(this.$refs[ref])
    }
  },
}
</script>