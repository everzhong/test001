<template>
  <section>
    <div id="printJc" class="print-area" ref="printJc" style="width:635px;padding:0px;flex-shrink:0">
      <h1 style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 15px">上海市医疗保险监督检查所 </h1>
      <p style="font-size: 14px;text-align: center;letter-spacing: 5px;margin-bottom: 10px;">行政执法文书</p>
      <div style="text-align:right;font-size:12px;margin-bottom:10px;margin-right:10px;margin-top:10px;">沪/×医保监督通（××××）×号</div>
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
            <p style="width:100%;margin-bottom:10px;;text-align:right">上海市医疗保险监督检查所</p>
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
    <!-- <div style="text-align:right;padding-right:19px"> -->
      <!-- <el-button type="primary" v-print="printJianchs" size="mini" >打印</el-button> -->
      <!-- <el-button type="primary" size="mini" @click="printEvent('printJc')">打印</el-button> -->
    <!-- </div> -->
    <div id="printJl" class="print-area" ref="printJl" style="width:635px;padding:0px;flex-shrink:0">
      <h1 style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 15px">上海市医疗保险监督检查所</h1>
      <p style="font-size: 14px;text-align: center;letter-spacing: 5px;margin-bottom: 10px;">行政执法文书</p>
      <section style="padding: 20px 40px;font-size: 14px;border: 1px solid #303313;">
        <div style="font-weight: 600;font-size: 16px;text-align: center;margin-bottom: 30px;">监督检查纪律告知书</div>
        <div style="text-align: left;display:inline-block;border-bottom: 1px solid #330313;margin-bottom: 20px;min-width:150px">{{pageData.jgmc?(pageData.jgmc+'：'):''}}</div>
        <div style="text-indent: 2em;letter-spacing: 2px;margin-top: 10px;margin-bottom: 20px;text-align: justify;">根据《上海市基本医疗保险监督管理办法》（市政府第31号令）的有关规定和工作安排，我所自
          <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 60px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{y}')}}</span>年
          <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 40px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{m}')}}</span>月
          <span style="text-indent: 0;text-align: center;display: inline-block;min-width: 40px;border-bottom: 1px solid #303313;"> {{parseTime(pageData.dayinstarttime,'{d}')}}</span>日起，对你单位实施医疗保险监督检查。现将监督检查纪律告知如下：
        </div>
        <div style="padding-left:2em;line-height:30px;margin-bottom:20px">
          一、严禁辱骂、殴打当事人。<br/>
          二、严禁侵占、挪用、损毁当事人的财物。<br/>
          三、严禁隐瞒、包庇、纵容违法行为。<br/>
          四、严禁接受当事人的吃请、送礼。<br/>
          五、严禁在工作期间饮酒。<br/>
          六、严禁由被检查单位和个人报销或补贴住宿、餐饮、交通、通讯、医疗等费用。<br/>
          七、严禁接受被检查单位和个人赠送的礼品礼金，及未经批准通过授课等方式获取报酬。<br/>
          八、严禁接受被检查单位和个人的请托干预监督检查工作。<br/>
          九、严禁向被检查单位推销商品或介绍业务。<br/>
          十、严禁利用监督检查工作知悉的内部信息谋取利益。<br/>
          对于违反上述纪律者，按照相关规定处理。<br/>
          联系电话：{{pageData.dayinphone}}
        </div>
        <div style="text-align:right;margin-bottom:30px">
          <p style="text-align:right;margin-bottom:10px">上海市医疗保险监督检查所</p>
          <p style="text-align:right">
            <span style="margin-right:5px">{{parseTime(pageData.dayinriqi,'{y}')}}</span>年
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{m}')}}</span>月
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{d}')}}</span>日
          </p>
        </div>
        <p style="text-indent:2em;font-weight:600;margin-bottom:30px">以上内容检查组已告知我单位，我单位将按要求积极支持检查组执行好各项纪律。</p>
        <div style="text-align:right;margin-bottom:30px">
          <p style="text-align:right;margin-bottom:10px">{{pageData.jgmc}}（盖章）</p>
          <p style="text-align:right">
            <span style="margin-right:5px">{{parseTime(pageData.dayinriqi,'{y}')}}</span>年
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{m}')}}</span>月
            <span style="margin:0 5px">{{parseTime(pageData.dayinriqi,'{d}')}}</span>日
          </p>
        </div>
      </section>
      <div style="border:1px solid #303313;border-top:none;padding:3px 20px 10px;">备注：本文书一式三份，一份留存执法案卷，一份交被检机构，一份张贴检查室门上。</div>
    </div>
    <!-- <div style="text-align:right;padding-right:19px">
      <el-button size="mini" type="primary" v-print="printJilv">打印</el-button>
      <el-button size="mini" type="primary" @click="printEvent('printJl')">打印</el-button>
    </div> -->
  </section>
</template>
<script>
export default {
  name:'SingleNotice',
  data(){
    return {
      //  printJianchs: {
      //   id: "printJc",
      //   popTitle: "监督检查通知书",
      // },
      // printJilv: {
      //   id: "printJl",
      //   popTitle: "监督检查纪律告知书",
      // },
    }
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